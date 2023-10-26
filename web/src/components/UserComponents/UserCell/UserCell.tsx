import type { FindUserQuery, FindUserQueryVariables } from 'types/graphql'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import FailedToFetchData from 'src/components/DataFetching/FailedToFetchData/FailedToFetchData'
import EmptyCellAlert from 'src/components/DataFetching/EmptyCellAlert/EmptyCellAlert'
import { Spinner } from '@chakra-ui/react'
import UserCard from 'src/components/UserComponents/UserCard/UserCard'

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
      picture
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
    <UserCard
      userEmail={user.email}
      userName={`${user.firstName} ${user.lastName}`}
      userPicture={user.picture}
    />
  )
}
