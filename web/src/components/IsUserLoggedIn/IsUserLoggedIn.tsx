import { useAuth } from 'src/auth'
import UserBubble from '../HeaderComponents/UserBubble/UserBubble'
import { Spinner } from '@chakra-ui/react'
import { NavLink, routes } from '@redwoodjs/router'
const IsUserLoggedIn = () => {
  const { isAuthenticated, loading } = useAuth()

  return (
    <>
      {loading ? (
        <Spinner />
      ) : isAuthenticated ? (
        <UserBubble />
      ) : (
        <NavLink
          to={routes.login()}
          className="nav-link"
          activeClassName="nav-link-active"
        >
          Log In
        </NavLink>
      )}
    </>
  )
}

export default IsUserLoggedIn
