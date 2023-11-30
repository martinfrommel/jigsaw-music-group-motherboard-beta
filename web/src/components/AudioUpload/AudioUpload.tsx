import React, { useEffect, useRef, useState } from 'react'

import { useLazyQuery } from '@apollo/client'
import {
  Box,
  BoxProps,
  useColorMode,
  Text,
  Highlight,
  Flex,
  Button,
  Progress,
  Spinner,
} from '@chakra-ui/react'
import { useDropzone } from 'react-dropzone'

import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/dist/toast'

import { useAuth } from 'src/auth'

import FailedToFetchData from '../DataFetching/FailedToFetchData/FailedToFetchData'
export interface AudioUploadProps extends BoxProps {
  onAudioChange: (file: File, duration: number) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors?: any
  onUploadComplete: (path: string) => void
  user: {
    firstName: string
    lastName: string
  }
}
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
}

export const GET_PRESIGNED_URL_QUERY = gql`
  query GetPresignedUrl(
    $fileType: String!
    $fileName: String!
    $user: UserInput!
  ) {
    getPresignedUrl(fileType: $fileType, fileName: $fileName, user: $user) {
      url
      fields
    }
  }
`

export const CLEAR_FILE_FROM_S3_MUTATION = gql`
  mutation clearFileFromS3($filePath: String!, $user: UserInput!) {
    clearFileFromS3(filePath: $filePath, user: $user) {
      ok
      error
    }
  }
`

export const AudioUpload: React.FC<AudioUploadProps> = ({
  onAudioChange,
  errors,
  onUploadComplete,

  ...rest
}) => {
  const { colorMode } = useColorMode()
  const [flashColor, setFlashColor] = useState(false)
  const [filename, setFilename] = useState<string | null>(null)
  const acceptedFilesRef = useRef<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [filePath, setFilePath] = useState<string | null>(null)
  const { currentUser } = useAuth()
  const [
    getPresignedUrl,
    { loading: getPresignedUrlLoading, error: getPresignedUrlError },
  ] = useLazyQuery(GET_PRESIGNED_URL_QUERY)
  const [clearFileFromS3] = useMutation(CLEAR_FILE_FROM_S3_MUTATION)
  const clearFile = async () => {
    if (!filePath) {
      toast.error('No file selected')
      return
    }

    try {
      // Call the mutation to clear the file from S3
      const response = await clearFileFromS3({
        variables: {
          filePath,
          user: {
            id: currentUser.id,
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
          }, // Assuming currentUser contains the required user fields
        },
      })

      // Check the mutation response
      if (response.data.clearFileFromS3.ok) {
        toast.success('File successfully deleted from S3')
      } else {
        throw new Error(response.data.clearFileFromS3.error)
      }
    } catch (error) {
      toast.error(`Failed to delete file from S3: ${error.message}`)
    }

    // Clear the file from browser context
    setFilename(null)
    acceptedFilesRef.current = []
    toast.success('File was cleared from local reference')
  }

  const handleUpload = async (file: File) => {
    // Generate the file path
    setFilePath(filePath)

    // Trigger the lazy query
    getPresignedUrl({
      variables: {
        fileType: file.type,
        fileName: file.name,
        user: {
          id: currentUser.id,
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
        },
      },
    })

    // Check if the query is loading
    if (getPresignedUrlLoading) {
      setIsLoadingData(true)
      console.log('Fetching presigned URL...')
      return // Optionally, you can show a loading indicator or return early
    }

    // Handle query error
    if (getPresignedUrlError) {
      setIsLoadingData(false) // Stop the fetching url spinner progress
      console.error('Error fetching presigned URL:', getPresignedUrlError)
      toast.error(
        `Error fetching presigned URL: ${getPresignedUrlError.message}`
      )
      return (
        <FailedToFetchData>
          <p>Failed to fetch data</p>
        </FailedToFetchData>
      )
    }

    // Check if data is available
    try {
      const { data } = (await getPresignedUrl({
        variables: {
          fileType: file.type,
          fileName: file.name,
          user: {
            id: currentUser.id,
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
          },
        },
      })) as { data: { getPresignedUrl: PresignedUrlResponse } }

      if (data) {
        const { url, fields } = data.getPresignedUrl

        const formData = new FormData()
        formData.append('Content-Type', file.type)
        Object.entries(fields).forEach(([key, value]) => {
          formData.append(key, String(value))
        })
        formData.append('file', file)

        setIsUploading(true)
        console.log('Uploading file...')
        const response = await fetch(url, {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const location = response.headers.get('Location')
        const uploadedFileUrl = decodeURIComponent(location)
        setFilePath(data.getPresignedUrl.fields.key)
        setIsUploading(false)
        onUploadComplete(filePath)
        toast.success('File successfully uploaded')
        console.log('Uploaded File URL:', uploadedFileUrl)
      }
    } catch (uploadError) {
      setIsUploading(false)
      toast.error(`Upload failed: ${uploadError.message}`)
      clearFile()
    }
  }

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    fileRejections,
    acceptedFiles,
  } = useDropzone({
    accept: {
      'audio/wav': ['.wav'],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        setFilename(file.name)
        acceptedFilesRef.current = acceptedFiles
        const audio = new Audio(URL.createObjectURL(file))
        audio.onloadedmetadata = function () {
          onAudioChange(file, audio.duration)
        }
        console.log('Accepted a file: ' + setFilename)

        // Begin the upload:
        handleUpload(file)
      } else {
        setFilename(null)
        throw new Error('Invalid filetype')
      }
    },
  })

  useEffect(() => {
    if (acceptedFiles.length > 0 || fileRejections.length > 0) {
      setFlashColor(true)
      setTimeout(() => {
        setFlashColor(false)
      }, 1000)
    }
  }, [acceptedFiles, fileRejections])

  return (
    <Box
      as={Flex}
      {...rest}
      {...getRootProps()}
      borderWidth={2}
      borderColor={
        errors && acceptedFiles.length === 0 && !isDragActive
          ? '#f87978'
          : acceptedFiles.length > 0
          ? 'blackAlpha'
          : isDragActive
          ? 'blackAlpha.400'
          : 'blackAlpha'
      }
      p={20}
      borderRadius={6}
      bgColor={
        flashColor
          ? acceptedFiles.length > 0
            ? 'green'
            : '#f87978'
          : isDragActive
          ? 'blackAlpha.400'
          : 'blackAlpha'
      }
      transition={'all 0.3s ease-in-out'}
      width={'full'}
      minWidth={'full'}
      cursor={'pointer'}
      textAlign={'center'}
      justifyContent={'center'}
      alignItems={'center'}
      flexDirection={'column'}
      height={64}
      mt={4}
    >
      {filename && (
        <Button
          aria-label="Clear File button"
          type="button"
          position={'absolute'}
          top={4}
          right={4}
          isDisabled={isUploading}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            clearFile()
          }}
        >
          Clear File
        </Button>
      )}

      <input {...getInputProps()} />
      <Text
        fontWeight={'bold'}
        fontSize={'lg'}
        lineHeight={10}
        width={'full'}
        minWidth={'full'}
      >
        {isDragAccept && (
          <Highlight
            query={['Will be']}
            styles={{ py: '2', px: '1', rounded: '4', bg: 'green' }}
          >
            {'The files will be accepted ✅'}
          </Highlight>
        )}
        {isDragReject && (
          <Highlight
            query={['Will not be']}
            styles={{ py: '2', px: '1', rounded: '4', bg: 'red' }}
          >
            {'The files will not be accepted! ⛔️'}
          </Highlight>
        )}

        {isDragActive && !isDragAccept && !isDragReject && (
          <Highlight
            query={['Drop it']}
            styles={{
              py: '2',
              px: '1',
              rounded: '4',
              bg: 'blackAlpha.400',
              color: `${colorMode == 'dark' ? 'white' : ''}`,
            }}
          >
            {`Drop it like it's hot... 👇`}
          </Highlight>
        )}
        {!isDragActive && (
          <Highlight
            query={['Drag & drop', 'click']}
            styles={{
              py: '2',
              px: '1',
              rounded: '4',
              bg: 'blackAlpha.400',
              color: `${colorMode == 'dark' ? 'white' : ''}`,
            }}
          >
            {
              'Drag & drop the master audio file here, or click to select one 🗂️'
            }
          </Highlight>
        )}
      </Text>
      {filename && <Text fontWeight={'light'}>Accepted file: {filename}</Text>}
      {isLoadingData && <Spinner />}
      {isUploading && (
        <Progress
          w={'90%'}
          h={4}
          rounded={4}
          isIndeterminate={isUploading}
          hasStripe
          position={'absolute'}
          bottom={2}
        />
      )}
    </Box>
  )
}

export default AudioUpload
