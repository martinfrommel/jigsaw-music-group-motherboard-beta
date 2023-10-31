import {
  Box,
  Flex,
  Icon,
  Image,
  Link,
  useColorModeValue,
} from '@chakra-ui/react'
import { HiFolderPlus, HiHome, HiOutlineHome } from 'react-icons/hi2'

import { NavLink, routes, Link as RwLink } from '@redwoodjs/router'

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
          <RwLink className="logo-link" to={routes.home()}>
            <Image
              src={useColorModeValue(logoDark, logoLight)}
              maxHeight={12}
              maxWidth={'fit-content'}
              cursor={'pointer'}
            />
          </RwLink>
          {showNavLinks && (
            <Flex alignItems={'center'} justifyContent={'space-evenly'}>
              <Link
                as={NavLink}
                to={routes.home()}
                className="nav-link menu-item"
                activeClassName="nav-link-active"
                borderLeft="2px"
                pl={4}
                py={1}
                pr={1}
              >
                <Icon as={HiHome} mr={2} fontSize={14} />
                Home
              </Link>
              <Link
                as={NavLink}
                to={routes.submitRelease()}
                className="nav-link menu-item"
                activeClassName="nav-link-active"
                borderLeft="2px"
                pl={4}
                py={1}
                pr={1}
              >
                {' '}
                <Icon as={HiFolderPlus} mr={2} fontSize={14} />
                Submit a release
              </Link>
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
