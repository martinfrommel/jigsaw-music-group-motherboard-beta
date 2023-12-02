import type { QueryResolvers, MutationResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

export const releases: QueryResolvers['releases'] = () => {
  return db.release.findMany()
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

export const deleteRelease: MutationResolvers['deleteRelease'] = ({ id }) => {
  return db.release.delete({
    where: { id },
  })
}
