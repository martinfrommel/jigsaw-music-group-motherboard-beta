import * as Yup from 'yup'

export const ReleaseSchema = Yup.object().shape({
  songMaster: Yup.string().required('You have to upload the master audio'),
  songImage: Yup.string().required('You have to upload the song image'),
  metadata: Yup.object().shape({
    songTitle: Yup.string().required('Song title is required'),
    productTitle: Yup.string(),
    artist: Yup.string().required('Artist name is required'),
    featuredArtist: Yup.string(),
    label: Yup.object().shape({
      name: Yup.string().required('Label name is required'),
      id: Yup.string().required('Label ID is required'),
    }),
    // releaseDate: Yup.date().required('Release date is required'),
    previouslyReleased: Yup.boolean(),
    language: Yup.string().required('Language is required'),
    primaryGenre: Yup.string(),
    secondaryGenre: Yup.string(),
    explicitLyrics: Yup.boolean(),
    // iscUpcCode: Yup.string(),
    pLine: Yup.string(),
    cLine: Yup.string(),
  }),
})
