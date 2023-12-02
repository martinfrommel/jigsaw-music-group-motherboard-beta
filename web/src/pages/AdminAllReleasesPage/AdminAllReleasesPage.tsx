import {
  Button,
  Heading,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'

import { Link as RwLink, routes } from '@redwoodjs/router'
import { MetaTags, useQuery } from '@redwoodjs/web'

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
    }
  }
`

const AdminAllReleasesPage = () => {
  const { data, error, loading } = useQuery(RELEASES_QUERY)

  if (loading) {
    return <Spinner />
  }

  if (error) {
    return <FailedToFetchData>{error.message}</FailedToFetchData>
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
              </Tr>
            </Thead>
            <Tbody>
              {data.releases.map((release) => (
                <Tr key={release.id}>
                  <Td>{release.artist}</Td>
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
