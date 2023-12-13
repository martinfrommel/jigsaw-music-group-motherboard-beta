import * as Yup from 'yup'

import { Genre, SubGenre } from './genres.enum'
import { ParticipantRole } from './participantRoles.enum'

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
  artist: Yup.array()
    .of(Yup.string().required('Artist name is required'))
    .min(1, 'At least one artist is required')
    .required('Artist name is required'),
  otherParticipants: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required('Name is required'),
      role: Yup.string()
        .oneOf(Object.keys(ParticipantRole))
        .required('Role is required'),
    })
  ),
  featuredArtist: Yup.string(),
  label: Yup.object().shape({
    id: Yup.string().required('Label ID is required'),
    name: Yup.string().required('Label name is required'),
  }),
  releaseDate: Yup.date().required('Release date is required').nullable(),
  previouslyReleased: Yup.boolean(),
  language: Yup.string().required('Language is required'),
  primaryGenre: Yup.string()
    .oneOf(Object.keys(Genre), 'Invalid genre')
    .required('Primary genre is required'),
  secondaryGenre: Yup.string().oneOf(Object.keys(SubGenre), 'Invalid genre'),
  explicitLyrics: Yup.boolean(),
  isrcCode: Yup.string()
    .matches(/^[A-Za-z0-9]{5}[0-9]{2}[A-Za-z0-9]{5}$/, 'ISRC code is invalid')
    .min(12)
    .max(12),
  pLine: Yup.string(),
  cLine: Yup.string(),
})
