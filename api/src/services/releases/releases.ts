import { PutObjectCommand } from '@aws-sdk/client-s3'
import { fetch } from '@whatwg-node/fetch'
import type { QueryResolvers, MutationResolvers } from 'types/graphql'

import { ForbiddenError } from '@redwoodjs/graphql-server'

import { scanForIngestion } from 'src/lib/audioSaladHelpers'
import { db } from 'src/lib/db'
import { prepareMetadataForAudioSalad } from 'src/lib/formatters/prepareMetadataForAudioSalad'
import { initializeS3Client } from 'src/lib/s3Helpers/initializeS3Client'

/**
 * Retrieves a list of releases.
 *
 * @returns {Promise<Release[]>} A promise that resolves to an array of releases.
 * @throws {ForbiddenError} If the current user does not have the privileges to access this data.
 */
export const releases: QueryResolvers['releases'] = () => {
  const currentUser = context.currentUser
  // If the requested user is not the logged-in user and the logged-in user is not an admin
  if (currentUser.roles !== 'admin') {
    throw new ForbiddenError(
      'You do not have the privileges to access this data.'
    )
  }
  return db.release.findMany({
    include: { label: true, user: true },
    orderBy: { createdAt: 'desc' },
  })
}

/**
 * Retrieves releases for a specific user.
 *
 * @param {Object} args - The arguments for the query resolver.
 * @param {number} args.id - The ID of the release.
 * @param {number} args.userId - The ID of the user.
 * @returns {Promise<Release[]>} - A promise that resolves to an array of releases.
 * @throws {ForbiddenError} - If the current user does not have the privileges to access the data.
 */
export const releasesPerUser: QueryResolvers['releasesPerUser'] = ({
  userId,
}) => {
  const currentUser = context.currentUser
  // If the requested user is not the logged-in user and the logged-in user is not an admin
  if (currentUser.roles !== 'admin') {
    throw new ForbiddenError(
      'You do not have the privileges to access this data.'
    )
  }
  return db.release.findMany({
    orderBy: { createdAt: 'desc' },
    where: { userId },
    include: { label: true, user: true },
  })
}

export const release: QueryResolvers['release'] = ({ id, userId }) => {
  // Check if the user is an admin or the owner of the release
  if (
    !context.currentUser ||
    !context.currentUser.roles.includes('admin') ||
    context.currentUser.id !== userId
  ) {
    throw new ForbiddenError('You do not have the privileges to do this.')
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
      iscUpcCode,
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

    // Create the release with the appropriate labelId
    await db.release.create({
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
        iscUpcCode,
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

    const s3Response = await s3.send(new PutObjectCommand(params))
    console.log(
      'Response from S3 upload: ' + s3Response.$metadata.httpStatusCode
    )

    const audioSaladScan = scanForIngestion({
      s3bucket: process.env.AWS_S3_BUCKET_NAME,
      s3path: folder,
    })
    console.log(
      'Response from AudioSalad scan: ' + (await audioSaladScan).status
    )
    return true
  } catch (e) {
    console.log(e)
    throw new Error('Error creating release')
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
