import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

const SubmitReleasePage = () => {
  return (
    <>
      <MetaTags title="SubmitRelease" description="SubmitRelease page" />

      <h1>SubmitReleasePage</h1>
      <p>
        Find me in{' '}
        <code>./web/src/pages/SubmitReleasePage/SubmitReleasePage.tsx</code>
      </p>
      <p>
        My default route is named <code>submitRelease</code>, link to me with `
        <Link to={routes.submitRelease()}>SubmitRelease</Link>`
      </p>
    </>
  )
}

export default SubmitReleasePage
