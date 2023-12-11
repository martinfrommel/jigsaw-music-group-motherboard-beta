import { IngestionStatus, Release } from 'types/graphql'

import { db } from './db'

interface scanForIngestionInput {
  s3bucket: string
  s3path: string
}

const s3key = '7Iev9O4OGJuZyMtZb85xDxZ69r+V0io63iSQXyjv'
const s3id = 'AKIAVK6UBHV4INHIKP5O'

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
  const parsedData = JSON.stringify({
    s3bucket,
    s3path,
    accessToken,
    s3id,
    s3key,
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
      data: parsedData,
    }
  } catch (e) {
    console.log(e)
    throw new Error('Error uploading to AudioSalad')
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
    db.release.update({
      data: { ingestionStatus: status },
      where: { id: id },
    })
  } catch (e) {
    console.log('Error changing ingestion status:' + e)
    return e
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
  const release = (await db.release.findFirst({
    where: { id: releaseId },
  })) as Release

  const { AWSFolderKey, ingestionStatus, labelId } = release
  const accessToken = await db.apiToken.findFirst({
    orderBy: { createdAt: 'desc' },
    where: { accessTokenExpired: false },
  })
  if (ingestionStatus === 'error') {
    console.log('🦆 There is a problem with this release, review it manually!')
    return {
      status: 200,
      body: 'There is a problem with this release, review it manually!',
    }
  }
  try {
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
          s3_path: AWSFolderKey,
        }),
      }
    )
    changeIngestionStatus({
      status: 'processing',
      id: releaseId,
    })
    return {
      status: response.status,
      body: await response.json(),
    }
  } catch (e) {
    console.log(e)
    changeIngestionStatus({
      status: 'error',
      id: releaseId,
    })
    throw new Error('Error uploading to AudioSalad')
  }
}
