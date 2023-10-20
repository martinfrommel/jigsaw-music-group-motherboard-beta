import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

const CreateNewReleasePage = () => {
  return (
    <>
      <MetaTags title="CreateNewRelease" description="CreateNewRelease page" />

      <h1>CreateNewReleasePage</h1>
      <p>
        Find me in{' '}
        <code>
          ./web/src/pages/CreateNewReleasePage/CreateNewReleasePage.tsx
        </code>
      </p>
      <p>
        My default route is named <code>createNewRelease</code>, link to me with
        `<Link to={routes.createNewRelease()}>CreateNewRelease</Link>`
      </p>
    </>
  )
}

export default CreateNewReleasePage
