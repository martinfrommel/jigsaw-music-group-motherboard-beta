import type { Prisma, Release } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.ReleaseCreateArgs>({
  release: {
    one: {
      data: {
        songMasterReference: 'String',
        songTitle: 'String',
        artist: 'String',
        releaseDate: '2023-10-25T14:54:49.940Z',
        previouslyReleased: true,
        language: 'String',
        primaryGenre: 'String',
        explicitLyrics: true,
        isicUpcCode: 'String',
        length: 5064632,
        user: {
          create: {
            firstName: 'String',
            lastName: 'String',
            email: 'String8016104',
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
        releaseDate: '2023-10-25T14:54:49.940Z',
        previouslyReleased: true,
        language: 'String',
        primaryGenre: 'String',
        explicitLyrics: true,
        isicUpcCode: 'String',
        length: 3985290,
        user: {
          create: {
            firstName: 'String',
            lastName: 'String',
            email: 'String4706095',
            hashedPassword: 'String',
            salt: 'String',
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Release, 'release'>
