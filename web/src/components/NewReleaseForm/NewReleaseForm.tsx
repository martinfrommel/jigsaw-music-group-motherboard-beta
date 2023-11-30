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
import { CheckCircleIcon, InfoIcon } from '@chakra-ui/icons'
import {
  Box,
  Flex,
  Checkbox,
  Select,
  ScaleFade,
  BoxProps,
  FormErrorMessage,
  FormErrorIcon,
  FormHelperText,
  Icon,
} from '@chakra-ui/react'
import { FormControl, FormLabel, Input, Button } from '@chakra-ui/react'
import { Formik } from 'formik'

import { navigate, routes } from '@redwoodjs/router'
import { toast } from '@redwoodjs/web/dist/toast'

import { useAuth } from 'src/auth'
import GetLabelsCell from 'src/components/GetLabelsCell/'
import { LanguageList } from 'src/lib/languageList'

import { PrimaryGenre, SecondaryGenre } from '../../lib/genreList'
import { ReleaseSchema } from '../../lib/releaseSchema'
import AudioUpload from '../AudioUpload/AudioUpload'
export interface FormValues {
  songMaster: string
  songImage: string
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
    ISCUpcCode: string
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
  const [createRelease, { error }] = useMutation(CREATE_RELEASE_MUTATION)
  // State to store the length of the uploaded audio file
  const [isFeaturedArtistChecked, setIsFeaturedArtistChecked] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [uploadedAudio, setUploadedAudio] = useState(null)
  const [audioDuration, setAudioDuration] = useState(null)
  const [audioFilePath, setAudioFilePath] = useState<string | null>(null)

  const { currentUser } = useAuth()

  const handleAudioChange = (file, duration) => {
    setUploadedAudio(file)
    setAudioDuration(duration)
  }

  // const handleKeyComparison = (folderKey) => {
  //   if (folderKey)

  // }

  /**
   * onSubmit
   *
   * This function handles the form submission.
   * It can be used to send the form data to an API or any other logic.
   *
   * @param {Object} data - The form data.
   */

  /**
   * Handles the form submission.
   *
   * @param {object} data - The form data.
   * @param {object} setSubmitting - A function to set the submitting state.
   * @returns {void}
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
          navigate(routes.home())
        }, 5000)
      })
      .finally(() => {
        // Set isSubmitting to false to indicate submission is complete
        setSubmitting(false)
        console.log(error?.message)
      })
  }

  return (
    <>
      <Box
        {...rest}
        minWidth={96}
        width={'50vw'}
        transition={'all 1s ease-in-out'}
      >
        <Formik<FormValues>
          initialValues={{
            songMaster: '',
            songImage: '',
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
              ISCUpcCode: '',
              pLine: '',
              cLine: '',
              length: audioDuration,
            },
          }}
          onSubmit={onSubmit}
          validationSchema={ReleaseSchema}
          validateOnBlur={true}
          validateOnChange={false}
          validateOnMount={false}
        >
          {(props) => (
            <>
              <form onSubmit={props.handleSubmit}>
                <FormControl
                  mt={12}
                  isInvalid={!!props.errors.metadata?.songTitle}
                >
                  <FormLabel mt={4}>Song Title</FormLabel>
                  <Input
                    type="text"
                    name="metadata.songTitle"
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    value={props.values.metadata.songTitle}
                    placeholder="The title of your song"
                  />
                  <FormErrorMessage minHeight={6}>
                    <FormErrorIcon />
                    {props.errors.metadata?.songTitle}
                  </FormErrorMessage>
                </FormControl>
                <Flex
                  justifyContent={'space-between'}
                  alignItems={'center'}
                  my={8}
                >
                  <FormControl flex={1}>
                    <FormLabel>Artist</FormLabel>
                    <Input
                      type="text"
                      name="metadata.artist"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.metadata.artist}
                      isInvalid={!!props.errors.metadata?.artist}
                      placeholder="Your artist name"
                    />
                    <FormErrorMessage minHeight={6}>
                      <FormErrorIcon />
                      {props.errors.metadata?.artist}
                    </FormErrorMessage>
                  </FormControl>
                  <Flex
                    flex={1}
                    alignItems={'center'}
                    justifyContent={'center'}
                  >
                    <Checkbox
                      ml={4}
                      size={'lg'}
                      isChecked={isFeaturedArtistChecked}
                      onChange={(e) =>
                        setIsFeaturedArtistChecked(e.target.checked)
                      }
                    >
                      Featured artist?
                    </Checkbox>
                  </Flex>
                </Flex>
                {isFeaturedArtistChecked && (
                  <>
                    <ScaleFade delay={0.2} in={isFeaturedArtistChecked}>
                      <FormControl
                        flex={1}
                        isInvalid={!!props.errors.metadata?.featuredArtist}
                      >
                        <FormLabel mt={4}>Featured artist name</FormLabel>
                        <Input
                          type="text"
                          name="metadata.featuredArtist"
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          value={props.values.metadata.featuredArtist}
                          placeholder="Featured artist name"
                        />
                        <FormErrorMessage minHeight={6}>
                          <FormErrorIcon />
                          {props.errors.metadata?.featuredArtist}
                        </FormErrorMessage>
                      </FormControl>
                    </ScaleFade>
                  </>
                )}
                <FormControl>
                  <FormLabel mt={4}>Label</FormLabel>
                  <GetLabelsCell />
                </FormControl>

                <Flex
                  justifyContent={'space-around'}
                  alignItems={'center'}
                  my={8}
                >
                  <FormControl
                    flex={1}
                    isInvalid={!!props.errors.metadata?.releaseDate}
                  >
                    <FormLabel>Release Date</FormLabel>
                    <Input
                      type="date"
                      name="metadata.releaseDate"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.metadata.releaseDate}
                      placeholder="Choose a release date"
                    />
                    <FormErrorMessage minHeight={6}>
                      <FormErrorIcon />
                      {props.errors.metadata?.releaseDate}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl
                    ml={4}
                    flex={1}
                    isInvalid={!!props.errors.metadata?.language}
                  >
                    <FormLabel>Language</FormLabel>
                    <Select
                      name="metadata.language"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.metadata.language}
                    >
                      {LanguageList.map((language) => (
                        <option key={language} value={language}>
                          {language}
                        </option>
                      ))}
                    </Select>
                    <FormErrorMessage minHeight={6}>
                      <FormErrorIcon />
                      {props.errors.metadata?.language}
                    </FormErrorMessage>
                  </FormControl>
                </Flex>
                <Flex
                  justifyContent={'space-around'}
                  alignItems={'flex-start'}
                  my={8}
                >
                  <FormControl
                    isInvalid={!!props.errors.metadata?.primaryGenre}
                    flex={1}
                  >
                    <FormLabel>Primary Genre</FormLabel>
                    <Select
                      name="metadata.primaryGenre"
                      onChange={(e) => {
                        props.handleChange(e)
                        // Reset secondary genre when primary changes
                        props.setFieldValue('metadata.secondaryGenre', '')
                      }}
                      onBlur={props.handleBlur}
                      value={props.values.metadata.primaryGenre}
                    >
                      {PrimaryGenre.map((genre) => (
                        <option key={genre} value={genre}>
                          {genre}
                        </option>
                      ))}
                    </Select>
                    <FormErrorMessage minHeight={6}>
                      <FormErrorIcon />
                      {props.errors.metadata?.primaryGenre}
                    </FormErrorMessage>
                  </FormControl>

                  <>
                    <FormControl
                      ml={4}
                      flex={1}
                      isInvalid={!!props.errors.metadata?.secondaryGenre}
                      isDisabled={
                        !SecondaryGenre[props.values.metadata.primaryGenre]
                          ?.length
                      }
                    >
                      <FormLabel>Secondary Genre</FormLabel>
                      <Select
                        name="metadata.secondaryGenre"
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        value={props.values.metadata.secondaryGenre}
                      >
                        {SecondaryGenre[
                          props.values.metadata.primaryGenre
                        ]?.map((subGenre) => (
                          <option key={subGenre} value={subGenre}>
                            {subGenre}
                          </option>
                        ))}
                      </Select>
                      <FormErrorMessage minHeight={6}>
                        <FormErrorIcon />
                        {props.errors.metadata?.secondaryGenre}
                      </FormErrorMessage>
                    </FormControl>
                  </>
                </Flex>
                <FormControl
                  mt={4}
                  isInvalid={!!props.errors.metadata?.ISCUpcCode}
                >
                  <FormLabel>ISC/UPC Code</FormLabel>
                  <Input
                    type="text"
                    name="metadata.ISCUpcCode"
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    value={props.values.metadata.ISCUpcCode}
                    placeholder="Here goes the ISC/UPC code - if you have one..."
                  />
                  <FormErrorMessage minHeight={6}>
                    <FormErrorIcon />
                    {props.errors.metadata?.ISCUpcCode}
                  </FormErrorMessage>
                </FormControl>
                <Flex>
                  <FormControl
                    flex={1}
                    isInvalid={!!props.errors.metadata?.pLine}
                  >
                    <FormLabel mt={4}>℗ Line</FormLabel>
                    <Input
                      type="text"
                      name="metadata.pLine"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.metadata.pLine}
                      placeholder="Add the ℗ Line here"
                    />
                    <FormErrorMessage minHeight={6}>
                      <FormErrorIcon />
                      {props.errors.metadata?.pLine}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl
                    flex={1}
                    ml={4}
                    isInvalid={!!props.errors.metadata?.cLine}
                  >
                    <FormLabel mt={4}>© Line</FormLabel>
                    <Input
                      type="text"
                      name="metadata.cLine"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.metadata.cLine}
                      placeholder="Add the © line here"
                    />
                    <FormErrorMessage minHeight={6}>
                      <FormErrorIcon />
                      {props.errors.metadata?.cLine}
                    </FormErrorMessage>
                  </FormControl>
                </Flex>

                <Flex
                  justifyContent={'space-around'}
                  alignItems={'center'}
                  my={8}
                >
                  <Checkbox flex={1} size={'lg'} name="metadata.explicitLyrics">
                    Explicit lyrics?
                  </Checkbox>

                  <Checkbox
                    flex={1}
                    size={'lg'}
                    name="metadata.previouslyReleased"
                  >
                    Previously released?
                  </Checkbox>
                </Flex>
                {/* <ArtworkUpload
                  handleBlur={props.handleBlur}
                  handleChange={props.handleChange}
                  values={props.values.songImage}
                  errors={props.errors?.songImage}
                  setFieldValue={props.setFieldValue}
                /> */}
                <FormControl isInvalid={!!props.errors?.songMaster}>
                  <FormLabel display={'none'}>
                    Upload audio master file
                  </FormLabel>
                  <AudioUpload
                    onAudioChange={handleAudioChange}
                    onUploadComplete={setAudioFilePath}
                    user={{
                      firstName: currentUser?.firstName,
                      lastName: currentUser?.lastName,
                    }}
                  />
                  <FormErrorMessage minHeight={6}>
                    <FormErrorIcon />
                    {props.errors?.songMaster}
                  </FormErrorMessage>
                  {uploadedAudio ? (
                    <FormHelperText>
                      <Icon as={CheckCircleIcon} color="green.500" mr={2} />
                      The audio file is present on server.
                    </FormHelperText>
                  ) : (
                    <FormHelperText>
                      <Icon as={InfoIcon} color="red.500" mr={2} />
                      The audio file is not present on server.
                    </FormHelperText>
                  )}
                </FormControl>
                <Button
                  type="submit"
                  loadingText="Submitting the release..."
                  isLoading={!onSubmit}
                  colorScheme="green"
                  spinnerPlacement="start"
                  mt={6}
                  size={'lg'}
                  width={'full'}
                  isDisabled={!audioFilePath}
                >
                  Submit
                </Button>
              </form>
            </>
          )}
        </Formik>
      </Box>
    </>
  )
}

export default NewReleaseForm
