import { render } from '@redwoodjs/testing/web'

import MyReleasesPage from './MyReleasesPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('MyReleasesPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<MyReleasesPage />)
    }).not.toThrow()
  })
})
