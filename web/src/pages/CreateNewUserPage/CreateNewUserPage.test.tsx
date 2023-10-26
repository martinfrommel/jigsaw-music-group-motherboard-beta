import { render } from '@redwoodjs/testing/web'

import CreateNewUserPage from './CreateNewUserPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('CreateNewUserPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<CreateNewUserPage />)
    }).not.toThrow()
  })
})
