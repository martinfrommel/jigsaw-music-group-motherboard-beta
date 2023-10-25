import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import ReleaseForm from 'src/components/Release/ReleaseForm'

import type { CreateReleaseInput } from 'types/graphql'

const CREATE_RELEASE_MUTATION = gql`
  mutation CreateReleaseMutation($input: CreateReleaseInput!) {
    createRelease(input: $input) {
      id
    }
  }
`

const NewRelease = () => {
  const [createRelease, { loading, error }] = useMutation(
    CREATE_RELEASE_MUTATION,
    {
      onCompleted: () => {
        toast.success('Release created')
        navigate(routes.releases())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreateReleaseInput) => {
    createRelease({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New Release</h2>
      </header>
      <div className="rw-segment-main">
        <ReleaseForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewRelease
