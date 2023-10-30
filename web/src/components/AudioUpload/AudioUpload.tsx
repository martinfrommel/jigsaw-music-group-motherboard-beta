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
import { useAuth } from 'src/auth'

interface AudioUploadProps extends BoxProps {
  onAudioChange: (file: File, duration: number) => void
  errors?: never
  bucketName: string
  folderName: string
  onUploadComplete: (path: string) => void
  projectId: string
}

export const AudioUpload: React.FC<AudioUploadProps> = ({
  onAudioChange,
  errors,
  bucketName,
  folderName,
  onUploadComplete,
  projectId,
  ...rest
}) => {
  const { colorMode } = useColorMode()
  const [flashColor, setFlashColor] = useState(false)
  const [filename, setFilename] = useState<string | null>(null)
  const acceptedFilesRef = useRef<File[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [totalSize, setTotalSize] = useState(0)
  const { currentUser } = useAuth();
  const userId = currentUser?.id;

  const handleUpload = async (file: File) => {
    const {data, error} = await supabase.storage.from('audioMasters').upload(file, cacheControl: '')
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
          type="button"
          position={'absolute'}
          top={4}
          right={4}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setFilename(null)
            acceptedFilesRef.current = []
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
      <Progress value={uploadProgress} max={100} />
    </Box>
  )
}

export default AudioUpload
