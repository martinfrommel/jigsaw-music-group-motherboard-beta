import {
  Box,
  Flex,
  Icon,
  Image,
  Link,
  useColorModeValue,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  useBreakpointValue,
  LinkOverlay,
  IconButton,
} from '@chakra-ui/react'
import { HiFolderAdd, HiHome, HiOutlineMenu, HiX } from 'react-icons/hi'

import { NavLink, routes, Link as RwLink } from '@redwoodjs/router'

import { useAuth } from 'src/auth'

import bgPattern from '../../../assets/bgPattern.svg'
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
  const { isOpen, onOpen, onClose } = useDisclosure()
  const isMobile = useBreakpointValue({ base: true, md: false })
  const { isAuthenticated } = useAuth()
  const linksContent = (
    <Flex
      flexDirection={'row'}
      alignItems={isMobile ? 'flex-start' : 'center'}
      justifyContent={isMobile ? 'flex-start' : 'center'}
      flex={1}
      gap={8}
    >
      {showNavLinks && isAuthenticated && (
        <>
          <Link
            as={NavLink}
            to={routes.home()}
            className="nav-link menu-item"
            activeClassName="nav-link-active"
            onClick={onClose}
          >
            <Flex
              flex={1}
              alignItems={'center'}
              borderLeft={!isMobile && '2px'}
              borderTop={isMobile && '2px'}
              pl={!isMobile ? 4 : 0}
              py={isMobile ? 4 : 1}
              pr={!isMobile ? 1 : 0}
            >
              <Icon as={HiHome} mr={2} fontSize={14} />
              Home
            </Flex>
          </Link>
          <Link
            as={NavLink}
            to={routes.submitRelease()}
            className="nav-link menu-item"
            activeClassName="nav-link-active"
            onClick={onClose}
          >
            <Flex
              alignItems={'center'}
              borderLeft={!isMobile && '2px'}
              borderTop={isMobile && '2px'}
              pl={!isMobile ? 4 : 0}
              py={isMobile ? 4 : 1}
              pr={!isMobile ? 1 : 0}
            >
              <Icon as={HiFolderAdd} mr={2} fontSize={14} />
              Submit a release
            </Flex>
          </Link>
        </>
      )}
    </Flex>
  )

  const actionsContent = (
    <Flex flexDirection="row" flex={0} alignItems="center">
      {showDarkModeToggle && <DarkModeToggle className="menu-item" />}
      {showUserStatus && <IsUserLoggedIn />}
    </Flex>
  )

  const drawerContent = (
    <Flex
      flexDirection={isMobile ? 'column' : 'row'}
      justifyContent="space-between"
      flex={1}
      flexShrink={0}
      alignItems="center"
    >
      {linksContent}
    </Flex>
  )
  return (
    <Box
      bg={useColorModeValue('blackAlpha.100', 'blackAlpha.700')}
      px={8}
      py={4}
      rounded={4}
    >
      <Flex maxH={14} alignItems={'center'} justifyContent={'space-between'}>
        <LinkOverlay
          as={RwLink}
          flex={0}
          className="logo-link"
          to={routes.home()}
          w={'fit-content'}
        >
          <Image
            src={useColorModeValue(logoDark, logoLight)}
            maxHeight={12}
            maxWidth={'fit-content'}
            cursor={'pointer'}
          />
        </LinkOverlay>
        {isMobile ? (
          <>
            <IconButton
              variant={'link'}
              onClick={onOpen}
              aria-label="Open menu"
              as={isOpen ? HiX : HiOutlineMenu}
            />
            <Drawer isOpen={isOpen} placement="top" onClose={onClose}>
              <DrawerOverlay />
              <DrawerContent
                py={20}
                bgImage={bgPattern}
                bgColor={'purple.800'}
                rounded={4}
              >
                <DrawerCloseButton size={'lg'} />
                {drawerContent}
              </DrawerContent>
            </Drawer>
            {actionsContent}
          </>
        ) : (
          <Flex alignItems={'center'} flex={1} justifyContent={'center'}>
            {drawerContent}
            {actionsContent}
          </Flex>
        )}
      </Flex>
    </Box>
  )
}

export default Header
