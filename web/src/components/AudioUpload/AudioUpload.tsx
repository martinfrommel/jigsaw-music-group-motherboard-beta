import { useCallback, useEffect, useState } from 'react'

import { CloseIcon } from '@chakra-ui/icons'
import {
  Box,
  Text,
  Progress,
  Icon,
  Center,
  AlertIcon,
  Alert,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone'

interface AudioUploadProps {
  onAudioChange: (file: File, duration: number) => void
}

export const AudioUpload: React.FC<AudioUploadProps> = ({ onAudioChange }) => {
  const [audioLength, setAudioLength] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isInvalidFormat, setIsInvalidFormat] = useState(false)
  const [isDragActive, setIsDragActive] = useState(false)



  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60)
    const seconds = Math.floor(duration % 60)
    return `${minutes}m ${seconds}s`
  }

  const handleAudioUpload = useCallback(
    (acceptedFiles: File[], fileRejections) => {
      // Reset the state every time a new item is dropped
      setIsInvalidFormat(false)
      setUploadProgress(0)
      setAudioLength(null)

      if (fileRejections.length > 0) {
        setIsInvalidFormat(true)
        return
      }

      const file = acceptedFiles[0]
      const objectURL = URL.createObjectURL(file)
      const audio = new Audio(objectURL)
      audio.onloadedmetadata = function () {
        const duration = audio.duration
        setAudioLength(formatDuration(duration))
        onAudioChange(file, duration)
        mockUploadFile()
      }
    },
    [onAudioChange]
  )

  const { getRootProps, getInputProps, isDragAccept, isDragReject } =
    useDropzone({
      accept: {
        'audio/wav': ['.wav'],
        'audio/quicktime': ['.m4a, .alac'],
      },
      onDrop: handleAudioUpload,
      onDragEnter: () => setIsDragActive(true),
      onDragLeave: () => setIsDragActive(false),
    })

  return (
    <>
      <Box
        as={motion.div}
        {...getRootProps()}
        p={12}
        border={isInvalidFormat ? '4px solid #e63946 ' : '4px dashed gray'}
        mt={4}
        position="relative"
        transition={{
          type: 'ease-in-out',
          duration: '3s',
        }}
      >
        <input {...getInputProps()} />
        {isDragActive && !isDragReject && (
          <Box
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'ease-in-out' }}
            position="absolute"
            top={0}
            right={0}
            bottom={0}
            left={0}
            backgroundColor="rgba(0, 0, 0, 0.1)"
            zIndex={2}
          />
        )}
        {isDragActive && isDragReject && (
          <Icon as={CloseIcon} color="red" fontSize="2xl" zIndex={3} />
        )}
        <Text>
          Drag and drop your item here or{' '}
          <Text
            as="span"
            fontWeight={'black'}
            fontSize={'2xl'}
            textTransform={'uppercase'}
            mx={4}
            bgClip={'text'}
            bgGradient={'linear(to-l, #7928CA, #FF0080) '}
          >
            click
          </Text>{' '}
          to select one
        </Text>
        <Text textAlign={'center'} fontWeight={'light'} mt={4}>
          {audioLength && `Song length: ${audioLength}`}
        </Text>
        {uploadProgress > 0 && <Progress value={uploadProgress} mt={4} />}
      </Box>
    </>
  )
}
