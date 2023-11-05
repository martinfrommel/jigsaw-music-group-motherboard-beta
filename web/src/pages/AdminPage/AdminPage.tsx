import { MetaTags } from '@redwoodjs/web'

import UsersCell from '../../components/UsersCell'
const AdminPage = () => {
  return (
    <>
      <MetaTags
        title="Admin"
        description="An admin section for managing the users"
      />

      <UsersCell />
    </>
  )
}

export default AdminPage
