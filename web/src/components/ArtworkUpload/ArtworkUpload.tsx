import { useCallback, useEffect, useRef, useState } from 'react'

import { useLazyQuery } from '@apollo/client'
import { CheckCircleIcon, InfoIcon } from '@chakra-ui/icons'
import {
  Button,
  ButtonGroup,
  FormControl,
  FormErrorIcon,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Flex,
  Icon,
} from '@chakra-ui/react'
import { FormikHandlers } from 'formik'

import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/dist/toast'

interface PresignedUrlResponse {
  url: string
  fields: {
    bucket: string
    'X-Amz-Algorithm': string
    'X-Amz-Credential': string
    'X-Amz-Date': string
    key: string
    Policy: string
    'X-Amz-Signature': string
  }
  folderKey: string
}

interface ArtworkUploadProps {
  handleBlur: FormikHandlers['handleBlur']
  handleChange?: FormikHandlers['handleChange']
  value: string
  error: string
  onUploadComplete: (url: string, AWSFolderKey: string) => void
  user: {
    id: string | number
    firstName: string
    lastName: string
  }
  shouldReset?: boolean
}

export const GET_PRESIGNED_URL_QUERY = gql`
  query GetPresignedUrl(
    $fileType: String!
    $fileName: String!
    $user: UserInput!
    $pregeneratedUrl: String
  ) {
    getPresignedUrl(
      fileType: $fileType
      fileName: $fileName
      user: $user
      pregeneratedUrl: $pregeneratedUrl
    ) {
      url
      fields
      folderKey
    }
  }
`

const CLEAR_FILE_FROM_S3_MUTATION = gql`
  mutation clearFileFromS3($filePath: String!, $user: UserInput!) {
    clearFileFromS3(filePath: $filePath, user: $user) {
      ok
      error
    }
  }
`

export const ArtworkUpload = ({
  shouldReset,
  handleBlur,
  error: formError,
  onUploadComplete,
  user,
}: ArtworkUploadProps) => {
  // State
  const inputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isFileUploaded, setIsFileUploaded] = useState(false)
  const [isFilePicked, setIsFilePicked] = useState(false)
  const presignedUrl = useRef<PresignedUrlResponse>()
  const [uploadedArtwork, setUploadedArtwork] = useState(false)
  // Queries and Mutations
  const [clearFileFromS3] = useMutation(CLEAR_FILE_FROM_S3_MUTATION)
  const [getPresignedUrl] = useLazyQuery(GET_PRESIGNED_URL_QUERY)

  const fetchPresignedUrl = async (file) => {
    try {
      const { data } = (await getPresignedUrl({
        variables: {
          fileType: file.type,
          fileName: file.name,
          pregeneratedUrl: sessionStorage.getItem('folderKey') ?? '',
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
          },
        },
      })) as { data: { getPresignedUrl: PresignedUrlResponse } }

      const { url, fields, folderKey } = data.getPresignedUrl
      console.log(data.getPresignedUrl)
      setIsFilePicked(true)
      presignedUrl.current = { url, fields, folderKey }

      sessionStorage.setItem('folderKey', folderKey)
      return { url, fields, folderKey }
    } catch (error) {
      console.log(error.message)
      toast.error('Error fetching presigned URL:' + error.message)
    }
  }

  // Modified handleFileChange function
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (e) => {
      const img = new Image()
      img.onload = async () => {
        if (img.width === img.height) {
          // If the aspect ratio is 1:1, fetch presigned URL
          await fetchPresignedUrl(file)
        } else {
          toast.error('Please upload an image with a 1:1 aspect ratio.')
          if (inputRef.current) inputRef.current.value = '' // Clear the input
        }
      }
      img.src = e.target.result as string
    }
    reader.readAsDataURL(file)
  }

  const handleFileClear = useCallback(async () => {
    if (!inputRef.current.files) return
    if (isFilePicked && !isFileUploaded) {
      setIsFilePicked(false)
      return (inputRef.current.value = null)
    }

    if (isFileUploaded && !isUploading) {
      try {
        // Call the mutation to clear the file from S3
        const response = await clearFileFromS3({
          variables: {
            filePath: presignedUrl.current.fields.key,
            user: {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
            }, // Assuming currentUser contains the required user fields
          },
        })

        // Check the mutation response
        if (response.data.clearFileFromS3.ok) {
          inputRef.current.value = null // Clear the input file

          setIsFilePicked(false)
          setIsFileUploaded(false)
          setUploadedArtwork(false)
          onUploadComplete('', '') // Clear the artwork url
          toast.success('File successfully deleted from S3')
        } else {
          throw new Error(response.data.clearFileFromS3.error)
        }
      } catch (error) {
        toast.error(`Failed to delete file from S3: ${error.message}`)
      }
    }
  }, [
    clearFileFromS3,
    isFilePicked,
    isFileUploaded,
    isUploading,
    user.id,
    user.firstName,
    user.lastName,
    onUploadComplete,
  ])
  useEffect(() => {
    if (shouldReset) {
      handleFileClear() // Replace with your actual clear file logic
    }
  }, [shouldReset, handleFileClear])

  const handleUpload = (
    file: File,
    { url, fields, folderKey }: PresignedUrlResponse
  ) => {
    const formData = new FormData()
    formData.append('Content-Type', file.type)
    Object.entries({ ...fields, file }).forEach(([key, value]) => {
      formData.append(key, value)
    })

    setIsUploading(true)

    fetch(url, {
      method: 'POST',
      body: formData,
    })
      .then((res) => {
        if (res.ok) {
          setIsUploading(false)
          setIsFileUploaded(true)
          setUploadedArtwork(true)
          onUploadComplete(`${url}${fields.key}`, `${url}${folderKey}`)
          toast.success('File uploaded successfully!')
          console.log('File uploaded successfully!')
          return
        } else {
          setIsUploading(false)
          throw new Error('Error uploading file: ' + res.statusText)
        }
      })
      .catch((error) => {
        console.log(error.message)
        toast.error(error.message)
      })
  }

  // Main return
  return (
    <FormControl my={8} isInvalid={!!formError}>
      <FormLabel>Upload release artwork</FormLabel>
      <FormHelperText fontSize={'xs'} mb={2}>
        <InfoIcon mr={2} /> Please upload a square image with a 1:1 aspect
        ratio.
      </FormHelperText>
      <Input
        hidden
        type="file"
        ref={inputRef}
        accept="image/png, image/jpeg, image/jpg"
        onChange={handleFileChange}
      />
      <ButtonGroup
        borderColor={formError && 'red.300'}
        borderWidth={2}
        borderRadius={10}
        aria-label="Upload artwork"
        variant="solid"
        isAttached
        onBlur={handleBlur}
      >
        <Button
          colorScheme="gray"
          aria-hidden
          onClick={() => inputRef.current?.click()}
          isDisabled={isFileUploaded}
        >
          Choose a file
        </Button>

        <Button
          colorScheme="red"
          isDisabled={!isFilePicked}
          onClick={handleFileClear}
        >
          Clear file
        </Button>

        <Button
          colorScheme="green"
          isLoading={isUploading}
          isDisabled={isFileUploaded || !isFilePicked}
          loadingText="Uploading"
          onClick={() =>
            handleUpload(inputRef.current?.files?.[0], presignedUrl.current)
          }
        >
          Upload file
        </Button>
      </ButtonGroup>

      <FormErrorMessage minHeight={6}>
        <FormErrorIcon />
        {formError}
      </FormErrorMessage>

      <Flex gap={2} mt={2} flexDir={'column'}>
        <FormHelperText fontSize={'xs'}>
          File name: {inputRef.current?.files?.[0]?.name ?? 'No file selected'}
        </FormHelperText>
        {uploadedArtwork ? (
          <FormHelperText>
            <Icon as={CheckCircleIcon} color="green.500" mr={2} />
            The artwork file is present on server.
          </FormHelperText>
        ) : (
          <FormHelperText>
            <Icon as={InfoIcon} color="red.500" mr={2} />
            The artwork file is not present on server.
          </FormHelperText>
        )}
      </Flex>
    </FormControl>
  )
}
export default ArtworkUpload
