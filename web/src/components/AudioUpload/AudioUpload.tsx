import React, { useEffect, useRef, useState } from 'react'

import {
  S3,
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  CreateBucketCommand,
} from '@aws-sdk/client-s3'
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
import { useDropzone } from 'react-dropzone'

import { toast } from '@redwoodjs/web/dist/toast'

interface AudioUploadProps extends BoxProps {
  onAudioChange: (file: File, duration: number) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors?: any
  folderName: string
  onUploadComplete: (path: string) => void
}

const s3Client = new S3Client({
  region: 'eu-west-2', // e.g., us-east-1
  credentials: {
    accessKeyId: 'AKIAVK6UBHV4MSMH7CN5',
    secretAccessKey: '0cMY2R6gPPxrVPhDoQKejfHLYm3PbicplLYD5KK4',
  },
})

export const AudioUpload: React.FC<AudioUploadProps> = ({
  onAudioChange,
  errors,
  folderName,
  onUploadComplete,
  ...rest
}) => {
  const bucketPath = 'test-bucket-jigsaw'
  const { colorMode } = useColorMode()
  const [flashColor, setFlashColor] = useState(false)
  const [filename, setFilename] = useState<string | null>(null)
  const acceptedFilesRef = useRef<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [filePath, setFilePath] = useState<string | null>(null)

  const clearFile = async () => {
    if (filePath) {
      try {
        // AWS SDK doesn't have a direct method to check if a file exists like Supabase.
        // So, we attempt to delete the file directly.
        const deleteParams = {
          Bucket: bucketPath,
          Key: filePath,
        }
        const deleteCommand = new DeleteObjectCommand(deleteParams)
        await s3Client.send(deleteCommand)

        toast.success('File successfully deleted from S3')
      } catch (error) {
        // AWS S3 delete object does not throw an error if the object does not exist.
        // So, this catch block handles other potential errors.
        toast.error(`Failed to delete file from S3: ${error.message}`)
      }
    }
    // Clear the file from browser context
    setFilename(null)
    acceptedFilesRef.current = []
    toast.success('File was cleared')
  }

  const handleUpload = async (file: File) => {
    const filePath = `${file.name}`
    setFilePath(filePath)

    setIsUploading(true) // Start the indeterminate progress

    try {
      // Now, upload the file
      const uploadParams = {
        Bucket: bucketPath,
        Key: filePath,
        Body: file,
        ContentType: 'audio/wav',
        CacheControl: 'max-age=3600',
      }
      console.log('Uploading file: ' + filePath)
      const uploadCommand = new PutObjectCommand(uploadParams)
      console.log('Sending command')
      await s3Client.send(uploadCommand)
      console.log('File uploaded')

      setIsUploading(false) // Stop the indeterminate progress
      onUploadComplete(filePath)
      toast.success('File successfully uploaded')
    } catch (error) {
      setIsUploading(false)
      toast.error(`Upload failed: ${error.message}`)
      // clearFile()
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
