import type { FindUserQuery, FindUserQueryVariables } from 'types/graphql'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

export const beforeQuery = (props) => {
  return { variables: { firstName: props.firstName, lastName: props.lastName } }
}
// UserCell.js
export const QUERY = gql`
  query FindUserQuery($firstName: String!, $lastName: String!) {
    user: userByName(firstName: $firstName, lastName: $lastName) {
      id
      firstName
      lastName
      email
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({
  error,
}: CellFailureProps<FindUserQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
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
