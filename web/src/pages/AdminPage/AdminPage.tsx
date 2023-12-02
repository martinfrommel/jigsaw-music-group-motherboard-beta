import { MetaTags } from '@redwoodjs/web'

import UsersCell from '../../components/UsersCell'
const AdminPage = () => {
  return (
    <>
      <MetaTags
        title="Admin"
        description="An admin section for managing the users"
        robots={['noindex', 'nofollow']}
      />
      <UsersCell />
    </>
  )
}

export default AdminPage
