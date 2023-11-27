import type { Prisma, Release } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.ReleaseCreateArgs>({
  release: {
    one: {
      data: {
        songMasterReference: 'String',
        songTitle: 'String',
        artist: 'String',
        releaseDate: '2023-10-26T15:25:13.116Z',
        previouslyReleased: true,
        language: 'String',
        primaryGenre: 'String',
        explicitLyrics: true,
        iscUpcCode: 'String',
        length: 7047204,
        user: {
          create: {
            firstName: 'String',
            lastName: 'String',
            email: 'String6379853',
            hashedPassword: 'String',
            salt: 'String',
          },
        },
      },
    },
    two: {
      data: {
        songMasterReference: 'String',
        songTitle: 'String',
        artist: 'String',
        releaseDate: '2023-10-26T15:25:13.116Z',
        previouslyReleased: true,
        language: 'String',
        primaryGenre: 'String',
        explicitLyrics: true,
        iscUpcCode: 'String',
        length: 4244571,
        user: {
          create: {
            firstName: 'String',
            lastName: 'String',
            email: 'String3928602',
            hashedPassword: 'String',
            salt: 'String',
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Release, 'release'>
