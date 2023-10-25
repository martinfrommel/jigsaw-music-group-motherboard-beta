import type { FindReleaseById } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import Release from 'src/components/Release/Release'

export const QUERY = gql`
  query FindReleaseById($id: Int!) {
    release: release(id: $id) {
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

export const Empty = () => <div>Release not found</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ release }: CellSuccessProps<FindReleaseById>) => {
  return <Release release={release} />
}
