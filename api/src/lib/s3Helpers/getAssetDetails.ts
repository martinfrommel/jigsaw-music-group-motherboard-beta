import { HeadObjectCommand, S3Client } from '@aws-sdk/client-s3'

import { parseS3Url } from './parseS3Url'

export const getAssetDetail = async (url: string, s3: S3Client) => {
  const decodedUrl = decodeURIComponent(url)
  const { bucket, decodedKey: key } = parseS3Url(decodedUrl)
  const command = new HeadObjectCommand({
    Bucket: bucket,
    Key: key,
  })
  const response = await s3.send(command)
  const fileName = key.split('/').pop()
  return {
    md5Checksum: response.ETag?.replace(/"/g, ''),
    fileName: fileName,
    mimeType: response.ContentType,
    error: response.$metadata.httpStatusCode !== 200,
  }
}
