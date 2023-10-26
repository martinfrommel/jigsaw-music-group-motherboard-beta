import type { FindUserQuery, FindUserQueryVariables } from 'types/graphql'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import FailedToFetchData from 'src/components/DataFetching/FailedToFetchData/FailedToFetchData'
import EmptyCellAlert from 'src/components/DataFetching/EmptyCellAlert/EmptyCellAlert'
import { Spinner } from '@chakra-ui/react'

export const beforeQuery = (props) => {
  return { variables: { id: parseInt(props.id, 10) } }
}

// UserCell.js
export const QUERY = gql`
  query FindUserQuery($id: Int!) {
    user: user(id: $id) {
      id
      firstName
      lastName
      email
    }
  }
`

export const Loading = () => <Spinner />

export const Empty = () => <EmptyCellAlert />

export const Failure = ({
  error,
}: CellFailureProps<FindUserQueryVariables>) => (
  <FailedToFetchData>{error?.message}</FailedToFetchData>
)

export const Success = ({
  user,
}: CellSuccessProps<FindUserQuery, FindUserQueryVariables>) => {
  return (
    <div>
      <h1>
        {user.firstName} {user.lastName}
      </h1>
      <p>Email: {user.email}</p>
      {/* Render other fields... */}
    </div>
  )
}
