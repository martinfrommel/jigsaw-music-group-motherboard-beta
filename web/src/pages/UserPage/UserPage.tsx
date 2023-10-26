import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import UserCell from '../../components/UserCell'

export const beforePageLoad = ({ params }) => {
  const names = params.name.split('-')
  return { props: { firstName: names[0], lastName: names[1] } }
}

const UserPage = ({ firstName, lastName }) => {
  return (
    <div>
      <UserCell firstName={firstName} lastName={lastName} />
    </div>
  )
}

export default UserPage
