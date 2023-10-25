import { Box, Center, Flex, Stack, useColorModeValue } from '@chakra-ui/react'
import { NavLink, routes, Link } from '@redwoodjs/router'
import DarkModeToggle from '../DarkModeToggle/DarkModeToggle'
import IsUserLoggedIn from '../IsUserLoggedIn/IsUserLoggedIn'
interface Props {
  showNavLinks?: boolean
  showDarkModeToggle?: boolean
  showUserStatus?: boolean
}

const Header = ({
  showNavLinks = true,
  showDarkModeToggle = true,
  showUserStatus = true,
}: Props) => {
  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <Link className="logo-link" to={routes.home()}>
            <Box>Jigsaw Promotion</Box>
          </Link>
          {showNavLinks && (
            <Flex alignItems={'center'} justifyContent={'space-evenly'}>
              <NavLink
                to={routes.home()}
                className="nav-link menu-item"
                activeClassName="nav-link-active"
              >
                Home
              </NavLink>
              <NavLink
                to={routes.submitRelease()}
                className="nav-link menu-item"
                activeClassName="nav-link-active"
              >
                Submit a release
              </NavLink>
            </Flex>
          )}
          <Flex alignItems={'center'} justifyContent={'space-evenly'}>
            {showDarkModeToggle && <DarkModeToggle className="menu-item" />}
            {showUserStatus && <IsUserLoggedIn />}
          </Flex>
        </Flex>
      </Box>
    </>
  )
}

export default Header
