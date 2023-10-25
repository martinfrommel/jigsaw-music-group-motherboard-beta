import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

const HomePage = () => {
  return (
    <>
      <MetaTags title="Home" description="Home page" />

      <h1>HomePage</h1>
      <p>
        You can submit a new release by clicking{' '}
        <Link to={routes.submitRelease()}>here</Link>
      </p>
    </>
  )
}

export default HomePage
