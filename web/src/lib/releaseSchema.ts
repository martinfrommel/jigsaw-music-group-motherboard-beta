import * as Yup from 'yup'

export const ReleaseSchema = Yup.object().shape({
  songMasterReference: Yup.string().required(
    'You have to upload the master audio'
  ),
  songArtworkReference: Yup.string().required(
    'You have to upload the song image'
  ),
  AWSFolderKey: Yup.string().required('AWSFolderKey is required'),
  songTitle: Yup.string().required('Song title is required'),
  productTitle: Yup.string(),
  artist: Yup.string().required('Artist name is required'),
  featuredArtist: Yup.string(),
  label: Yup.object().shape({
    id: Yup.string().required('Label ID is required'),
    name: Yup.string().required('Label name is required'),
  }),
  // releaseDate: Yup.date().required('Release date is required'),
  previouslyReleased: Yup.boolean(),
  language: Yup.string().required('Language is required'),
  primaryGenre: Yup.string(),
  secondaryGenre: Yup.string(),
  explicitLyrics: Yup.boolean(),
  iscUpcCode: Yup.string(),
  pLine: Yup.string(),
  cLine: Yup.string(),
})
