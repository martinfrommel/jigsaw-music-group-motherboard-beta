import type {
  FindChangePasswordQuery,
  FindChangePasswordQueryVariables,
} from 'types/graphql'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

export const QUERY = gql`
  query FindChangePasswordQuery($id: Int!) {
    changePassword: changePassword(id: $id) {
      id
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({
  error,
}: CellFailureProps<FindChangePasswordQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  changePassword,
}: CellSuccessProps<
  FindChangePasswordQuery,
  FindChangePasswordQueryVariables
>) => {
  return <div>{JSON.stringify(changePassword)}</div>
}
