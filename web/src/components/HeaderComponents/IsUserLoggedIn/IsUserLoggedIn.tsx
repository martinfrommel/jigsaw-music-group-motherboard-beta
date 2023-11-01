import { Button, Spinner, useColorModeValue } from '@chakra-ui/react'

import { NavLink, routes } from '@redwoodjs/router'

import { useAuth } from 'src/auth'
import FailedToFetchData from 'src/components/DataFetching/FailedToFetchData/FailedToFetchData'

import UserBubble from '../UserBubble/UserBubble'
const IsUserLoggedIn = () => {
  const { isAuthenticated, loading, error } = useAuth()
  const colorModeValue = useColorModeValue('blackAlpha', 'gray')

  return (
    <>
      {loading ? (
        <Spinner />
      ) : error ? (
        <FailedToFetchData>{error.message}</FailedToFetchData>
      ) : isAuthenticated ? (
        <UserBubble />
      ) : (
        <Button
          as={NavLink}
          to={routes.login()}
          className="nav-link"
          activeClassName="nav-link-active"
          colorScheme={colorModeValue}
        >
          Log In
        </Button>
      )}
    </>
  )
}

export default IsUserLoggedIn
