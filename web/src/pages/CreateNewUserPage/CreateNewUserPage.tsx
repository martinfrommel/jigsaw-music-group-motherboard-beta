import { Text } from '@chakra-ui/react'
import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import CreateUserForm from 'src/components/CreateNewUserComponents/CreateUserForm/CreateUserForm'

const CreateNewUserPage = () => {
  return (
    <>
      <MetaTags title="CreateNewUser" description="CreateNewUser page" />
      <Text fontSize={'3xl'} mb={8}>
        Create a new user
      </Text>
      <CreateUserForm showRoleSelection />
    </>
  )
}

export default CreateNewUserPage
