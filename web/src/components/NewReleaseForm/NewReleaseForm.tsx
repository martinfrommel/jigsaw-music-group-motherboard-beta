/**
 * NewReleaseForm Component
 *
 * This component provides a multi-step form for users to upload their song master
 * and provide necessary metadata for the song.
 *
 * Features:
 * - Drag and drop file upload for song master.
 * - Multi-step form with a stepper for better user experience.
 * - Form validation using Formik and Yup.
 *
 * Dependencies:
 * - @chakra-ui/react for UI components.
 * - formik for form handling.
 * - react-dropzone for drag and drop file upload.
 * - ReleaseSchema for form validation.
 *
 * @returns JSX.Element
 */

import { useState } from 'react'

import { useMutation } from '@apollo/client'
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
  InputGroup,
  InputLeftAddon,
  Checkbox,
  Stack,
  Select,
  Fade,
  ScaleFade,
  BoxProps,
  ButtonGroup,
} from '@chakra-ui/react'
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  FormErrorMessage,
} from '@chakra-ui/react'
import { Formik, Field, ErrorMessage, FormikHelpers } from 'formik'
import { useDropzone } from 'react-dropzone'
import * as Yup from 'yup'

import { navigate, routes } from '@redwoodjs/router'
import { toast } from '@redwoodjs/web/dist/toast'

import { useAuth } from 'src/auth'
import { LanguageList } from 'src/lib/languageList'

import { PrimaryGenre, SecondaryGenre } from '../../lib/genreList'
import { ReleaseSchema } from '../../lib/releaseSchema'
interface FormValues {
  songMaster: string
  metadata: {
    songTitle: string
    productTitle: string
    artist: string
    featuredArtist: string
    releaseDate: string
    previouslyReleased: boolean
    language: string
    primaryGenre: string
    secondaryGenre: string
    explicitLyrics: boolean
    isicUpcCode: string
    pLine: string
    cLine: string
    length: string
  }
}

const CREATE_RELEASE_MUTATION = gql`
  mutation CreateRelease($input: CreateReleaseInput!) {
    createRelease(input: $input) {
      id
      songTitle
      artist
    }
  }
`

const NewReleaseForm: React.FC<BoxProps> = ({ ...rest }) => {
  const [createRelease, { loading, error }] = useMutation(
    CREATE_RELEASE_MUTATION
  )
  const { currentUser } = useAuth()
  // State to store the length of the uploaded audio file
  const [audioLength, setAudioLength] = useState('')

  const [isFeaturedArtistChecked, setIsFeaturedArtistChecked] = useState(false)

  /**
   * handleAudioUpload
   *
   * This function is triggered when a user uploads an audio file.
   * It calculates the length of the uploaded audio and sets it to the state.
   *
   * @param {Event} event - The event object from the file input.
   */

  const handleAudioUpload = async (event) => {
    const file = event.target.files[0]
    const objectURL = URL.createObjectURL(file)
    const audio = new Audio(objectURL)
    audio.onloadedmetadata = function () {
      setAudioLength(audio.duration.toFixed(2))
    }
  }

  /**
   * onSubmit
   *
   * This function handles the form submission.
   * It can be used to send the form data to an API or any other logic.
   *
   * @param {Object} data - The form data.
   */

  const onSubmit = async (data, { setSubmitting }) => {
    // The createRelease mutation returns a promise, so we can pass it directly to toast.promise
    toast
      .promise(createRelease({ variables: { input: data } }), {
        loading: 'Submitting your release...',
        success: 'Your release info was submitted successfully!',
        error: 'Error submitting the release. Please try again.',
      })
      .then(() => {
        // Navigate after the mutation completes (either success or error)
        setTimeout(() => {
          navigate(routes.releases({ id: currentUser.id }))
        }, 5000)
      })
      .finally(() => {
        // Set isSubmitting to false to indicate submission is complete
        setSubmitting(false)
        console.log(error?.message)
      })
  }

  // Configuration for the drag and drop file upload
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'audio/wav': ['.wav'],
      'audio/quicktime': ['.m4a, .alac'],
    }, // Add other formats if needed
    onDrop: (acceptedFiles) => {
      handleAudioUpload(acceptedFiles)
    },
  })

  // Steps for the multi-step form
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

  // Hooks to manage the active step of the form
  const { activeStep, setActiveStep, goToPrevious, goToNext } = useSteps({
    index: 0,
    count: steps.length,
  })

  return (
    <>
      <Box {...rest}>
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
            </Step>
          ))}
        </Stepper>

        <Box>
          <Formik<FormValues>
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
            validateOnBlur={false}
            validateOnChange={false}
            validateOnMount={false}
          >
            {(props) => (
              <>
                <form onSubmit={props.handleSubmit}>
                  <FormControl mt={12}>
                    {/* If step 0 is active, render... */}
                    {activeStep === 0 && (
                      <>
                        <FormLabel hidden>Song Master</FormLabel>
                        <Box
                          {...getRootProps()}
                          p={12}
                          border="2px dashed gray"
                          mt={4}
                        >
                          <input {...getInputProps()} />
                          <Text>
                            Drag & drop your song master here, or click to
                            select one
                          </Text>
                        </Box>
                        <ErrorMessage name="songMaster" />
                        <FormLabel hidden mt={4}>
                          Length
                        </FormLabel>
                        <InputGroup mt={6}>
                          <InputLeftAddon children={'Length'} />
                          <Input
                            type="text"
                            name="metadata.length"
                            value={audioLength}
                            placeholder="The song length will display here"
                            readOnly
                          />
                        </InputGroup>
                      </>
                    )}
                    {/* If step 1 is active, render... */}
                    {activeStep === 1 && (
                      <>
                        <FormLabel mt={4}>Song Title</FormLabel>
                        <Input
                          type="text"
                          name="metadata.songTitle"
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          value={props.values.metadata.songTitle}
                          isInvalid={!!props.errors.metadata?.songTitle}
                          placeholder="The title of your song"
                        />
                        <ErrorMessage name="metadata.songTitle" />

                        {/* <FormLabel mt={4}>Product Title (optional)</FormLabel>
                      <Input
                        type="text"
                        name="metadata.productTitle"
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        value={props.values.metadata.productTitle}
                        isInvalid={
                          !!(
                            props.errors.metadata?.productTitle &&
                            props.touched.metadata?.productTitle
                          )
                        }
                      /> */}
                        <ErrorMessage name="metadata.productTitle" />
                        <FormLabel mt={4}>Artist</FormLabel>
                        <Input
                          type="text"
                          name="metadata.artist"
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          value={props.values.metadata.artist}
                          isInvalid={!!props.errors.metadata?.artist}
                        />
                        <ErrorMessage name="metadata.artist" />

                        <Checkbox
                          mt={4}
                          size={'lg'}
                          isChecked={isFeaturedArtistChecked}
                          onChange={(e) =>
                            setIsFeaturedArtistChecked(e.target.checked)
                          }
                        >
                          Featured Artist?
                        </Checkbox>

                        {isFeaturedArtistChecked && (
                          <>
                            <ScaleFade delay={0.2} in={isFeaturedArtistChecked}>
                              <FormLabel mt={4}>Featured Artist Name</FormLabel>
                              <Input
                                type="text"
                                name="metadata.featuredArtist"
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                value={props.values.metadata.featuredArtist}
                                isInvalid={
                                  !!props.errors.metadata?.featuredArtist
                                }
                              />
                              <ErrorMessage name="metadata.featuredArtist" />
                            </ScaleFade>
                          </>
                        )}

                        <FormLabel mt={4}>Release Date</FormLabel>
                        <Input
                          type="date"
                          name="metadata.releaseDate"
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          value={props.values.metadata.releaseDate}
                          isInvalid={!!props.errors.metadata?.releaseDate}
                        />
                        <ErrorMessage name="metadata.releaseDate" />

                        <FormLabel mt={4}>Language</FormLabel>
                        <Select
                          name="metadata.language"
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          value={props.values.metadata.language}
                          isInvalid={!!props.errors.metadata?.language}
                        >
                          {LanguageList.map((language) => (
                            <option key={language} value={language}>
                              {language}
                            </option>
                          ))}
                        </Select>
                        <ErrorMessage name="metadata.language" />
                        <Stack>
                          <FormLabel mt={4}>Primary Genre</FormLabel>
                          <Select
                            name="metadata.primaryGenre"
                            onChange={(e) => {
                              props.handleChange(e)
                              // Reset secondary genre when primary changes
                              props.setFieldValue('metadata.secondaryGenre', '')
                            }}
                            onBlur={props.handleBlur}
                            value={props.values.metadata.primaryGenre}
                            isInvalid={!!props.errors.metadata?.primaryGenre}
                          >
                            {PrimaryGenre.map((genre) => (
                              <option key={genre} value={genre}>
                                {genre}
                              </option>
                            ))}
                          </Select>
                          <ErrorMessage name="metadata.primaryGenre" />
                          {SecondaryGenre[props.values.metadata.primaryGenre]
                            ?.length > 0 && (
                            <>
                              <FormLabel mt={4}>Secondary Genre</FormLabel>
                              <Select
                                name="metadata.secondaryGenre"
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                value={props.values.metadata.secondaryGenre}
                                isInvalid={
                                  !!props.errors.metadata?.secondaryGenre
                                }
                              >
                                {SecondaryGenre[
                                  props.values.metadata.primaryGenre
                                ]?.map((subGenre) => (
                                  <option key={subGenre} value={subGenre}>
                                    {subGenre}
                                  </option>
                                ))}
                              </Select>
                              <ErrorMessage name="metadata.secondaryGenre" />
                            </>
                          )}
                        </Stack>
                        <Flex
                          direction={'row'}
                          justifyContent={'space-between'}
                          my={8}
                        >
                          <Checkbox size={'lg'} name="metadata.explicitLyrics">
                            Explicit lyrics?
                          </Checkbox>

                          <Checkbox
                            size={'lg'}
                            name="metadata.previouslyReleased"
                          >
                            Previously released?
                          </Checkbox>
                        </Flex>
                        <FormLabel>ISC/UPC Code</FormLabel>
                        <Input
                          type="text"
                          name="metadata.isicUpcCode"
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          value={props.values.metadata.isicUpcCode}
                          isInvalid={!!props.errors.metadata?.isicUpcCode}
                        />
                        <ErrorMessage name="metadata.isicUpcCode" />

                        <FormLabel mt={4}>P Line</FormLabel>
                        <Input
                          type="text"
                          name="metadata.pLine"
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          value={props.values.metadata.pLine}
                          isInvalid={!!props.errors.metadata?.pLine}
                        />
                        <ErrorMessage name="metadata.pLine" />

                        <FormLabel mt={4}>C Line</FormLabel>
                        <Input
                          type="text"
                          name="metadata.cLine"
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          value={props.values.metadata.cLine}
                          isInvalid={!!props.errors.metadata?.cLine}
                        />
                        <ErrorMessage name="metadata.cLine" />
                      </>
                    )}{' '}
                    <Flex
                      justifyContent={'space-between'}
                      alignItems={'center'}
                      mt={6}
                    >
                      <ButtonGroup>
                        <Button type="button" onClick={goToPrevious}>
                          Previous step
                        </Button>

                        <Button type="button" onClick={goToNext}>
                          Next step
                        </Button>

                        <Button
                          type="submit"
                          loadingText="Submitting the release"
                          colorScheme="green"
                          spinnerPlacement="start"
                        >
                          Submit
                        </Button>
                      </ButtonGroup>
                    </Flex>
                  </FormControl>
                </form>
              </>
            )}
          </Formik>
        </Box>
      </Box>
    </>
  )
}

export default NewReleaseForm
