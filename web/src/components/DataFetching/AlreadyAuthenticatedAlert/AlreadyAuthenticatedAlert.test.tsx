import { render } from '@redwoodjs/testing/web'

import AlreadyAuthenticatedAlert from './AlreadyAuthenticatedAlert'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('AlreadyAuthenticatedAlert', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<AlreadyAuthenticatedAlert />)
    }).not.toThrow()
  })
})
