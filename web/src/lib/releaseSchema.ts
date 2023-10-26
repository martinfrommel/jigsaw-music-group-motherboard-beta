import * as Yup from 'yup'

export const ReleaseSchema = Yup.object().shape({
  songMaster: Yup.string(),
  metadata: Yup.object().shape({
    songTitle: Yup.string().required('Song Title is required'),
    productTitle: Yup.string(),
    artist: Yup.string().required('Artist is required'),
    featuredArtist: Yup.string(),
    releaseDate: Yup.date().required('Release Date is required'),
    previouslyReleased: Yup.boolean(),
    language: Yup.string().required('Language is required'),
    primaryGenre: Yup.string().required('Primary Genre is required'),
    secondaryGenre: Yup.string(),
    explicitLyrics: Yup.boolean(),
    isicUpcCode: Yup.string().required('ISIC/UPC Code is required'),
    pLine: Yup.string(),
    cLine: Yup.string(),
    length: Yup.string(),
  }),
})
