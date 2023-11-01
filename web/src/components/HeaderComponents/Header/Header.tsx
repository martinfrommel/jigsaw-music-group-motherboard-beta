import { useEffect, useState } from 'react'

import {
  Box,
  Flex,
  Icon,
  Image,
  Link,
  useColorModeValue,
  useBreakpointValue,
} from '@chakra-ui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { HiFolderAdd, HiHome } from 'react-icons/hi'

import { NavLink, routes, Link as RwLink } from '@redwoodjs/router'

import { useAuth } from 'src/auth'

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
  const isMobile = useBreakpointValue({ base: true, md: false })
  const { isAuthenticated } = useAuth()

  const [animateHeader, setAnimateHeader] = useState(false)

  useEffect(() => {
    // Check if the header animation has already played
    if (!sessionStorage.getItem('headerAnimated')) {
      setAnimateHeader(true)
      sessionStorage.setItem('headerAnimated', 'true')
    }
  }, [])

  const normalMenu = (
    <Flex
      flexDirection={'row'}
      alignItems={'center'}
      justifyContent={'center'}
      flex={1}
      gap={3}
    >
      <Flex alignItems={'center'} justifyContent={'center'} flex={1}>
        {showNavLinks && isAuthenticated && (
          <>
            <Link
              as={NavLink}
              to={routes.home()}
              className="nav-link menu-item"
              activeClassName="nav-link-active"
            >
              <Flex
                flex={1}
                alignItems={'center'}
                justifyContent={'center'}
                borderLeft={'2px'}
                borderRight={'2px'}
                px={4}
              >
                <Icon as={HiHome} mr={2} fontSize={16} />
                Home
              </Flex>
            </Link>
            <Link
              as={NavLink}
              to={routes.submitRelease()}
              className="nav-link menu-item"
              activeClassName="nav-link-active"
            >
              <Flex
                alignItems={'center'}
                borderLeft={'2px'}
                borderRight={'2px'}
                px={4}
              >
                <Icon as={HiFolderAdd} mr={2} fontSize={16} />
                Submit a release
              </Flex>
            </Link>
          </>
        )}
      </Flex>
      <Flex
        flexDirection="row"
        flex={0}
        alignItems="center"
        justifySelf={'flex-end'}
      >
        {showDarkModeToggle && <DarkModeToggle className="menu-item" />}
        {showUserStatus && <IsUserLoggedIn />}
      </Flex>
    </Flex>
  )

  const mobileMenu = (
    <Flex
      flexDirection="row"
      flex={0}
      alignItems="center"
      justifySelf={'flex-end'}
    >
      {showDarkModeToggle && <DarkModeToggle className="menu-item" />}
      {showUserStatus && <IsUserLoggedIn />}
    </Flex>
  )

  return (
    <>
      <AnimatePresence>
        <Box
          as={motion.div}
          bg={useColorModeValue('blackAlpha.100', 'blackAlpha.700')}
          px={8}
          py={4}
          rounded={4}
          initial={animateHeader ? { opacity: 0 } : { opacity: 1 }}
          animate={animateHeader && { opacity: 1 }}
        >
          <Flex
            maxH={14}
            alignItems={'center'}
            justifyContent={'space-between'}
          >
            <Link
              as={RwLink}
              flex={0}
              className="logo-link"
              to={routes.home()}
              maxH={12}
              maxW={'auto'}
            >
              <Image
                src={useColorModeValue(logoDark, logoLight)}
                maxHeight={12}
                maxWidth={'fit-content'}
                cursor={'pointer'}
              />
            </Link>
            {!isMobile ? normalMenu : mobileMenu}
          </Flex>{' '}
        </Box>
      </AnimatePresence>
    </>
  )
}
export default Header
