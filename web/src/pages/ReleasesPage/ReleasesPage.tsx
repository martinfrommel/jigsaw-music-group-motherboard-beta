import { Spinner } from '@chakra-ui/react'

import { navigate, routes } from '@redwoodjs/router'
import { MetaTags, useQuery } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/dist/toast'

import { useAuth } from 'src/auth'
import FailedToFetchData from 'src/components/DataFetching/FailedToFetchData/FailedToFetchData'

const GET_USER = gql`
  query GetUser($id: Int!) {
    user(id: $id) {
      id
    }
  }
`

const ReleasesPage = ({ id }) => {
  const { currentUser } = useAuth()
  const { error, loading } = useQuery(GET_USER, {
    variables: { id },
    fetchPolicy: 'network-only',
  })

  if (loading) {
    return <Spinner />
  }

  if (error) {
    toast.loading('Redirecting you back!')
    setTimeout(() => {
      navigate(routes.releases({ id: currentUser.id }))
      toast.dismiss()
    }, 2500)
    return <FailedToFetchData>{error?.message}</FailedToFetchData>
  }

  return (
    <>
      <MetaTags title="Releases" description="Releases page" />

      <h1>ReleasesPage</h1>
      <p>
        Find me in <code>./web/src/pages/ReleasesPage/ReleasesPage.tsx</code>
      </p>
    </>
  )
}

export default ReleasesPage
