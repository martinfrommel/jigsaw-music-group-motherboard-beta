import { MetaTags } from '@redwoodjs/web'

import { useAuth } from 'src/auth'
import JigsawCard from 'src/components/JigsawCard/JigsawCard'
import ChangePasswordForm from 'src/components/UserComponents/ChangePasswordForm/ChangePasswordForm'

const ChangePasswordPage = () => {
  const { currentUser } = useAuth()
  return (
    <>
      <MetaTags
        title="Change your password"
        description="You can change your password here..."
        robots={['noindex', 'nofollow']}
      />
      <JigsawCard>
        <JigsawCard.Header>Change your password</JigsawCard.Header>
        <JigsawCard.Body>
          <ChangePasswordForm userId={currentUser.id} />{' '}
        </JigsawCard.Body>
      </JigsawCard>
    </>
  )
}

export default ChangePasswordPage
