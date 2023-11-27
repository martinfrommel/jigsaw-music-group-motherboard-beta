import { fetch } from '@whatwg-node/fetch'
import type { APIGatewayEvent, Context } from 'aws-lambda'
import { addSeconds } from 'date-fns'

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

// Check if the token is expired
function isTokenExpired(expiryDate: Date): boolean {
  const currentDate = new Date()
  return currentDate > expiryDate
}

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
      'Fetching new tokens from AudioSalad at address:' +
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
      console.log('New tokens received from AudioSalad API')
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
      await db.apiToken.create({
        data: {
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          accessTokenExpiresAt: accessTokenExpiresAt,
          refreshTokenExpiresAt: refreshTokenExpiresAt,
        },
      })
      console.log('Tokens refreshed successfully')
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Tokens refreshed successfully' }),
      }
    } else {
      console.error('Failed to refresh tokens:', response.status)
      return {
        statusCode: response.status,
        body: JSON.stringify({ message: 'Failed to refresh tokens' }),
      }
    }
  } catch (error) {
    console.error('Error refreshing tokens:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    }
  }
}
