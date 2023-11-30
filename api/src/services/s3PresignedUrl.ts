// api/src/services/s3PresignedUrl/s3PresignedUrl.js

import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { createPresignedPost } from '@aws-sdk/s3-presigned-post'
import type { MutationResolvers, QueryResolvers } from 'types/graphql'
import { v4 as uuidv4 } from 'uuid'

import { isAuthenticated } from 'src/lib/auth'

// ... Import necessary AWS SDK modules and configurations ...

export const getPresignedUrl: QueryResolvers['getPresignedUrl'] = async ({
  pregeneratedUrl,
  fileType,
  fileName,
  user,
}) => {
  // Create an S3 client
  const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  })

  const folderKey = pregeneratedUrl
    ? pregeneratedUrl
    : `uploads/${user.firstName}-${user.lastName}-${uuidv4()}/`

  const fileKey = `${fileName}`

  // Create the signed URL
  const presignedPostData = await createPresignedPost(s3Client, {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: folderKey + fileKey,
    Expires: 3600,
    Conditions: [
      ['content-length-range', 0, 100000000], // up to 100MB
      ['starts-with', '$Content-Type', fileType],
    ],
  })

  console.log('presignedPostData requested:', presignedPostData, folderKey)

  const url = presignedPostData.url
  const fields = presignedPostData.fields

  // Return the presigned URL and key
  return { url, fields, folderKey }
}

// Clear the file upon request
export const clearFileFromS3: MutationResolvers['clearFileFromS3'] = async ({
  filePath,
  user,
}) => {
  // Log the incoming request
  console.log(
    'Received a request to delete file:',
    filePath,
    'from user:',
    user
  )
  // Check the incoming request parameters
  if (!filePath) {
    return { ok: false, error: 'No file provided' }
  }
  if (!isAuthenticated) {
    return { ok: false, error: 'Unauthorised request' }
  }

  // Create an S3 client
  const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  })

  // Create the delete command
  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: filePath,
  })
  try {
    console.log('Deleting the file...')
    // Check the file path
    if (!filePath.startsWith('uploads/')) {
      return { ok: false, error: 'Invalid file path' }
    }
    // Check the user
    if (user)
      // Delete the file
      await s3Client.send(command)
    console.log('File deleted successfully')
    return { ok: true }
  } catch (error) {
    console.error(error)
    return { ok: false, error: String(error.message) }
  }
}
