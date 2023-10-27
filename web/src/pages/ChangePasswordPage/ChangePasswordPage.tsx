import { MetaTags } from '@redwoodjs/web'

import { useAuth } from 'src/auth'
import ChangePasswordForm from 'src/components/UserComponents/ChangePasswordForm/ChangePasswordForm'

const ChangePasswordPage = () => {
  const { currentUser } = useAuth()
  return (
    <>
      <MetaTags title="ChangePassword" description="ChangePassword page" />

      <ChangePasswordForm userId={currentUser.id} />
    </>
  )
}

export default ChangePasswordPage
