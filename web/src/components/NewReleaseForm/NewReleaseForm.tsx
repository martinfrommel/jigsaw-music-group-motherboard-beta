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
import { toast } from '@redwoodjs/web/dist/toast'
import { navigate, routes } from '@redwoodjs/router'

import { PrimaryGenre, SecondaryGenre } from '../../lib/genreList'
import { LanguageList } from 'src/lib/languageList'

import * as Yup from 'yup'
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

const NewReleaseForm: React.FC<BoxProps> = ({ ...rest }) => {
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
    try {
      // Continue with your submission logic...
      alert(JSON.stringify(data, null, 2))

      // Display a success toast after successful submission
      toast.success('Your release info was submitted successfully!')

      // Uncomment and adjust as needed:
      // setTimeout(() => {
      //   navigate(routes.home());
      // }, 5000);
    } catch (error) {
      // Handle errors, e.g., from an API call or other unexpected errors
      toast.error('Error submitting the release! Please try again.')
    } finally {
      // Set isSubmitting to false to indicate submission is complete
      setSubmitting(false)
    }
  }

  // Configuration for the drag and drop file upload
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'audio/wav': ['.wav'],
      'audio/quicktime': ['.m4a, .alac'],
    }, // Add other formats if needed
    onDrop: (acceptedFiles) => {
      // Handle the files here
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

              <StepSeparator />
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
            validate={async (values) => {
              try {
                // Validate the form values using the ReleaseSchema
                await ReleaseSchema.validate(values, { abortEarly: false })
                return {} // No errors
              } catch (error) {
                if (error instanceof Yup.ValidationError) {
                  // Log the error in console
                  console.log(error.inner)
                  // Display a toast error if there are validation errors
                  toast.error('Some fields are required')
                  // Return the errors to Formik
                  return error.inner.reduce((errors, err) => {
                    errors[err.path] = err.message
                    return errors
                  }, {})
                }
                // If it's some other error (not from Yup validation)
                return {}
              }
            }}
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
                        <ErrorMessage
                          name="songMaster"
                          component={FormErrorMessage}
                        />
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
                        <ErrorMessage
                          name="metadata.songTitle"
                          component={FormErrorMessage}
                        />

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
                        <ErrorMessage
                          name="metadata.productTitle"
                          component={FormErrorMessage}
                        />
                        <FormLabel mt={4}>Artist</FormLabel>
                        <Input
                          type="text"
                          name="metadata.artist"
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          value={props.values.metadata.artist}
                          isInvalid={!!props.errors.metadata?.artist}
                        />
                        <ErrorMessage
                          name="metadata.artist"
                          component={FormErrorMessage}
                        />

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
                              <ErrorMessage
                                name="metadata.featuredArtist"
                                component={FormErrorMessage}
                              />
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
                        <ErrorMessage
                          name="metadata.releaseDate"
                          component={FormErrorMessage}
                        />

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
                        <ErrorMessage
                          name="metadata.language"
                          component={FormErrorMessage}
                        />
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
                          <ErrorMessage
                            name="metadata.primaryGenre"
                            component={FormErrorMessage}
                          />
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
                              <ErrorMessage
                                name="metadata.secondaryGenre"
                                component={FormErrorMessage}
                              />
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
                        <ErrorMessage
                          name="metadata.isicUpcCode"
                          component={FormErrorMessage}
                        />

                        <FormLabel mt={4}>P Line</FormLabel>
                        <Input
                          type="text"
                          name="metadata.pLine"
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          value={props.values.metadata.pLine}
                          isInvalid={!!props.errors.metadata?.pLine}
                        />
                        <ErrorMessage
                          name="metadata.pLine"
                          component={FormErrorMessage}
                        />

                        <FormLabel mt={4}>C Line</FormLabel>
                        <Input
                          type="text"
                          name="metadata.cLine"
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          value={props.values.metadata.cLine}
                          isInvalid={!!props.errors.metadata?.cLine}
                        />
                        <ErrorMessage
                          name="metadata.cLine"
                          component={FormErrorMessage}
                        />
                      </>
                    )}{' '}
                    <Flex
                      justifyContent={'space-between'}
                      alignItems={'center'}
                      mt={6}
                    >
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
                        <Button
                          type="submit"
                          loadingText="Submitting the release"
                          colorScheme="green"
                          spinnerPlacement="start"
                        >
                          Submit
                        </Button>
                      )}
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
