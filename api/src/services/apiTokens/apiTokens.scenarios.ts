import type { Prisma, ApiToken } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.ApiTokenCreateArgs>({
  apiToken: {
    one: {
      data: {
        accessToken: 'String',
        refreshToken: 'String',
        updatedAt: '2023-11-26T16:52:50.571Z',
      },
    },
    two: {
      data: {
        accessToken: 'String',
        refreshToken: 'String',
        updatedAt: '2023-11-26T16:52:50.571Z',
      },
    },
  },
})

export type StandardScenario = ScenarioData<ApiToken, 'apiToken'>
