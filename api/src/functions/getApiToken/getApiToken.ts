/**
 * This file contains the implementation of the `getApiToken` function, which is a serverless function
 * responsible for refreshing API tokens and storing them in the database.
 *
 * The function is triggered by an HTTP request and performs the following steps:
 * 1. Checks if the request is authorized by comparing the `x-api-key` header with the `WEBSITE_API_KEY` environment variable.
 * 2. Retrieves the refresh token from the request header, or falls back to the latest token stored in the database or the `AUDIOSALAD_REFRESH_TOKEN` environment variable.
 * 3. Sends a request to the AudioSalad API to fetch new access and refresh tokens using the provided refresh token.
 * 4. If the refresh token is expired, sends an email notification to the admin.
 * 5. Stores the new tokens in the database.
 * 6. Returns a response indicating the success or failure of the token refresh operation.
 *
 */

import { fetch } from '@whatwg-node/fetch'
import type { APIGatewayEvent, Context } from 'aws-lambda'
import { addSeconds } from 'date-fns'
import cron from 'node-cron'

import { db } from 'src/lib/db'
import { sendEmail } from 'src/lib/emails/sendEmail'
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

/**
 * Checks if the token has expired based on the provided expiry date.
 * @param expiryDate The expiry date of the token.
 * @returns True if the token has expired, false otherwise.
 */
function isTokenExpired(expiryDate: Date): boolean {
  const currentDate = new Date()
  return currentDate > expiryDate
}

// local development: run every 30 minutes
cron.schedule('*/30 * * * *', async () => {
  console.log('Refreshing tokens internally...')

  try {
    fetch('http://localhost:8911/getApiToken', {
      method: 'GET',
      headers: {
        'x-api-key': process.env.WEBSITE_API_KEY,
      },
    })
  } catch (error) {
    console.error('Error refreshing tokens:', error)
  }
})

/**
 * Retrieves and refreshes the API token.
 * @param event - The API Gateway event object.
 * @param _context - The AWS Lambda context object.
 * @returns The response object containing the status code and message.
 */
export const handler = async (event: APIGatewayEvent, _context: Context) => {
  logger.info(`${event.httpMethod} ${event.path}: getApiToken function`)

  // Security check: Ensure the function is called by an authorized source
  if (event.headers['x-api-key'] !== process.env.WEBSITE_API_KEY) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: 'Forbidden' }),
    }
  }

  // Check for refreshToken in header, fall back to database and then .env
  let refreshToken = event.headers['x-refresh-token']

  if (!refreshToken) {
    // Fetch the latest refresh token from the database
    const latestTokenEntry = await db.apiToken.findFirst({
      orderBy: { createdAt: 'desc' },
    })
    refreshToken =
      latestTokenEntry?.refreshToken || process.env.AUDIOSALAD_REFRESH_TOKEN
  }

  // Proceed only if a refresh token is available
  if (!refreshToken) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'No refresh token available' }),
    }
  }
  console.log(
    'refreshToken:',
    refreshToken,
    'accessID:',
    process.env.AUDIOSALAD_ACCESS_ID
  )

  try {
    console.log(
      '🦆 Fetching new tokens from AudioSalad at address:' +
        process.env.AUDIOSALAD_API_ENDPOINT +
        '/access-token'
    )
    const response = await fetch(
      `${process.env.AUDIOSALAD_API_ENDPOINT}/access-token`,
      {
        method: 'POST',
        headers: {
          'X-Access-Id': process.env.AUDIOSALAD_ACCESS_ID,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      }
    )

    if (response.ok) {
      console.log('🪄 New tokens received from AudioSalad API')
      const data = await response.json()

      const accessTokenExpiresAt = addSeconds(
        new Date(),
        data.access_token_expires_in
      )
      const refreshTokenExpiresAt = addSeconds(
        new Date(),
        data.refresh_token_expires_in
      )

      // Send an email if the refresh token is expired

      if (isTokenExpired(refreshTokenExpiresAt)) {
        sendEmail({
          to: 'admin@jigsawmusicgroup.com',
          subject: 'Refresh token expired!',
          html: `<h1>The AudioSalad refresh token expired at ${refreshTokenExpiresAt.toISOString()}!</h1>
          <p>Go to <a href="https://jigsaw.dashboard.audiosalad.com">AudioSalad</a> and generate a new refresh token! Then run the API request manually at <a>${
            process.env.WEBSITE_URL
          }/admin/generate-new-token/</a></p>`,
          text: `The refresh token expired at ${refreshTokenExpiresAt.toISOString()}. Renew it as soon as possible`,
        })
      }
      // Store the new tokens in the database
      const newToken = await db.apiToken.create({
        data: {
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          accessTokenExpiresAt: accessTokenExpiresAt,
          refreshTokenExpiresAt: refreshTokenExpiresAt,
        },
      })

      console.log('🛑 Deleting old tokens from database...')
      // Delete all tokens except the latest one
      await db.apiToken.deleteMany({
        where: {
          id: {
            not: newToken.id,
          },
        },
      })

      console.log('✅ Tokens refreshed successfully')
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Tokens refreshed successfully' }),
      }
    } else {
      console.error('⛔️ Failed to refresh tokens:', response.status)
      return {
        statusCode: response.status,
        body: JSON.stringify({ message: 'Failed to refresh tokens' }),
      }
    }
  } catch (error) {
    console.error('⛔️ Error refreshing tokens:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    }
  }
}
