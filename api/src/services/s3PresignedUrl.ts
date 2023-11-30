// api/src/services/s3PresignedUrl/s3PresignedUrl.js

import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { createPresignedPost } from '@aws-sdk/s3-presigned-post'
import type { QueryResolvers } from 'types/graphql'
import { v4 as uuidv4 } from 'uuid'

// ... Import necessary AWS SDK modules and configurations ...

export const getPresignedUrl: QueryResolvers['getPresignedUrl'] = async ({
  fileType,
  fileName,
  user,
}) => {
  // Logic to generate a presigned URL

  // Create an S3 client
  const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  })

  const key = `uploads/${user.firstName}-${
    user.lastName
  }-${uuidv4()}/${fileName}`

  // Create the signed URL
  const presignedPostData = await createPresignedPost(s3Client, {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
    Expires: 3600,
    Conditions: [
      ['content-length-range', 0, 100000000], // up to 100MB
      ['starts-with', '$Content-Type', fileType],
    ],
  })

  console.log('presignedPostData requested:', presignedPostData)

  const url = presignedPostData.url
  const fields = presignedPostData.fields

  // Return the presigned URL and key
  return { url, fields }
}
