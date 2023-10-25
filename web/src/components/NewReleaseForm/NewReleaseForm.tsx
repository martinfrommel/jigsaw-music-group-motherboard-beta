import { Formik, Field, ErrorMessage } from 'formik'
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Box,
  Select,
  FormErrorMessage,
  Textarea,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
} from '@chakra-ui/react'
import * as Yup from 'yup'
import { useState } from 'react'

const ReleaseSchema = Yup.object().shape({
  songMaster: Yup.string().required('Song Master is required'),
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

const NewReleaseForm = () => {
  const [audioLength, setAudioLength] = useState('')

  const handleAudioUpload = async (event) => {
    const file = event.target.files[0]
    const objectURL = URL.createObjectURL(file)
    const audio = new Audio(objectURL)
    audio.onloadedmetadata = function () {
      setAudioLength(audio.duration.toFixed(2))
    }
  }

  const onSubmit = async (data) => {
    // Handle the form submission logic here
  }

  return (
    <>
      <Formik
        initialValues={{
          songMaster: '',
          metadata: {
            songTitle: '',
            productTitle: '',
            artist: '',
            featuredArtist: '',
            releaseDate: '',
            previouslyReleased: false,
            language: '',
            primaryGenre: '',
            secondaryGenre: '',
            explicitLyrics: false,
            isicUpcCode: '',
            pLine: '',
            cLine: '',
            length: audioLength,
          },
        }}
        onSubmit={onSubmit}
        validationSchema={ReleaseSchema}
      >
        {(props) => (
          <form onSubmit={props.handleSubmit}>
            <Stepper index={0}>
              <Step key="Song Master">
                <Box display="flex" flexDirection="column" alignItems="start">
                  <FormLabel>Song Master</FormLabel>
                  <Input
                    type="file"
                    name="songMaster"
                    onChange={(event) => {
                      props.handleChange(event)
                      handleAudioUpload(event)
                    }}
                    accept=".wav,.flac,.alac"
                  />
                  <ErrorMessage
                    name="songMaster"
                    component={FormErrorMessage}
                  />
                </Box>
              </Step>

              <Step key="Metadata">
                <Box display="flex" flexDirection="column" alignItems="start">
                  <FormLabel>Song Title</FormLabel>
                  <Input
                    type="text"
                    name="metadata.songTitle"
                    onChange={props.handleChange}
                    value={props.values.metadata.songTitle}
                  />
                  <ErrorMessage
                    name="metadata.songTitle"
                    component={FormErrorMessage}
                  />
                  {/* ... Add other metadata fields similarly */}
                </Box>
              </Step>

              {/* Add more steps if needed */}

              <Box mt={4}>
                <Button type="submit" isLoading={props.isSubmitting}>
                  Submit Release
                </Button>
              </Box>
            </Stepper>
          </form>
        )}
      </Formik>
    </>
  )
}

export default NewReleaseForm
