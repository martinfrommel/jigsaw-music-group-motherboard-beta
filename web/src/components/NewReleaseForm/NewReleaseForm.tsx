import { useEffect, useState } from 'react'

import { useMutation } from '@apollo/client'
import { CheckCircleIcon, InfoIcon } from '@chakra-ui/icons'
import {
  Box,
  Flex,
  Checkbox,
  Select,
  ScaleFade,
  FormErrorMessage,
  FormErrorIcon,
  FormHelperText,
  Icon,
  ButtonGroup,
} from '@chakra-ui/react'
import { FormControl, FormLabel, Input, Button } from '@chakra-ui/react'
import { Formik } from 'formik'

import { toast } from '@redwoodjs/web/dist/toast'

import { useAuth } from 'src/auth'
import GetLabelsCell from 'src/components/GetLabelsCell/'
import {
  Genre as PrimaryGenre,
  SubGenre as SecondaryGenre,
} from 'src/lib/genres.enum'
import { LanguageList } from 'src/lib/languageList'

import { ReleaseSchema } from '../../lib/releaseSchema'
import ArtworkUpload from '../ArtworkUpload/ArtworkUpload'
import AudioUpload from '../AudioUpload/AudioUpload'

interface NewReleaseFormProps {
  [key: string]: never
}

interface FormValues {
  songMasterReference: string
  songArtworkReference: string
  AWSFolderKey: string
  songTitle: string
  productTitle: string
  artist: string
  featuredArtist: string
  // releaseDate: string
  previouslyReleased: boolean
  language: string
  label: {
    id: string
    name: string
  }
  primaryGenre: keyof typeof PrimaryGenre
  secondaryGenre?: keyof typeof SecondaryGenre
  explicitLyrics: boolean
  iscUpcCode: string
  pLine: string
  cLine: string
}

const CREATE_RELEASE_MUTATION = gql`
  mutation CreateRelease($input: CreateReleaseInput!) {
    createRelease(input: $input)
  }
`

const NewReleaseForm: React.FC<NewReleaseFormProps> = ({ ...rest }) => {
  const [createRelease, { loading }] = useMutation(CREATE_RELEASE_MUTATION)
  const [isFeaturedArtistChecked, setIsFeaturedArtistChecked] = useState(false)
  const [uploadedAudio, setUploadedAudio] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { currentUser } = useAuth()
  const [resetChildren, setResetChildren] = useState(false)

  const handleAudioChange = (file) => {
    setUploadedAudio(file)
    // setAudioDuration(duration)
  }

  useEffect(() => {
    if (resetChildren) {
      setResetChildren(false)
    }
  }, [resetChildren])

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true)
    try {
      const {
        songMasterReference,
        songArtworkReference,
        AWSFolderKey,
        label,
        ...metadata
      } = data

      const input = {
        userId: currentUser.id,
        songMasterReference: songMasterReference,
        songArtworkReference: songArtworkReference,
        AWSFolderKey: AWSFolderKey,
        metadata: {
          ...metadata,
          label: {
            id: label.id,
            name: label.name,
          },
        },
      }

      toast.loading('Submitting the release...')
      const { data: createReleaseData } = await createRelease({
        variables: {
          input,
        },
      })
      toast.remove()
      toast.success('🥳 Release submitted successfully!')
      toast.loading('Reloading the page...')
      setTimeout(() => {
        window.location.reload()
        sessionStorage.removeItem('folderKey')
        toast.remove()
        setSubmitting(false)
      }, 5000)
      return createReleaseData
    } catch (error) {
      toast.remove()
      console.error(error)
      toast.error(`Failed to submit release: ${error.message}`)
      setSubmitting(false)
    }
  }

  return (
    <>
      <Box
        {...rest}
        minWidth={96}
        width={'100%'}
        transition={'all 1s ease-in-out'}
      >
        <Formik<FormValues>
          initialValues={{
            songMasterReference: undefined as unknown as string,
            songArtworkReference: undefined as unknown as string,
            AWSFolderKey: undefined as unknown as string,
            songTitle: '',
            productTitle: '',
            artist: '',
            featuredArtist: '',
            // releaseDate: '',
            label: {
              id: '',
              name: '',
            },
            previouslyReleased: false,
            language: '',
            primaryGenre: undefined as unknown as keyof typeof PrimaryGenre,
            secondaryGenre: undefined as unknown as keyof typeof SecondaryGenre,
            explicitLyrics: false,
            iscUpcCode: '',
            pLine: '',
            cLine: '',
          }}
          onSubmit={onSubmit}
          validationSchema={ReleaseSchema}
          validateOnBlur={false}
          validateOnChange={false}
          validateOnMount={false}
        >
          {(props) => {
            const { isValid, dirty } = props
            return (
              <>
                <form onSubmit={props.handleSubmit}>
                  <FormControl mt={12} isInvalid={!!props.errors?.songTitle}>
                    <FormLabel mt={4}>Song Title</FormLabel>
                    <Input
                      type="text"
                      name="songTitle"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.songTitle}
                      placeholder="The title of your song"
                    />
                    <FormErrorMessage minHeight={6}>
                      <FormErrorIcon />
                      {props.errors?.songTitle}
                    </FormErrorMessage>
                  </FormControl>
                  <Flex
                    justifyContent={'space-between'}
                    alignItems={'center'}
                    my={8}
                  >
                    <FormControl flex={1} isInvalid={!!props.errors?.artist}>
                      <FormLabel>Artist</FormLabel>
                      <Input
                        type="text"
                        name="artist"
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        value={props.values.artist}
                        isInvalid={!!props.errors?.artist}
                        placeholder="Your artist name"
                      />
                      <FormErrorMessage minHeight={6}>
                        <FormErrorIcon />
                        {props.errors?.artist}
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
                          isInvalid={!!props.errors?.featuredArtist}
                        >
                          <FormLabel mt={4}>Featured artist name</FormLabel>
                          <Input
                            type="text"
                            name="featuredArtist"
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            value={props.values.featuredArtist}
                            placeholder="Featured artist name"
                          />
                          <FormErrorMessage minHeight={6}>
                            <FormErrorIcon />
                            {props.errors?.featuredArtist}
                          </FormErrorMessage>
                        </FormControl>
                      </ScaleFade>
                    </>
                  )}
                  <FormControl isInvalid={!!props.errors?.label}>
                    <FormLabel mt={4}>Label</FormLabel>
                    <GetLabelsCell
                      name="label"
                      value={{
                        id: props.values.label.id,
                        name: props.values.label.name,
                      }}
                      onSelect={(labelId, labelName) => {
                        props.setFieldValue('label.id', labelId)
                        props.setFieldValue('label.name', labelName)
                      }}
                      onBlur={props.handleBlur}
                    />
                    <FormErrorMessage>
                      <FormErrorIcon />
                      {props.errors?.label?.name}
                    </FormErrorMessage>
                  </FormControl>
                  <Flex
                    justifyContent={'space-around'}
                    alignItems={'center'}
                    my={8}
                  >
                    {/* <FormControl
                      flex={1}
                      isInvalid={!!props.errors?.releaseDate}
                    >
                      <FormLabel>Release Date</FormLabel>
                      <Input
                        type="date"
                        name="releaseDate"
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        value={props.values.releaseDate}
                        placeholder="Choose a release date"
                      />
                      <FormErrorMessage minHeight={6}>
                        <FormErrorIcon />
                        {props.errors?.releaseDate}
                      </FormErrorMessage>
                    </FormControl> */}
                    <FormControl flex={1} isInvalid={!!props.errors?.language}>
                      <FormLabel>Language</FormLabel>
                      <Select
                        name="language"
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        value={props.values.language}
                        placeholder="Select a language"
                      >
                        {LanguageList.map((language) => (
                          <option key={language} value={language}>
                            {language}
                          </option>
                        ))}
                      </Select>
                      <FormErrorMessage minHeight={6}>
                        <FormErrorIcon />
                        {props.errors?.language}
                      </FormErrorMessage>
                    </FormControl>
                  </Flex>
                  <Flex
                    justifyContent={'space-around'}
                    alignItems={'flex-start'}
                    my={8}
                  >
                    <FormControl
                      isInvalid={!!props.errors?.primaryGenre}
                      flex={1}
                    >
                      <FormLabel>Primary Genre</FormLabel>
                      <Select
                        placeholder="Select a primary genre"
                        name="primaryGenre"
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        value={props.values.primaryGenre}
                      >
                        {Object.entries(PrimaryGenre).map(([key, value]) => (
                          <option key={key} value={key}>
                            {value}
                          </option>
                        ))}
                      </Select>
                      <FormErrorMessage minHeight={6}>
                        <FormErrorIcon />
                        {props.errors?.primaryGenre}
                      </FormErrorMessage>
                    </FormControl>

                    <>
                      <FormControl
                        ml={4}
                        flex={1}
                        isInvalid={!!props.errors?.secondaryGenre}
                      >
                        <FormLabel>Secondary Genre</FormLabel>
                        <Select
                          name="secondaryGenre"
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          value={props.values.secondaryGenre}
                          placeholder="Select a secondary genre"
                        >
                          {Object.entries(SecondaryGenre).map(
                            ([key, value]) => (
                              <option key={key} value={key}>
                                {value}
                              </option>
                            )
                          )}
                        </Select>
                        <FormErrorMessage minHeight={6}>
                          <FormErrorIcon />
                          {props.errors?.secondaryGenre}
                        </FormErrorMessage>
                      </FormControl>
                    </>
                  </Flex>
                  <FormControl mt={4} isInvalid={!!props.errors?.iscUpcCode}>
                    <FormLabel>ISC/UPC Code</FormLabel>
                    <Input
                      type="text"
                      name="iscUpcCode"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.iscUpcCode}
                      placeholder="Here goes the ISC/UPC code - if you have one..."
                    />
                    <FormErrorMessage minHeight={6}>
                      <FormErrorIcon />
                      {props.errors?.iscUpcCode}
                    </FormErrorMessage>
                  </FormControl>
                  <Flex>
                    <FormControl flex={1} isInvalid={!!props.errors?.pLine}>
                      <FormLabel mt={4}>℗ Line</FormLabel>
                      <Input
                        type="text"
                        name="pLine"
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        value={props.values.pLine}
                        placeholder="Add the ℗ Line here"
                      />
                      <FormErrorMessage minHeight={6}>
                        <FormErrorIcon />
                        {props.errors?.pLine}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl
                      flex={1}
                      ml={4}
                      isInvalid={!!props.errors?.cLine}
                    >
                      <FormLabel mt={4}>© Line</FormLabel>
                      <Input
                        type="text"
                        name="cLine"
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        value={props.values.cLine}
                        placeholder="Add the © line here"
                      />
                      <FormErrorMessage minHeight={6}>
                        <FormErrorIcon />
                        {props.errors?.cLine}
                      </FormErrorMessage>
                    </FormControl>
                  </Flex>
                  <Flex
                    justifyContent={'space-around'}
                    alignItems={'center'}
                    my={8}
                  >
                    <Checkbox
                      flex={1}
                      size={'lg'}
                      name="explicitLyrics"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    >
                      Explicit lyrics?
                    </Checkbox>

                    <Checkbox
                      flex={1}
                      size={'lg'}
                      name="previouslyReleased"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    >
                      Previously released?
                    </Checkbox>
                  </Flex>
                  <ArtworkUpload
                    shouldReset={resetChildren}
                    handleBlur={props.handleBlur}
                    handleChange={props.handleChange}
                    error={props.errors?.songArtworkReference}
                    user={currentUser}
                    onUploadComplete={(url, AWSFolderKey) => {
                      // Set the field values and wait for the operation to complete
                      props.setFieldValue('songArtworkReference', url, false)
                      props.setFieldValue('AWSFolderKey', AWSFolderKey, false)
                    }}
                    value={props.values.songArtworkReference}
                  />
                  <FormControl isInvalid={!!props.errors?.songMasterReference}>
                    <FormLabel display={'none'}>
                      Upload audio master file
                    </FormLabel>
                    <AudioUpload
                      shouldReset={resetChildren}
                      onBlur={props.handleBlur}
                      value={props.values.songMasterReference}
                      onAudioChange={handleAudioChange}
                      onUploadComplete={async (url, AWSFolderKey) => {
                        props.setFieldValue('songMasterReference', url, false)
                        props.setFieldValue('AWSFolderKey', AWSFolderKey, false)
                      }}
                      errors={props.errors?.songMasterReference}
                      user={{
                        firstName: currentUser?.firstName,
                        lastName: currentUser?.lastName,
                      }}
                    />
                    <Flex
                      gap={4}
                      alignItems={'center'}
                      justifyContent={'space-between'}
                    >
                      <FormErrorMessage minHeight={6}>
                        <FormErrorIcon />
                        {props.errors?.songMasterReference}
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
                    </Flex>
                  </FormControl>
                  <ButtonGroup mt={8} isAttached>
                    <Button
                      type="reset"
                      variant="outline"
                      colorScheme="red"
                      isDisabled={!dirty || submitting}
                      onClick={() => {
                        props.resetForm()
                        props.setErrors({})
                        props.setTouched({})
                        setResetChildren(true)
                      }}
                    >
                      Reset
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      colorScheme="yellow"
                      onClick={() => {
                        props
                          .validateForm()
                          .then(() => console.log('💂 Form Validated!'))
                      }}
                      isDisabled={!dirty || submitting}
                    >
                      Validate
                    </Button>
                    <Button
                      type="submit"
                      loadingText="Submitting the release..."
                      isLoading={loading && props.isSubmitting}
                      colorScheme="green"
                      spinnerPlacement="start"
                      isDisabled={!isValid || submitting || !dirty}
                    >
                      Submit
                    </Button>
                  </ButtonGroup>
                </form>
              </>
            )
          }}
        </Formik>
      </Box>
    </>
  )
}

export default NewReleaseForm
