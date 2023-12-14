import {
  Badge,
  Button,
  Heading,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import { Release } from 'types/graphql'

import { Link as RwLink, routes } from '@redwoodjs/router'
import { MetaTags, useMutation, useQuery } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/dist/toast'

import { useAuth } from 'src/auth'
import FailedToFetchData from 'src/components/DataFetching/FailedToFetchData/FailedToFetchData'
import JigsawCard from 'src/components/JigsawCard/JigsawCard'

const RELEASES_QUERY = gql`
  query ReleasesQuery {
    releases {
      id
      songTitle
      artist
      createdAt
      label {
        id
        name
      }
      user {
        firstName
        lastName
        id
      }
      ingestionStatus
    }
  }
`

const RUN_INGESTION_MUTATION = gql`
  mutation RunIngestion($releaseId: Int!, $userId: Int!) {
    runIngestion(id: $releaseId, userId: $userId) {
      ingestionStatus
    }
  }
`

const AdminAllReleasesPage = () => {
  const {
    data: releaseData,
    error: releaseDataError,
    loading: releaseDataLoading,
    refetch: refetchReleases,
  } = useQuery(RELEASES_QUERY, { fetchPolicy: 'cache-first' })

  // const [releases, setReleases] = useState(releaseData.releases)

  const [runIngestion, { loading: runIngestionLoading }] = useMutation(
    RUN_INGESTION_MUTATION,
    {
      onCompleted: (data) => {
        // Handle the data
        console.log(data)
        toast.success('Ingestion started')
        refetchReleases()
      },
      onError: (error) => {
        // Handle the error
        toast.error(error.message)
        console.error(error)
      },
    }
  )

  const { currentUser } = useAuth()

  if (releaseDataLoading) {
    return <Spinner />
  }

  if (releaseDataError) {
    return <FailedToFetchData>{releaseDataError.message}</FailedToFetchData>
  }

  return (
    <>
      <MetaTags
        title="All Releases"
        description="See all releases from all users"
        robots={['noindex', 'nofollow']}
      />
      <JigsawCard overflowX={'scroll'}>
        <JigsawCard.Header>
          <Heading>All releases</Heading>
        </JigsawCard.Header>
        <JigsawCard.Body>
          <Table>
            <Thead>
              <Tr>
                <Th>Artist</Th>
                <Th>Song title</Th>
                <Th>Label</Th>
                <Th>Submitted by</Th>
                <Th>Submitted at</Th>
                <Th>Ingestion status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {releaseData.releases.map((release: Release) => (
                <Tr key={release.id}>
                  <Td>
                    {release.artist.map((artist: string, index: number) => (
                      <Text key={index} fontSize={'sm'}>
                        {artist}
                      </Text>
                    ))}
                  </Td>
                  <Td>{release.songTitle}</Td>
                  <Td>{release.label.name}</Td>
                  <Td>
                    <Button
                      as={RwLink}
                      to={routes.admin()}
                      colorScheme="whiteAlpha"
                      color={'white'}
                      size={'sm'}
                    >
                      {release.user.firstName} {release.user.lastName}
                    </Button>
                  </Td>
                  <Td>
                    {new Date(release.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                    })}
                  </Td>
                  <Td textAlign={'center'}>
                    {release.ingestionStatus === 'pending' ? (
                      <Badge colorScheme="blue">Pending</Badge>
                    ) : release.ingestionStatus === 'processing' ? (
                      <Badge colorScheme="yellow">Processing</Badge>
                    ) : release.ingestionStatus === 'error' ? (
                      <Badge colorScheme="red">Failed</Badge>
                    ) : release.ingestionStatus === 'complete' ? (
                      <Badge colorScheme="green">Success</Badge>
                    ) : (
                      <Badge colorScheme="gray">Unknown</Badge>
                    )}
                    <Button
                      colorScheme={'green'}
                      ml={4}
                      size={'sm'}
                      isLoading={runIngestionLoading}
                      onClick={(event) => {
                        event.preventDefault()
                        runIngestion({
                          variables: {
                            releaseId: release.id,
                            userId: currentUser.id,
                          },
                        })
                      }}
                      isDisabled={
                        release.ingestionStatus === 'complete' ||
                        release.ingestionStatus === 'processing' ||
                        release.ingestionStatus === 'error'
                      }
                    >
                      {`🚀`}
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </JigsawCard.Body>
      </JigsawCard>
    </>
  )
}

export default AdminAllReleasesPage
