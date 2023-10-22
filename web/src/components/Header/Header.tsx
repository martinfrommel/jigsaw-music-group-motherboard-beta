import {
  Box,
  Flex,
  Avatar,
  Text,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
} from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { NavLink, routes } from '@redwoodjs/router'
import DarkModeToggle from '../DarkModeToggle/DarkModeToggle'

interface Props {
  children: React.ReactNode
  href: string
}

const Header = () => {
  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <Box>Jigsaw Promotion</Box>
          <NavLink
            to={routes.home()}
            className=""
            activeClassName="nav-link-active"
          >
            Home
          </NavLink>
          <DarkModeToggle />
          {}
        </Flex>
      </Box>
    </>
  )
}

export default Header
