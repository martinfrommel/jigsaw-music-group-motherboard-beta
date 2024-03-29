import { IngestionStatus } from 'types/graphql'

import { db } from './db'

interface scanForIngestionInput {
  s3bucket: string
  s3path: string
}

const s3key = process.env.AWS_SECRET_ACCESS_KEY
const s3id = process.env.AWS_ACCESS_KEY_ID

/**
 * Scans for ingestion of audio files in AudioSalad.
 * @param {scanForIngestionInput} options - The options for scanning for ingestion.
 * @returns {Promise<{ status: number, body: any, data: string }>} - The response from the ingestion scan.
 * @throws {Error} - If there is an error uploading to AudioSalad.
 */
export const scanForIngestion = async ({
  s3bucket,
  s3path,
}: scanForIngestionInput) => {
  const accessToken = await db.apiToken.findFirst({
    orderBy: { createdAt: 'desc' },
    where: { accessTokenExpired: false },
  })

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
          s3_id: s3id,
          s3_key: s3key,
          s3_bucket: s3bucket,
          s3_path: s3path,
        }),
      }
    )
    return {
      status: response.status,
      body: await response.json(),
    }
  } catch (e) {
    console.log(e)
    throw new Error('Error scanning for ingestion')
  }
}

/**
 * Changes the ingestion status of a release in the database.
 *
 * @param {Object} params - The parameters for changing the ingestion status.
 * @param {IngestionStatus} params.status - The new ingestion status.
 * @param {number} params.id - The ID of the release.
 * @returns {Promise<Error|null>} - A promise that resolves to an error if there was an error changing the ingestion status, or null if the status was changed successfully.
 */
export const changeIngestionStatus = async ({
  status,
  id,
}: {
  status: IngestionStatus
  id: number
}) => {
  try {
    console.log('🦆 Changing ingestion status of: ' + id)
    console.log('🦆 New status: ' + status)
    await db.release.update({
      data: { ingestionStatus: status },
      where: { id: id },
    })
    console.log('✅ Ingestion status changed successfully')
    return true
  } catch (e) {
    throw new SyntaxError('⛔️ Error changing ingestion status')
  }
}

/**
 * Initiates the ingestion process for a release in AudioSalad.
 *
 * @param {Object} options - The options for ingestion.
 * @param {string} options.releaseId - The ID of the release to be ingested.
 * @returns {Promise<Object>} - A promise that resolves to an object containing the status and body of the ingestion response.
 * @throws {Error} - If there is an error uploading to AudioSalad.
 */
export const initiateIngestion = async ({ releaseId }) => {
  const release = await db.release.findFirst({
    where: { id: releaseId },
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { AWSFolderKey, ingestionStatus, labelId } = release
  const accessToken = await db.apiToken.findFirst({
    orderBy: { createdAt: 'desc' },
    where: { accessTokenExpired: false },
  })
  // if (ingestionStatus === 'error') {
  //   console.log('🦆 There is a problem with this release, review it manually!')
  //   throw new SyntaxError(
  //     'There is a problem with this release, review it manually!'
  //   )
  // }

  try {
    const parts = AWSFolderKey.split('/')
    const uploadsIndex = parts.indexOf('uploads')
    const folder = parts.slice(uploadsIndex).join('/')

    console.log('🦆 Trying to ingest to: ' + AWSFolderKey)
    const response = await fetch(
      `${process.env.AUDIOSALAD_API_ENDPOINT}/ingest/run`,
      {
        method: 'POST',
        headers: {
          'X-Access-Id': process.env.AUDIOSALAD_ACCESS_ID,
          Authorization: `Bearer ${accessToken.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          label_id: labelId,
          read_only: false,
          s3_bucket: `${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`,
          s3_id: s3id,
          s3_key: s3key,
          s3_path: folder,
        }),
      }
    )
    const responseBody = await response.json()
    console.log('🦆 Got a response for release of id: ' + releaseId)
    console.log('🦆 Response from AudioSalad: ' + response.status)

    if (response.status !== 200) {
      console.log('⛔️ Ingestion failed, changing ingestion status')
      await changeIngestionStatus({ status: 'error', id: releaseId })
      return { status: response.status, body: responseBody }
    }

    const ingestId = responseBody.ingest_id
    console.log('🦆 Ingestion ID received: ' + ingestId)
    await db.release.update({ data: { ingestId }, where: { id: releaseId } })

    console.log('✅ Ingestion successful, changing ingestion status')
    await changeIngestionStatus({ status: 'complete', id: releaseId })
    return { status: response.status, body: responseBody }
  } catch (e) {
    console.error(e)
    await changeIngestionStatus({ status: 'error', id: releaseId })
    throw new Error('⛔️ Error ingesting release: ' + e.message)
  }
}

export const getIngestionStatus = async ({ id }) => {
  const release = await db.release.findFirst({
    where: { id },
  })

  const accessToken = await db.apiToken.findFirst({
    where: { accessTokenExpired: false },
  })
  console.log('🦆 Checking ingestion status of: ' + id)
  const response = await fetch(
    `${process.env.AUDIOSALAD_API_ENDPOINT}/ingest/status?${release.ingestId}}`,
    {
      method: 'GET',
      headers: {
        'X-Access-Id': process.env.AUDIOSALAD_ACCESS_ID,
        Authorization: `Bearer ${accessToken.accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  )

  const responseBody = await response.json()
  console.log('🦆 Got a response for release of id: ' + id)
  console.log('🦆 Response from AudioSalad: ' + response.status + response.body)

  if (!response.ok) {
    console.log('⛔️ Check failed, changing ingestion status')
    changeIngestionStatus({
      status: 'error',
      id: id,
    })
    throw new SyntaxError('Error checking ingestion status')
  }

  return responseBody.status
}
