import {
  Badge,
  Box,
  Grid,
  GridItem,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
} from '@chakra-ui/react'
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
      ingestionStatus
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
  const isMobile = useBreakpointValue({ base: true, md: false })

  return isMobile ? (
    <MobileView releases={data} />
  ) : (
    <DesktopView releases={data} />
  )
}

export const DesktopView = ({ releases: data }) => {
  return (
    <>
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>Release title</Th>
              <Th>Label</Th>
              <Th>Submission date</Th>
              <Th>Ingestion Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((release) => (
              <Tr key={release.id}>
                <Td>{release.songTitle}</Td>
                <Td>{release.label.name}</Td>
                <Td>
                  {new Date(release.createdAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                  })}
                </Td>
                <Td>
                  {release.ingestionStatus === 'complete' ? (
                    <Badge colorScheme="green">Complete</Badge>
                  ) : (
                    <Badge colorScheme="blue">Pending</Badge>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  )
}

const MobileView = ({ releases }) => {
  return (
    <>
      {releases.map((release) => (
        <Box
          w={'75vw'}
          key={release.id}
          borderWidth="2px"
          borderRadius="lg"
          overflow="hidden"
          my={6}
          p={4}
        >
          <Grid templateColumns="1fr" gap={4} textAlign={'center'}>
            <GridItem>
              <Text fontWeight="bold" fontSize="xl">
                {release.songTitle}
              </Text>
              <Text>{release.label.name}</Text>
              <Text>
                {new Date(release.createdAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'numeric',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                })}
              </Text>
              <Badge
                colorScheme={
                  release.ingestionStatus === 'complete' ? 'green' : 'blue'
                }
                variant={'solid'}
              >
                {release.ingestionStatus === 'complete'
                  ? 'Complete'
                  : 'Pending'}
              </Badge>
            </GridItem>
          </Grid>
        </Box>
      ))}
    </>
  )
}
