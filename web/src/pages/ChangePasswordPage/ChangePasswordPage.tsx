import { Card, CardBody, CardHeader, Divider } from '@chakra-ui/react'

import { MetaTags } from '@redwoodjs/web'

import { useAuth } from 'src/auth'
import ChangePasswordForm from 'src/components/UserComponents/ChangePasswordForm/ChangePasswordForm'

const ChangePasswordPage = () => {
  const { currentUser } = useAuth()
  return (
    <>
      <MetaTags
        title="Change your password"
        description="You can change your password here..."
      />
      <Card px={20} py={14} variant={'elevated'} shadow={'lg'}>
        <CardHeader
          alignSelf={'center'}
          fontSize={'5xl'}
          fontWeight={'bold'}
          textTransform={'uppercase'}
        >
          Change your password
        </CardHeader>
        <Divider my={8} />
        <CardBody>
          <ChangePasswordForm userId={currentUser.id} />{' '}
        </CardBody>
      </Card>
    </>
  )
}

export default ChangePasswordPage
