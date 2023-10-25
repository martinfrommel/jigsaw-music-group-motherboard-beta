import type { FindReleases } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import Releases from 'src/components/Release/Releases'

export const QUERY = gql`
  query FindReleases {
    releases {
      id
      userId
      songMasterReference
      songTitle
      productTitle
      artist
      featuredArtist
      releaseDate
      previouslyReleased
      language
      primaryGenre
      secondaryGenre
      explicitLyrics
      isicUpcCode
      pLine
      cLine
      length
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      {'No releases yet. '}
      <Link to={routes.newRelease()} className="rw-link">
        {'Create one?'}
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ releases }: CellSuccessProps<FindReleases>) => {
  return <Releases releases={releases} />
}
