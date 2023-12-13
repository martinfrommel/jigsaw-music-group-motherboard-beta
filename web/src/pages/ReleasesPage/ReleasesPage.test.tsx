import { render } from '@redwoodjs/testing/web'

import ReleasesPage from './ReleasesPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('ReleasesPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ReleasesPage />)
    }).not.toThrow()
  })
})
