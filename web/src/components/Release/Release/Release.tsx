import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { checkboxInputTag, timeTag } from 'src/lib/formatters'

import type {
  DeleteReleaseMutationVariables,
  FindReleaseById,
} from 'types/graphql'

const DELETE_RELEASE_MUTATION = gql`
  mutation DeleteReleaseMutation($id: Int!) {
    deleteRelease(id: $id) {
      id
    }
  }
`

interface Props {
  release: NonNullable<FindReleaseById['release']>
}

const Release = ({ release }: Props) => {
  const [deleteRelease] = useMutation(DELETE_RELEASE_MUTATION, {
    onCompleted: () => {
      toast.success('Release deleted')
      navigate(routes.releases())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteReleaseMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete release ' + id + '?')) {
      deleteRelease({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Release {release.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{release.id}</td>
            </tr>
            <tr>
              <th>User id</th>
              <td>{release.userId}</td>
            </tr>
            <tr>
              <th>Song master reference</th>
              <td>{release.songMasterReference}</td>
            </tr>
            <tr>
              <th>Song title</th>
              <td>{release.songTitle}</td>
            </tr>
            <tr>
              <th>Product title</th>
              <td>{release.productTitle}</td>
            </tr>
            <tr>
              <th>Artist</th>
              <td>{release.artist}</td>
            </tr>
            <tr>
              <th>Featured artist</th>
              <td>{release.featuredArtist}</td>
            </tr>
            <tr>
              <th>Release date</th>
              <td>{timeTag(release.releaseDate)}</td>
            </tr>
            <tr>
              <th>Previously released</th>
              <td>{checkboxInputTag(release.previouslyReleased)}</td>
            </tr>
            <tr>
              <th>Language</th>
              <td>{release.language}</td>
            </tr>
            <tr>
              <th>Primary genre</th>
              <td>{release.primaryGenre}</td>
            </tr>
            <tr>
              <th>Secondary genre</th>
              <td>{release.secondaryGenre}</td>
            </tr>
            <tr>
              <th>Explicit lyrics</th>
              <td>{checkboxInputTag(release.explicitLyrics)}</td>
            </tr>
            <tr>
              <th>Isic upc code</th>
              <td>{release.isicUpcCode}</td>
            </tr>
            <tr>
              <th>P line</th>
              <td>{release.pLine}</td>
            </tr>
            <tr>
              <th>C line</th>
              <td>{release.cLine}</td>
            </tr>
            <tr>
              <th>Length</th>
              <td>{release.length}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editRelease({ id: release.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(release.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default Release
