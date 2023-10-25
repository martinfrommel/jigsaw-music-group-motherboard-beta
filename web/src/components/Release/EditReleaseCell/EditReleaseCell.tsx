import type { EditReleaseById, UpdateReleaseInput } from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import ReleaseForm from 'src/components/Release/ReleaseForm'

export const QUERY = gql`
  query EditReleaseById($id: Int!) {
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
const UPDATE_RELEASE_MUTATION = gql`
  mutation UpdateReleaseMutation($id: Int!, $input: UpdateReleaseInput!) {
    updateRelease(id: $id, input: $input) {
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

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ release }: CellSuccessProps<EditReleaseById>) => {
  const [updateRelease, { loading, error }] = useMutation(
    UPDATE_RELEASE_MUTATION,
    {
      onCompleted: () => {
        toast.success('Release updated')
        navigate(routes.releases())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (
    input: UpdateReleaseInput,
    id: EditReleaseById['release']['id']
  ) => {
    updateRelease({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit Release {release?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <ReleaseForm
          release={release}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
