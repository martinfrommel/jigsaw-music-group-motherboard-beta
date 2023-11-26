import React, { useEffect, useRef, useState } from 'react'

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

import supabase from '../../lib/initiliaseSupabase'

interface AudioUploadProps extends BoxProps {
  onAudioChange: (file: File, duration: number) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors?: any
  bucketName: string
  folderName: string
  onUploadComplete: (path: string) => void
}

export const AudioUpload: React.FC<AudioUploadProps> = ({
  onAudioChange,
  errors,
  bucketName,
  folderName,
  onUploadComplete,
  ...rest
}) => {
  const { colorMode } = useColorMode()
  const [flashColor, setFlashColor] = useState(false)
  const [filename, setFilename] = useState<string | null>(null)
  const acceptedFilesRef = useRef<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [filePath, setFilePath] = useState<string | null>(null)

  const clearFile = async () => {
    if (filePath) {
      // Check if the file exists in Supabase
      const { data, error: statError } = await supabase.storage
        .from(bucketName)
        .list(folderName, {
          limit: 1,
          offset: 0,
          search: filename,
        })

      if (data) {
        toast.loading('File exists, deleting from storage...', {
          duration: 500,
        })
        // If file exists, delete it
        const { error: deleteError } = await supabase.storage
          .from(bucketName)
          .remove([filePath])

        if (deleteError) {
          toast.error(
            `Failed to delete file from Supabase: ${deleteError.message}`
          )
          return
        }
      } else if (statError) {
        toast.error(`Failed to check file in Supabase: ${statError.message}`)
        return
      }
    }

    // Clear the file from browser context
    setFilename(null)
    acceptedFilesRef.current = []
    toast.success('File was cleared')
  }

  const handleUpload = async (file: File) => {
    // ... Your existing code to check user authentication ...
    const filePath = `${folderName}/${file.name}`
    setFilePath(filePath)

    setIsUploading(true) // Start the indeterminate progress

    // Upload the file
    try {
      // Upload the file
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: 'audio/wav',
        })

      setIsUploading(false) // Stop the indeterminate progress

      // Handle errors
      if (error) {
        toast.error(`Upload failed: ${error.message}`)
        // clearFile()
      } else {
        onUploadComplete(data.path)
        toast.success('File successfully uploaded')
      }
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
