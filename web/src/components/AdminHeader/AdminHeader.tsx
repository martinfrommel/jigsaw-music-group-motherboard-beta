import { Button, Flex } from '@chakra-ui/react'
import { NavLink, routes } from '@redwoodjs/router'

const AdminHeader = () => {
  return (
    <Flex py={6} px={4} bg={'blackAlpha.500'}>
      <Button as={NavLink} to={routes.createNewUser()}>
        Create a new user
      </Button>{' '}
      <Button ml={4}>Access the admin section</Button>
    </Flex>
  )
}

export default AdminHeader
