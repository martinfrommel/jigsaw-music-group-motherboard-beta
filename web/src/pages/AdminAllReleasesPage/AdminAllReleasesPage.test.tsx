import { render } from '@redwoodjs/testing/web'

import AdminAllReleasesPage from './AdminAllReleasesPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('AdminAllReleasesPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<AdminAllReleasesPage />)
    }).not.toThrow()
  })
})
