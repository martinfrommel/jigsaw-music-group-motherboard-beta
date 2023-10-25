import {
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
  Box,
  Text,
  Flex,
  HStack,
} from '@chakra-ui/react'
import { Formik, Field, ErrorMessage } from 'formik'
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  FormErrorMessage,
} from '@chakra-ui/react'

import { ReleaseSchema } from '../../lib/releaseSchema'
import { useState } from 'react'
import { useDropzone } from 'react-dropzone'

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

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'audio/wav': ['.wav'],
      'audio/quicktime': ['.m4a, .alac'],
    }, // Add other formats if needed
    onDrop: (acceptedFiles) => {
      // Handle the files here
    },
  })

  // const releaseSchema = ReleaseSchema

  const steps = [
    {
      title: 'Song Master',
      description: 'Upload your song master',
    },
    {
      title: 'Metadata',
      description: 'Provide song metadata',
    },
    // ... add more steps if needed
  ]

  const { activeStep, setActiveStep, goToPrevious, goToNext } = useSteps({
    index: 0,
    count: steps.length,
  })

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
            <Stepper index={activeStep}>
              {steps.map((step, index) => (
                <Step key={index}>
                  <StepIndicator>
                    <StepStatus
                      complete={<StepIcon />}
                      incomplete={<StepNumber />}
                      active={<StepNumber />}
                    />
                  </StepIndicator>

                  <Box flexShrink="0">
                    <StepTitle>{step.title}</StepTitle>
                    <StepDescription>{step.description}</StepDescription>
                  </Box>

                  <StepSeparator />
                </Step>
              ))}
            </Stepper>

            {activeStep === 0 && (
              <Box
                {...getRootProps()}
                p={8}
                border="2px dashed gray"
                transition={'all 0.5s'}
                mt={4}
              >
                <input name={'songMaster'} {...getInputProps()} />
                <Text>
                  Drag & drop your song master here, or click to select one
                </Text>
              </Box>
            )}

            {activeStep === 1 && (
              <>
                <FormControl mt={4}>
                  <FormLabel>Song Title</FormLabel>
                  <Input type="text" name="metadata.songTitle" />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Product Title (optional)</FormLabel>
                  <Input type="text" name="metadata.productTitle" />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Artist</FormLabel>
                  <Input type="text" name="metadata.artist" />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Featured Artist (optional)</FormLabel>
                  <Input type="text" name="metadata.featuredArtist" />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Release Date</FormLabel>
                  <Input type="date" name="metadata.releaseDate" />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Previously Released?</FormLabel>
                  <Field type="checkbox" name="metadata.previouslyReleased" />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Language</FormLabel>
                  <Input type="text" name="metadata.language" />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Primary Genre</FormLabel>
                  <Input type="text" name="metadata.primaryGenre" />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Secondary Genre</FormLabel>
                  <Input type="text" name="metadata.secondaryGenre" />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Explicit Lyrics</FormLabel>
                  <Field type="checkbox" name="metadata.explicitLyrics" />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>ISIC/UPC Code</FormLabel>
                  <Input type="text" name="metadata.isicUpcCode" />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>P Line</FormLabel>
                  <Input type="text" name="metadata.pLine" />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>C Line</FormLabel>
                  <Input type="text" name="metadata.cLine" />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Length</FormLabel>
                  <Input
                    type="text"
                    name="metadata.length"
                    value={audioLength}
                    readOnly
                  />
                </FormControl>
              </>
            )}

            <Flex justifyContent={'space-between'} alignItems={'center'} mt={6}>
              {activeStep > 0 && (
                <Button type="button" onClick={goToPrevious}>
                  Previous step
                </Button>
              )}
              {activeStep < steps.length - 1 ? (
                <Button type="button" onClick={goToNext}>
                  Next step
                </Button>
              ) : (
                <Button type="submit">Submit</Button>
              )}
            </Flex>
          </form>
        )}
      </Formik>
    </>
  )
}

export default NewReleaseForm
