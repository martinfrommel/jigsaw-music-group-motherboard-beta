import React, { useCallback, useEffect, useRef, useState } from 'react'

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
} from '@chakra-ui/react'
import { FormikHandlers } from 'formik'
import { useDropzone } from 'react-dropzone'

import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/dist/toast'

import { useAuth } from 'src/auth'

interface AudioUploadProps extends BoxProps {
  onAudioChange: (file: File, duration: number) => void
  onBlur: FormikHandlers['handleBlur']
  errors?: string
  onUploadComplete: (url: string, AWSFolderKey: string) => void
  user: {
    firstName: string
    lastName: string
  }
  value: string
  shouldReset: boolean
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
  folderKey: string
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
  onBlur: handleBlur,
  shouldReset,
  ...rest
}) => {
  const { colorMode } = useColorMode()
  const [flashColor, setFlashColor] = useState(false)
  const [filename, setFilename] = useState<string | null>(null)
  const acceptedFilesRef = useRef<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [filePath, setFilePath] = useState<string | null>(null)
  const [isUploaded, setIsUploaded] = useState(false)
  const { currentUser } = useAuth()
  const [getPresignedUrl, ,] = useLazyQuery(GET_PRESIGNED_URL_QUERY)
  const [clearFileFromS3] = useMutation(CLEAR_FILE_FROM_S3_MUTATION)
  const folderKey = sessionStorage.getItem('folderKey')

  const clearFile = useCallback(async () => {
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
        onUploadComplete(undefined, undefined)
        toast.success('File successfully deleted from S3')
        setIsUploaded(false)
      } else {
        throw new Error(response.data.clearFileFromS3.error)
      }
    } catch (error) {
      toast.error(`Failed to delete file from S3: ${error.message}`)
    }

    // Clear the file from browser context
    setFilename(null)
    acceptedFilesRef.current = []
    setFilePath(null)
    onAudioChange(null, 0)
  }, [
    clearFileFromS3,
    currentUser.firstName,
    currentUser.id,
    currentUser.lastName,
    filePath,
    onAudioChange,
    onUploadComplete,
  ])

  useEffect(() => {
    if (shouldReset) {
      clearFile() // Replace with your actual clear file logic
    }
  }, [clearFile, shouldReset])

  // Function to get the presigned URL
  const fetchPresignedUrl = async (file) => {
    const { data } = await getPresignedUrl({
      variables: {
        fileType: file.type,
        fileName: file.name,
        pregeneratedUrl: folderKey ? folderKey : null,
        user: {
          id: currentUser.id,
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
        },
      },
    })
    return data.getPresignedUrl as PresignedUrlResponse
  }

  // Function to upload the file
  const uploadFile = async (file, url, fields) => {
    const formData = new FormData()
    formData.append('Content-Type', file.type)
    Object.entries(fields).forEach(([key, value]) => {
      formData.append(key, String(value))
    })
    formData.append('file', file)

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.headers.get('Location')
  }

  const handleUpload = async (file) => {
    try {
      setIsUploading(true)
      console.log('Fetching presigned URL...')
      const { url, fields, folderKey } = await fetchPresignedUrl(file)

      console.log('Uploading file...')
      const location = await uploadFile(file, url, fields)
      const uploadedFileUrl = decodeURIComponent(location)

      toast.success('File successfully uploaded')
      setFilePath(fields.key)
      console.log('Uploaded File URL:', uploadedFileUrl)
      onUploadComplete(`${url}${fields.key}`, `${url}${folderKey}`)
      setIsUploaded(true)
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(`Upload failed: ${error.message}`)
      clearFile()
    } finally {
      setIsUploading(false)
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
        !!errors && !isDragActive
          ? 'red.300'
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
      {(isUploaded || filename) && (
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
          onBlur={handleBlur}
        >
          Clear File
        </Button>
      )}

      <input {...getInputProps()} onBlur={handleBlur} />
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
      {isUploading && (
        <Progress
          w={'90%'}
          h={4}
          rounded={4}
          isIndeterminate={isUploading}
          hasStripe
          position={'relative'}
          top={10}
        />
      )}
    </Box>
  )
}

export default AudioUpload
