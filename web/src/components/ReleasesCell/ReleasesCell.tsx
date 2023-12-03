import { Spinner, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import type { releasesPerUserQuery } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import EmptyCellAlert from '../DataFetching/EmptyCellAlert/EmptyCellAlert'
import FailedToFetchData from '../DataFetching/FailedToFetchData/FailedToFetchData'

interface ReleasesCellProps {
  userId: number
}
export const QUERY = gql`
  query releasesPerUserQuery($userId: Int!) {
    releasesPerUser(userId: $userId) {
      id
      songTitle
      createdAt
      label {
        name
      }
    }
  }
`
export const beforeQuery = (props: ReleasesCellProps) => {
  return { variables: props, fetchPolicy: 'cache-and-network' }
}
export const Loading = () => <Spinner />

export const Empty = () => (
  <EmptyCellAlert
    title={`There's nothing here yet...`}
    alert={`Looks like you haven't submitted any releases.`}
  />
)

export const Failure = ({ error }: CellFailureProps) => (
  <FailedToFetchData>{error.message}</FailedToFetchData>
)

export const Success = ({
  releasesPerUser: data,
}: CellSuccessProps<releasesPerUserQuery> & ReleasesCellProps) => {
  return (
    <>
      <Table>
        <Thead>
          <Tr>
            <Th>Release title</Th>
            <Th>Label</Th>
            <Th>Release date</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((release) => (
            <Tr key={release.id}>
              <Td>{release.songTitle}</Td>
              <Td>{release.label.name}</Td>
              <Td>
                {' '}
                {new Date(release.createdAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'numeric',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                })}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </>
  )
}
