import { fetch } from '@whatwg-node/fetch'
import { QueryResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

export const getLabels: QueryResolvers['getLabels'] = async () => {
  const apiToken = await db.apiToken.findFirst({
    orderBy: { createdAt: 'desc' },
  })
  const response = await fetch(`${process.env.AUDIOSALAD_API_ENDPOINT}/label`, {
    method: 'GET',
    headers: {
      'X-Access-Id': process.env.AUDIOSALAD_ACCESS_ID,
      Authorization: `Bearer ${apiToken?.accessToken}`,
      'Content-Type': 'application/json',
    },
  })

  console.log(
    'Fetching labels at:',
    `${process.env.AUDIOSALAD_API_ENDPOINT}/label` + ' with access token:',
    `${apiToken?.accessToken}`
  )

  const data = await response.json()
  const statusCode = response.status

  if (statusCode !== 200) {
    throw new SyntaxError(statusCode.toString())
  }

  return data.map((label) => {
    return {
      id: label.id,
      name: label.name,
    }
  })
}
