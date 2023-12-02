import { Release, formatXML } from '@ssh/audiosalad-xml'
import type { QueryResolvers, MutationResolvers } from 'types/graphql'

import { ForbiddenError } from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'

export const releases: QueryResolvers['releases'] = () => {
  const currentUser = context.currentUser
  // If the requested user is not the logged-in user and the logged-in user is not an admin
  if (currentUser.roles !== 'admin') {
    throw new ForbiddenError(
      'You do not have the privileges to access this data.'
    )
  }
  return db.release.findMany()
}

export const releasesPerUser: QueryResolvers['releasesPerUser'] = ({
  id,
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
    where: { id, userId },
  })
}

export const release: QueryResolvers['release'] = ({ id }) => {
  return db.release.findUnique({
    where: { id },
  })
}

export const createRelease: MutationResolvers['createRelease'] = async ({
  input,
}) => {
  const {
    metadata: {
      songTitle,
      productTitle,
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
        productTitle,
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

    return true
  } catch (e) {
    console.log(e)
    throw new Error('Error creating release')
  }
}

export const updateRelease: MutationResolvers['updateRelease'] = ({
  id,
  input,
}) => {
  return db.release.update({
    data: input,
    where: { id },
  })
}

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
    throw new Error('Error deleting release')
  }
}

// Start custom logic related to AudioSalad

// export const prepareMetadataForAudioSalad = async (releaseData) => {
//   try {
//     const data: Partial<Release> = {
//       label: {
//         vendorLabelID: releaseData.label.id,
//         xml: {
//           vendorLabelID: releaseData.label.id,
//         },
//       },
//     }
//     return xmlData
//   } catch (e) {
//     console.log(e)
//     throw new Error('Error preparing metadata for AudioSalad')
//   }
// }
