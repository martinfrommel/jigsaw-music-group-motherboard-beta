import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Release/ReleasesCell'
import { checkboxInputTag, timeTag, truncate } from 'src/lib/formatters'

import type {
  DeleteReleaseMutationVariables,
  FindReleases,
} from 'types/graphql'

const DELETE_RELEASE_MUTATION = gql`
  mutation DeleteReleaseMutation($id: Int!) {
    deleteRelease(id: $id) {
      id
    }
  }
`

const ReleasesList = ({ releases }: FindReleases) => {
  const [deleteRelease] = useMutation(DELETE_RELEASE_MUTATION, {
    onCompleted: () => {
      toast.success('Release deleted')
    },
    onError: (error) => {
      toast.error(error.message)
    },
    // This refetches the query on the list page. Read more about other ways to
    // update the cache over here:
    // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  })

  const onDeleteClick = (id: DeleteReleaseMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete release ' + id + '?')) {
      deleteRelease({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>User id</th>
            <th>Song master reference</th>
            <th>Song title</th>
            <th>Product title</th>
            <th>Artist</th>
            <th>Featured artist</th>
            <th>Release date</th>
            <th>Previously released</th>
            <th>Language</th>
            <th>Primary genre</th>
            <th>Secondary genre</th>
            <th>Explicit lyrics</th>
            <th>Isic upc code</th>
            <th>P line</th>
            <th>C line</th>
            <th>Length</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {releases.map((release) => (
            <tr key={release.id}>
              <td>{truncate(release.id)}</td>
              <td>{truncate(release.userId)}</td>
              <td>{truncate(release.songMasterReference)}</td>
              <td>{truncate(release.songTitle)}</td>
              <td>{truncate(release.productTitle)}</td>
              <td>{truncate(release.artist)}</td>
              <td>{truncate(release.featuredArtist)}</td>
              <td>{timeTag(release.releaseDate)}</td>
              <td>{checkboxInputTag(release.previouslyReleased)}</td>
              <td>{truncate(release.language)}</td>
              <td>{truncate(release.primaryGenre)}</td>
              <td>{truncate(release.secondaryGenre)}</td>
              <td>{checkboxInputTag(release.explicitLyrics)}</td>
              <td>{truncate(release.isicUpcCode)}</td>
              <td>{truncate(release.pLine)}</td>
              <td>{truncate(release.cLine)}</td>
              <td>{truncate(release.length)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.release({ id: release.id })}
                    title={'Show release ' + release.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editRelease({ id: release.id })}
                    title={'Edit release ' + release.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete release ' + release.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(release.id)}
                  >
                    Delete
                  </button>
                </nav>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ReleasesList
