import { Button, Flex } from '@chakra-ui/react'
import { NavLink, routes } from '@redwoodjs/router'

const AdminHeader = () => {
  return (
    <Flex py={6} px={4} bg={'blackAlpha.500'}>
      <Button
        as={NavLink}
        to={routes.createNewUser()}
        activeClassName="nav-link-active"
      >
        Create a new user
      </Button>{' '}
      <Button
        ml={4}
        as={NavLink}
        to={routes.admin()}
        activeClassName="nav-link-active"
      >
        Access the admin section
      </Button>
    </Flex>
  )
}

export default AdminHeader
