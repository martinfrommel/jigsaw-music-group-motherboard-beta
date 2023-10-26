import {
  Avatar,
  Center,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Button,
  Text,
  VStack,
} from '@chakra-ui/react'
import { NavLink, routes } from '@redwoodjs/router'
import { useAuth } from 'src/auth'
import { capitalizeFirstLetter } from 'src/lib/capitalizeFirstLetter'

const UserBubble = () => {
  const { currentUser, logOut } = useAuth()
  const userRole = currentUser.roles
  return (
    <Menu>
      <MenuButton
        as={Button}
        rounded={'full'}
        variant={'link'}
        cursor={'pointer'}
        minW={0}
      >
        <Avatar
          size={'sm'}
          src={'https://avatars.dicebear.com/api/male/username.svg'}
        />
      </MenuButton>
      <MenuList alignItems={'center'}>
        <br />
        <Center>
          <Avatar
            size={'2xl'}
            src={'https://avatars.dicebear.com/api/male/username.svg'}
          />
        </Center>
        <br />
        <Center>
          <VStack>
            <Text fontWeight={'bold'}>
              {currentUser.firstName} {currentUser.lastName}
            </Text>
            <Text fontWeight={'light'}>{currentUser.email}</Text>
            <Text fontWeight={'light'}>
              Role: {capitalizeFirstLetter(userRole)}
            </Text>
          </VStack>
        </Center>
        <br />
        <MenuDivider />
        <MenuItem as={NavLink} to={routes.myReleases()}>
          Your Releases
        </MenuItem>
        <MenuItem onClick={logOut}>Logout</MenuItem>
      </MenuList>
    </Menu>
  )
}

export default UserBubble
