import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import CreateUserForm from 'src/components/CreateNewUserComponents/CreateUserForm/CreateUserForm'
import NewReleaseForm from 'src/components/NewReleaseForm/NewReleaseForm'
import NewRelease from 'src/components/Release/NewRelease/NewRelease'

const HomePage = () => {
  return (
    <>
      <MetaTags title="Home" description="Home page" />

      <h1>HomePage</h1>
      <p>
        You can submit a new release by clicking{' '}
        <Link to={routes.submitRelease()}>here</Link>
      </p>

      <NewReleaseForm />
    </>
  )
}

export default HomePage
