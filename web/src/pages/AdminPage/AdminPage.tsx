import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import UsersCell from '../../components/UsersCell'
const AdminPage = () => {
  return (
    <>
      <MetaTags title="Admin" description="Admin page" />

 <UsersCell />
    </>
  )
}

export default AdminPage
