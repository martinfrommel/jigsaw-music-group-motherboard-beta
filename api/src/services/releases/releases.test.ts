import type { Release } from '@prisma/client'

import {
  releases,
  release,
  createRelease,
  updateRelease,
  deleteRelease,
} from './releases'
import type { StandardScenario } from './releases.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('releases', () => {
  scenario('returns all releases', async (scenario: StandardScenario) => {
    const result = await releases()

    expect(result.length).toEqual(Object.keys(scenario.release).length)
  })

  scenario('returns a single release', async (scenario: StandardScenario) => {
    const result = await release({ id: scenario.release.one.id })

    expect(result).toEqual(scenario.release.one)
  })

  scenario('creates a release', async (scenario: StandardScenario) => {
    const result = await createRelease({
      input: {
        userId: scenario.release.two.userId,
        songMasterReference: 'String',
        songTitle: 'String',
        artist: 'String',
        releaseDate: '2023-10-26T15:25:13.095Z',
        previouslyReleased: true,
        language: 'String',
        primaryGenre: 'String',
        explicitLyrics: true,
        iscUpcCode: 'String',
        length: 6711689,
      },
    })

    expect(result.userId).toEqual(scenario.release.two.userId)
    expect(result.songMasterReference).toEqual('String')
    expect(result.songTitle).toEqual('String')
    expect(result.artist).toEqual('String')
    expect(result.releaseDate).toEqual(new Date('2023-10-26T15:25:13.095Z'))
    expect(result.previouslyReleased).toEqual(true)
    expect(result.language).toEqual('String')
    expect(result.primaryGenre).toEqual('String')
    expect(result.explicitLyrics).toEqual(true)
    expect(result.iscUpcCode).toEqual('String')
    expect(result.length).toEqual(6711689)
  })

  scenario('updates a release', async (scenario: StandardScenario) => {
    const original = (await release({ id: scenario.release.one.id })) as Release
    const result = await updateRelease({
      id: original.id,
      input: { songMasterReference: 'String2' },
    })

    expect(result.songMasterReference).toEqual('String2')
  })

  scenario('deletes a release', async (scenario: StandardScenario) => {
    const original = (await deleteRelease({
      id: scenario.release.one.id,
    })) as Release
    const result = await release({ id: original.id })

    expect(result).toEqual(null)
  })
})
