import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

const MyReleasesPage = () => {
  return (
    <>
      <MetaTags title="MyReleases" description="MyReleases page" />

      <h1>MyReleasesPage</h1>
      <p>
        Find me in{' '}
        <code>./web/src/pages/MyReleasesPage/MyReleasesPage.tsx</code>
      </p>
      <p>
        My default route is named <code>myReleases</code>, link to me with `
        <Link to={routes.myReleases()}>MyReleases</Link>`
      </p>
    </>
  )
}

export default MyReleasesPage
