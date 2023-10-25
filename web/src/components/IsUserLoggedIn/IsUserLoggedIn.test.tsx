import { render } from '@redwoodjs/testing/web'

import IsUserLoggedIn from './IsUserLoggedIn'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('IsUserLoggedIn', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<IsUserLoggedIn />)
    }).not.toThrow()
  })
})
