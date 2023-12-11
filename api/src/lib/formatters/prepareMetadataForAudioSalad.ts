import {
  Action,
  Asset,
  GenreType,
  Label,
  Participant,
  ParticipantRole,
  Release,
  ReleaseFormat,
  Track,
} from '@ssh/audiosalad-xml'
import { CreateReleaseInput } from 'types/graphql'

import { getAssetDetail } from '../s3Helpers/getAssetDetails'
import { initializeS3Client } from '../s3Helpers/initializeS3Client'

/**
 * Prepares metadata for AudioSalad.
 * @param releaseData - The release data.
 * @returns The XML representation of the release object.
 * @throws Error if there is an error creating the release.
 */
export const prepareMetadataForAudioSalad = async (
  releaseData: CreateReleaseInput
) => {
  const s3 = await initializeS3Client()

  console.log('✅ S3 client initialized...')

  const songMasterDetails = await getAssetDetail(
    releaseData.songMasterReference,
    s3
  )
  const songArtworkDetails = await getAssetDetail(
    releaseData.songArtworkReference,
    s3
  )

  try {
    const createReleaseObject = new Release({
      action: Action.Add,
      metadataLanguage: 'en',
      title: releaseData.metadata.songTitle,
      releaseFormat: ReleaseFormat.Single,
      displayArtist: releaseData.metadata.artist[0],
      participants: [
        ...releaseData.metadata.artist.map(
          (artist, index) =>
            new Participant({
              role: ParticipantRole.MainArtist,
              name: artist,
              primary: index === 0 ? true : false,
            })
        ),
        ...(releaseData.metadata.featuredArtist
          ? [
              new Participant({
                role: ParticipantRole.FeaturedArtist,
                name: releaseData.metadata.featuredArtist,
                primary: false,
              }),
            ]
          : []),
      ],
      tracks: [
        new Track({
          title: releaseData.metadata.songTitle,
          genres: [
            new GenreType({
              primary: releaseData.metadata.primaryGenre,
              sub: releaseData.metadata.secondaryGenre,
            }),
          ],
          audioLanguage: releaseData.metadata.language,
          advisory: releaseData.metadata.explicitLyrics ? 'explicit' : 'clean',
          isrc: releaseData.metadata.isrcCode
            ? releaseData.metadata.isrcCode
            : undefined,
          pInfo: releaseData.metadata.pLine,
          cInfo: releaseData.metadata.cLine,
          trackNumber: 1,
        }),
      ],
      label: new Label({
        name: releaseData.metadata.label.name,
        vendorLabelID: releaseData.metadata.label.id,
      }),
      assets: [
        new Asset({
          type: 'audio',
          format: 'wav',
          mimeType: songMasterDetails.mimeType,
          name: 'Master Audio',
          md5Checksum: songMasterDetails.md5Checksum,
          fileName: songMasterDetails.fileName,
        }),
        new Asset({
          type: 'image',
          format: 'jpg',
          mimeType: songArtworkDetails.mimeType,
          name: 'Cover Art',
          md5Checksum: songArtworkDetails.md5Checksum,
          fileName: songArtworkDetails.fileName,
        }),
      ],
    })
    console.log('✅ Release class instantiated...')

    const xml = createReleaseObject.xml()

    return xml
  } catch (e) {
    console.log(e)
    throw new Error('⛔️ Error creating release' + e)
  }
}
