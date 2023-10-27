import { Text } from '@chakra-ui/react'
import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import { useAuth } from 'src/auth'
const ChangePasswordPage = () => {

  const {currentUser} = useAuth()
  return (
    <>
      <MetaTags title="ChangePassword" description="ChangePassword page" />

      <h1>ChangePasswordPage</h1>

    
    </>
  )
}

export default ChangePasswordPage
