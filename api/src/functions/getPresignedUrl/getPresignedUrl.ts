import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import type { APIGatewayEvent, Context } from 'aws-lambda'
import { v4 as uuidv4 } from 'uuid'

import { isAuthenticated } from 'src/lib/auth'
import { logger } from 'src/lib/logger'

/**
 * The handler function is your code that processes http request events.
 * You can use return and throw to send a response or error, respectively.
 *
 * Important: When deployed, a custom serverless function is an open API endpoint and
 * is your responsibility to secure appropriately.
 *
 * @see {@link https://redwoodjs.com/docs/serverless-functions#security-considerations|Serverless Function Considerations}
 * in the RedwoodJS documentation for more information.
 *
 * @typedef { import('aws-lambda').APIGatewayEvent } APIGatewayEvent
 * @typedef { import('aws-lambda').Context } Context
 * @param { APIGatewayEvent } event - an object which contains information from the invoker.
 * @param { Context } context - contains information about the invocation,
 * function, and execution environment.
 */

export const handler = async (
  event: APIGatewayEvent,
  _context: Context,
  fileName: string
) => {
  logger.info(
    `${event.httpMethod} ${event.path}: Presigned URL function requested`
  )
  if (!isAuthenticated()) {
    console.warn(
      '⛔️ User is not authenticated and cannot get presigned URL ⛔️'
    )
    return {
      statusCode: 403,
      body: JSON.stringify({ message: 'Forbidden' }),
    }
  }
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    }
  }

  // Check for fileName in query string
  if (!fileName) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'No file name provided' }),
    }
  }
  // Create an S3 client
  const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  })

  const key = `uploads/${uuidv4()}/${fileName}`
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
    ContentType: 'audio/wav',
  })
  // Create the signed URL
  const url = await getSignedUrl(s3Client, command, {
    expiresIn: 3600,
  })

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url: url,
      key: key,
    }),
  }
}
