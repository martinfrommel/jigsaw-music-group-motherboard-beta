import type { ApiToken } from '@prisma/client'

import {
  apiTokens,
  apiToken,
  createApiToken,
  updateApiToken,
  deleteApiToken,
} from './apiTokens'
import type { StandardScenario } from './apiTokens.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('apiTokens', () => {
  scenario('returns all apiTokens', async (scenario: StandardScenario) => {
    const result = await apiTokens()

    expect(result.length).toEqual(Object.keys(scenario.apiToken).length)
  })

  scenario('returns a single apiToken', async (scenario: StandardScenario) => {
    const result = await apiToken({ id: scenario.apiToken.one.id })

    expect(result).toEqual(scenario.apiToken.one)
  })

  scenario('creates a apiToken', async () => {
    const result = await createApiToken({
      input: {
        accessToken: 'String',
        refreshToken: 'String',
        updatedAt: '2023-11-26T16:52:50.557Z',
      },
    })

    expect(result.accessToken).toEqual('String')
    expect(result.refreshToken).toEqual('String')
    expect(result.updatedAt).toEqual(new Date('2023-11-26T16:52:50.557Z'))
  })

  scenario('updates a apiToken', async (scenario: StandardScenario) => {
    const original = (await apiToken({
      id: scenario.apiToken.one.id,
    })) as ApiToken
    const result = await updateApiToken({
      id: original.id,
      input: { accessToken: 'String2' },
    })

    expect(result.accessToken).toEqual('String2')
  })

  scenario('deletes a apiToken', async (scenario: StandardScenario) => {
    const original = (await deleteApiToken({
      id: scenario.apiToken.one.id,
    })) as ApiToken
    const result = await apiToken({ id: original.id })

    expect(result).toEqual(null)
  })
})
