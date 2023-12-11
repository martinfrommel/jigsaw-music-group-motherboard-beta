import { IngestionStatus } from 'types/graphql'

import { db } from './db'

interface scanForIngestionInput {
  s3bucket: string
  s3path: string
}

const key = '7Iev9O4OGJuZyMtZb85xDxZ69r+V0io63iSQXyjv'
const id = 'AKIAVK6UBHV4INHIKP5O'
export const scanForIngestion = async ({
  s3bucket,
  s3path,
}: scanForIngestionInput) => {
  const accessToken = await db.apiToken.findFirst({
    orderBy: { createdAt: 'desc' },
    where: { accessTokenExpired: false },
  })
  const parsedData = JSON.stringify({ s3bucket, s3path, accessToken, id, key })
  try {
    const response = await fetch(
      `${process.env.AUDIOSALAD_API_ENDPOINT}/ingest/scan`,
      {
        method: 'POST',
        headers: {
          'X-Access-Id': process.env.AUDIOSALAD_ACCESS_ID,
          Authorization: `Bearer ${accessToken.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          s3_id: id,
          s3_key: key,
          s3_bucket: s3bucket,
          s3_path: s3path,
        }),
      }
    )
    return {
      status: response.status,
      body: await response.json(),
      data: parsedData,
    }
  } catch (e) {
    console.log(e)
    throw new Error('Error uploading to AudioSalad')
  }
}

export const changeIngestionStatus = async ({
  status,
  id,
}: {
  status: IngestionStatus
  id: number
}) => {
  try {
    db.release.update({
      data: { ingestionStatus: status },
      where: { id: id },
    })
  } catch (e) {
    console.log('Error changing ingestion status:' + e)
    return e
  }
}
