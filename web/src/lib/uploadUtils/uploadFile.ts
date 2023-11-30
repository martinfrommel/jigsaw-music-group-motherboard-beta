import { toast } from '@redwoodjs/web/toast'

interface UploadFileProps {
  file: File
  presignedUrl: string
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

export const uploadFile = async ({
  file,
  presignedUrl,
  fields,
}: UploadFileProps): Promise<Response> => {
  // Check for presignedUrl, file, and fields
  if (!presignedUrl) {
    throw new Error('No presigned URL')
  }
  if (!file) {
    throw new Error('No file')
  }
  if (!file.type) {
    throw new Error('No file type')
  }
  if (!fields) {
    throw new Error('No fields')
  }

  // Upload the file to S3
  try {
    // Create a new FormData instance to hold the file and fields
    const formData = new FormData()

    // Append additional fields from the presigned POST request
    for (const [key, value] of Object.entries(fields)) {
      formData.append(key, value)
    }

    // Append the file
    formData.append('file', file)

    const response = await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
    })

    if (response.ok) {
      toast.success('File uploaded successfully')
    } else {
      toast.error('Failed to upload file')
    }

    return response
  } catch (error) {
    toast.error('An error occurred while uploading the file:' + error.message)
    throw error
  }
}
