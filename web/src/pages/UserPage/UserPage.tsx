import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import UserCell from '../../components/UserComponents/UserCell'

export const beforePageLoad = ({ params }) => {
  const { id } = params
  return { props: { id } }
}

const UserPage = ({ id }) => {
  return (
    <>
      <MetaTags title="SubmitRelease" description="SubmitRelease page" />
      <div>
        <UserCell id={id} />
      </div>
    </>
  )
}

export default UserPage
