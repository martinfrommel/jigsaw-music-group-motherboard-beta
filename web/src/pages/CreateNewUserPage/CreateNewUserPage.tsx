import { Card, CardBody, CardHeader, Divider } from '@chakra-ui/react'

import { MetaTags } from '@redwoodjs/web'

import CreateUserForm from 'src/components/CreateNewUserComponents/CreateUserForm/CreateUserForm'

const CreateNewUserPage = () => {
  return (
    <>
      <MetaTags
        title="Create a user"
        description="Here you can create a new user..."
      />
      <Card px={20} py={14} variant={'elevated'} shadow={'lg'}>
        <CardHeader
          alignSelf={'center'}
          fontSize={'5xl'}
          fontWeight={'bold'}
          textTransform={'uppercase'}
        >
          Create a user
        </CardHeader>
        <Divider my={8} />
        <CardBody>
          <CreateUserForm showRoleSelection />
        </CardBody>
      </Card>
    </>
  )
}

export default CreateNewUserPage
