import { Alert, AlertIcon } from '@chakra-ui/react'

import { MetaTags } from '@redwoodjs/web'

import CreateUserForm from 'src/components/CreateNewUserComponents/CreateUserForm/CreateUserForm'
import JigsawCard from 'src/components/JigsawCard/JigsawCard'

const CreateNewUserPage = () => {
  return (
    <>
      <MetaTags
        title="Create a user"
        description="Here you can create a new user..."
        robots={['noindex', 'nofollow']}
      />
      <Alert status="warning" flex={0} maxW={'2xl'} mb={12}>
        <AlertIcon />
        {`This thing is meant for admins only - if you see it and you're not an admin, that's bad...`}
      </Alert>
      <JigsawCard>
        <JigsawCard.Header>Create a new user</JigsawCard.Header>
        <JigsawCard.Body>
          <CreateUserForm showRoleSelection />
        </JigsawCard.Body>
      </JigsawCard>
    </>
  )
}

export default CreateNewUserPage
