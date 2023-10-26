import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import CreateUserForm from 'src/components/CreateNewUserComponents/CreateUserForm/CreateUserForm'

const CreateNewUserPage = () => {
  return (
    <>
      <MetaTags title="CreateNewUser" description="CreateNewUser page" />

      <CreateUserForm showRoleSelection />
    </>
  )
}

export default CreateNewUserPage
