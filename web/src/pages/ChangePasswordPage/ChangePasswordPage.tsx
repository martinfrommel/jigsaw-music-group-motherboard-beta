import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

const ChangePasswordPage = () => {
  return (
    <>
      <MetaTags title="ChangePassword" description="ChangePassword page" />

      <h1>ChangePasswordPage</h1>
      <p>
        Find me in{' '}
        <code>./web/src/pages/ChangePasswordPage/ChangePasswordPage.tsx</code>
      </p>
      <p>
        My default route is named <code>changePassword</code>, link to me with `
        <Link to={routes.changePassword()}>ChangePassword</Link>`
      </p>
    </>
  )
}

export default ChangePasswordPage
