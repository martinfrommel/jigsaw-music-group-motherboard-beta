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
import { useAuth } from 'src/auth'

const UserBubble = () => {
  const { currentUser, logOut } = useAuth()

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
            <Text>
              {currentUser.firstName} {currentUser.lastName}
            </Text>
            <p>{currentUser.email}</p>
          </VStack>
        </Center>
        <br />
        <MenuDivider />
        <MenuItem>Your Releases</MenuItem>
        <MenuItem onClick={logOut}>Logout</MenuItem>
      </MenuList>
    </Menu>
  )
}

export default UserBubble
