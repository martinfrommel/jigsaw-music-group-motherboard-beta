import {
  Avatar,
  Center,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  useDisclosure,
  Button,
} from '@chakra-ui/react'

const UserBubble = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

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
          <p>Your Name</p>
        </Center>
        <br />
        <MenuDivider />
        <MenuItem>Your Releases</MenuItem>
        <MenuItem>Logout</MenuItem>
      </MenuList>
    </Menu>
  )
}

export default UserBubble
