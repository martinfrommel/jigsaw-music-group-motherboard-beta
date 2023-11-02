import type { APIGatewayEvent } from 'aws-lambda'

import { db } from 'src/lib/db'
import { sendEmail } from 'src/lib/sendEmail'
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
export const handler = async (event: APIGatewayEvent) => {
  if (event.headers['x-api-key'] !== process.env.FUNCTION_API_KEY) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: 'Forbidden' }),
    }
  }

  // ... rest of your function logic

  const currentDate = new Date()

  const usersWithExpiredTokens = await db.user.findMany({
    where: {
      signUpTokenExpiresAt: {
        lt: currentDate,
      },
    },
  })

  for (const user of usersWithExpiredTokens) {
    // Notify the user
    sendEmail({
      to: user.email,
      subject: 'Your sign-up token has expired',
      text: 'Your sign-up token has expired. Please request a new one if you still wish to sign up.',
      html: '',
      // ... any other email options
    })

    // Clear the token from the database
    await db.user.update({
      where: { id: user.id },
      data: {
        signUpToken: null,
        signUpTokenExpiresAt: null,
      },
    })
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Expired tokens cleaned up.',
    }),
  }
}
