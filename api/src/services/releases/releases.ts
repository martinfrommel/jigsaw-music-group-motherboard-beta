import { PutObjectCommand } from '@aws-sdk/client-s3'
import type { QueryResolvers, MutationResolvers } from 'types/graphql'

import {
  ForbiddenError,
  UserInputError,
  ValidationError,
} from '@redwoodjs/graphql-server'

import {
  changeIngestionStatus,
  initiateIngestion,
  scanForIngestion,
} from 'src/lib/audioSaladHelpers'
import { db } from 'src/lib/db'
import { prepareMetadataForAudioSalad } from 'src/lib/formatters/prepareMetadataForAudioSalad'
import { initializeS3Client } from 'src/lib/s3Helpers/initializeS3Client'

/**
 * Retrieves a list of releases.
 *
 * @returns {Promise<Release[]>} A promise that resolves to an array of releases.
 * @throws {ForbiddenError} If the current user does not have the privileges to access this data.
 */
export const releases: QueryResolvers['releases'] = async () => {
  const currentUser = context.currentUser
  // If the requested user is not the logged-in user and the logged-in user is not an admin
  if (currentUser.roles !== 'admin') {
    throw new ForbiddenError(
      '⛔️ You do not have the privileges to access this data.'
    )
  }
  const releases = await db.release.findMany({
    include: { label: true, user: true },
    orderBy: { createdAt: 'desc' },
  })

  // // Fetch the latest ingestion status for releases that are being ingested
  // for (const release of releases) {
  //   if (release.ingestionStatus === 'processing') {
  //     try {
  //       const ingestionStatus = await getIngestionStatus({ id: release.id })

  //       if (ingestionStatus === 'complete') {
  //         // Change the ingestion status to 'complete'
  //         changeIngestionStatus({ status: 'complete', id: release.id })
  //       }

  //       if (ingestionStatus === 'error') {
  //         // Change the ingestion status to 'error'
  //         changeIngestionStatus({ status: 'error', id: release.id })
  //       }

  //       if (ingestionStatus === 'processing') {
  //         // Change the ingestion status to 'pending'
  //         changeIngestionStatus({ status: 'processing', id: release.id })
  //       }

  //       // Update the ingestion status in the database
  //     } catch (e) {
  //       console.error('⛔️ Error fetching ingestion status:', e)
  //     }
  //   }
  // }

  return releases
}

/**
 * Retrieves releases for a specific user.
 * Users can only access their own releases.
 *
 * @param {Object} args - The arguments for the query.
 * @param {string} args.userId - The ID of the user.
 * @returns {Promise<Array<Release>>} - A promise that resolves to an array of releases.
 * @throws {ForbiddenError} - If the user does not have the privileges to access this data.
 */
export const releasesPerUser: QueryResolvers['releasesPerUser'] = async ({
  userId,
}) => {
  const currentUser = context.currentUser
  // If the requested user is not the logged-in user and the logged-in user is not an admin
  if (!currentUser) {
    throw new ForbiddenError(
      '⛔️ You do not have the privileges to access this data.'
    )
  }
  const releases = await db.release.findMany({
    include: { label: true, user: true },
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })

  return releases
}

export const release: QueryResolvers['release'] = ({ id, userId }) => {
  // Check if the user is an admin or the owner of the release
  if (
    !context.currentUser ||
    !context.currentUser.roles.includes('admin') ||
    context.currentUser.id !== userId
  ) {
    throw new ForbiddenError('⛔️ You do not have the privileges to do this.')
  }
  // Return the release
  return db.release.findUnique({
    where: { id, userId },
  })
}

/**
 * Creates a new release.
 * @param input - The input object containing the release details.
 * @returns A boolean indicating whether the release was created successfully.
 * @throws An error if there was an issue creating the release.
 */
export const createRelease: MutationResolvers['createRelease'] = async ({
  input,
}) => {
  const {
    metadata: {
      songTitle,
      artist,
      featuredArtist,
      previouslyReleased,
      language,
      primaryGenre,
      secondaryGenre,
      explicitLyrics,
      isrcCode,
      pLine,
      cLine,
      label,
    },
    userId,
    ...otherFields
  } = input

  let labelId = parseInt(label.id)

  try {
    // Check if the label exists
    const existingLabel = await db.label.findUnique({
      where: { id: labelId },
    })

    // If the label does not exist, create it
    if (!existingLabel) {
      const newLabel = await db.label.create({
        data: {
          id: labelId,
          name: label.name,
        },
      })
      labelId = newLabel.id // Use the id of the newly created label
    }

    // Create the release with the appropriate labelId and return its id
    const createdRelease = await db.release.create({
      data: {
        ...otherFields,
        songTitle,
        artist,
        featuredArtist,
        previouslyReleased,
        language,
        primaryGenre,
        secondaryGenre,
        explicitLyrics,
        isrcCode,
        pLine,
        cLine,
        label: {
          connect: {
            id: labelId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    })

    const payload = await prepareMetadataForAudioSalad(input)

    const parts = input.AWSFolderKey.split('/')
    const uploadsIndex = parts.indexOf('uploads')
    let folder = parts.slice(uploadsIndex).join('/')

    // Remove trailing slash if it exists
    if (folder.endsWith('/')) {
      folder = folder.slice(0, -1)
    }

    console.log('Folder: ' + folder)
    const s3 = await initializeS3Client()

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `${folder}/metadata.xml`,
      Body: payload,
      ContentType: 'application/xml',
    }

    console.log('🦆 Trying to upload the metadata to: ' + params.Key)
    const s3Response = await s3.send(new PutObjectCommand(params))
    console.log(
      '📊 Response from S3 upload: ' + s3Response.$metadata.httpStatusCode
    )

    const audioSaladScan = scanForIngestion({
      s3bucket: `${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`,
      s3path: `/${folder}/`,
    })

    if ((await audioSaladScan).status === 200) {
      console.log('✅ Scan successful, changing ingestion status')
      changeIngestionStatus({
        status: 'pending',
        id: createdRelease.id,
      })
      const handshakeParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `${folder}/delivery.complete`,
        Body: null,
        ContentType: 'text/plain',
      }
      console.log(
        '🦆 Trying to upload the delivery.complete to: ' + handshakeParams.Key
      )
      const deliveryComplete = await s3.send(
        new PutObjectCommand(handshakeParams)
      )
      console.log(
        '📊 Response from S3 handshake: ' +
          deliveryComplete.$metadata.httpStatusCode
      )
    }

    if ((await audioSaladScan).status !== 200) {
      console.log('⛔️ Scan failed, changing ingestion status')
      changeIngestionStatus({
        status: 'error',
        id: createdRelease.id,
      })
    }

    return (await audioSaladScan).status
  } catch (e) {
    console.log(e)
    throw new Error('⛔️ Error creating release')
  }
}

/**
 * Updates a release in the database.
 * @param {object} args - The arguments for updating a release.
 * @param {string} args.id - The ID of the release to update.
 * @param {object} args.input - The updated data for the release.
 * @returns {Promise<object>} - A promise that resolves to the updated release.
 */
export const updateRelease: MutationResolvers['updateRelease'] = ({
  id,
  input,
}) => {
  return db.release.update({
    data: input,
    where: { id },
  })
}

/**
 * Deletes a release.
 *
 * @param {object} args - The arguments for deleting a release.
 * @param {string} args.id - The ID of the release to delete.
 * @param {string} args.userId - The ID of the user performing the deletion.
 * @returns {Promise<object>} - A promise that resolves to the deleted release.
 * @throws {ForbiddenError} - If the user does not have the privileges to delete the release.
 * @throws {Error} - If there is an error deleting the release.
 */
export const deleteRelease: MutationResolvers['deleteRelease'] = ({
  id,
  userId,
}) => {
  // Check if the user is an admin or the owner of the release
  if (
    !context.currentUser ||
    !context.currentUser.roles.includes('admin') ||
    context.currentUser.id !== userId
  ) {
    throw new ForbiddenError('You do not have the privileges to do this.')
  }

  try {
    return db.release.delete({
      where: { id },
    })
  } catch (e) {
    console.log(e)
    throw new Error('Error deleting release' + e)
  }
}

export const runIngestion: MutationResolvers['runIngestion'] = async ({
  id,
  userId,
}) => {
  if (!context.currentUser) {
    throw new ForbiddenError('⛔️ You are not authenticated.')
  }

  if (
    !context.currentUser.roles.includes('admin') ||
    context.currentUser.id !== userId
  ) {
    throw new ForbiddenError('⛔️ You do not have the privileges to do this.')
  }

  try {
    const release = await db.release.findUnique({ where: { id } })
    if (!release) {
      throw new UserInputError('Release not found')
    }

    const audioSaladScanResult = await scanForIngestion({
      s3bucket: `${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`,
      s3path: `/${release.AWSFolderKey}/`,
    })

    if (audioSaladScanResult.status !== 200) {
      console.log('⛔️ Scan failed, changing ingestion status')
      await changeIngestionStatus({ status: 'error', id: release.id })
      throw new ValidationError('Scan failed: ' + audioSaladScanResult.body)
    }

    const response = await initiateIngestion({ releaseId: release.id })
    if (response.status !== 200) {
      console.log('⛔️ Ingestion failed, changing ingestion status')
      await changeIngestionStatus({ status: 'error', id: release.id })
      throw new ValidationError('Ingestion failed: ' + response.body)
    }

    return release
  } catch (e) {
    console.error(e)
    throw new ValidationError('Error running release ingestion: ' + e.message)
  }
}
