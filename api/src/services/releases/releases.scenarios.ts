import type { Prisma, Release } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.ReleaseCreateArgs>({
  release: {
    one: {
      data: {
        songMasterReference: 'String',
        songArtworkReference: 'String',
        AWSFolderKey: 'String',
        updatedAt: '2023-12-02T18:52:03.431Z',
        songTitle: 'String',
        artist: 'String',
        releaseDate: '2023-12-02T18:52:03.431Z',
        previouslyReleased: true,
        language: 'String',
        primaryGenre: 'String',
        explicitLyrics: true,
        iscUpcCode: 'String',
        length: 257517,
        user: {
          create: {
            firstName: 'String',
            lastName: 'String',
            email: 'String4394760',
            hashedPassword: 'String',
            salt: 'String',
          },
        },
      },
    },
    two: {
      data: {
        songMasterReference: 'String',
        songArtworkReference: 'String',
        AWSFolderKey: 'String',
        updatedAt: '2023-12-02T18:52:03.431Z',
        songTitle: 'String',
        artist: 'String',
        releaseDate: '2023-12-02T18:52:03.431Z',
        previouslyReleased: true,
        language: 'String',
        primaryGenre: 'String',
        explicitLyrics: true,
        iscUpcCode: 'String',
        length: 8887619,
        user: {
          create: {
            firstName: 'String',
            lastName: 'String',
            email: 'String7790243',
            hashedPassword: 'String',
            salt: 'String',
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Release, 'release'>
