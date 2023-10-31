import { Box, Flex, Image, useColorModeValue } from '@chakra-ui/react'

import { NavLink, routes, Link } from '@redwoodjs/router'

import logoDark from '../../../assets/preliminary_logo.webp'
import logoLight from '../../../assets/preliminary_logo_white.png'
import DarkModeToggle from '../../DarkModeToggle/DarkModeToggle'
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
      <Box
        bg={useColorModeValue('blackAlpha.100', 'blackAlpha.700')}
        px={8}
        py={4}
        rounded={4}
        
      >
        <Flex h={14} alignItems={'center'} justifyContent={'space-between'}>
          <Link className="logo-link" to={routes.home()}>
            <Image
              src={useColorModeValue(logoDark, logoLight)}
              maxHeight={12}
              maxWidth={'fit-content'}
              cursor={'pointer'}
            />
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
