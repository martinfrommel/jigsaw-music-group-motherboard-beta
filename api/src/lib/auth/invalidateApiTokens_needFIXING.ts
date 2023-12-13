import { fetch } from '@whatwg-node/fetch'
import { ApiToken } from 'types/graphql'

import { db } from 'src/lib/db'

import { sendEmail } from '../emails/sendEmail'

export async function invalidateApiTokens() {
  try {
    const apiTokens = await db.apiToken.findMany({
      where: { accessTokenExpired: false },
      orderBy: { refreshTokenExpiresAt: 'desc' },
    })

    const currentDate = new Date()

    for (const token of apiTokens) {
      if (token.accessTokenExpiresAt < currentDate) {
        if (token.refreshTokenExpiresAt >= currentDate) {
          const response = await fetch(
            `${process.env.WEBSITE_API_URL}/getApiToken`,
            {
              method: 'GET',
              headers: {
                'x-api-key': process.env.WEBSITE_API_KEY,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ refreshToken: token.refreshToken }),
            }
          )

          if (response.ok) {
            const data: ApiToken = await response.json()

            await db.apiToken.create({
              data,
            })
          }
        } else {
          await db.apiToken.update({
            where: { id: token.id },
            data: { accessTokenExpired: false },
          })
        }
      }
    }
    console.log('Api tokens invalidated successfully.')
  } catch (error) {
    console.error('Error occurred while invalidating api tokens:', error)
  }
}

invalidateApiTokens()
