import React, { useEffect } from 'react'

import { Box, BoxProps, useColorMode, Text } from '@chakra-ui/react'
import Uppy from '@uppy/core'
import Dashboard from '@uppy/dashboard'

import '@uppy/core/dist/style.min.css'
import '@uppy/dashboard/dist/style.min.css'
import { toast } from '@redwoodjs/web/dist/toast'

interface AudioUploadProps extends BoxProps {
  onAudioChange: (file: File, duration: number) => void
}

const uppy = new Uppy({
  autoProceed: true,
  restrictions: {
    allowedFileTypes: ['.wav', '.m4a', '.alac'],
    maxNumberOfFiles: 1,
  },
})

export const AudioUpload: React.FC<AudioUploadProps> = ({
  onAudioChange,
  ...rest
}) => {
  const { colorMode } = useColorMode()

  useEffect(() => {
    uppy
      .use(Dashboard, {
        inline: true,
        target: '#uppy-dashboard',
        theme: colorMode === 'dark' ? 'dark' : 'light',
      })
      .on('upload-success', (file) => {
        if (file.data instanceof File) {
          const audio = new Audio(URL.createObjectURL(file.data as File))
          audio.onloadedmetadata = function () {
            onAudioChange(file.data as File, audio.duration)
          }
        }
      })
      .on('error', (err) => {
        toast.error(err.message)
      })

    return () => {
      uppy.close()
    }
  }, [colorMode, onAudioChange])

  return (
    <>
      <Box {...rest} id="uppy-dashboard" />
    </>
  )
}

export default AudioUpload
