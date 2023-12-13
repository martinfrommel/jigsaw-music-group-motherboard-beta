import { render } from '@redwoodjs/testing/web'

import UserSignupForm from './UserSignupForm'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('UserSignupForm', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<UserSignupForm />)
    }).not.toThrow()
  })
})
