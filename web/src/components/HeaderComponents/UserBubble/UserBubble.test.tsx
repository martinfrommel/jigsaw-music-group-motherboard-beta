import { render } from '@redwoodjs/testing/web'

import UserBubble from './UserBubble'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('UserBubble', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<UserBubble />)
    }).not.toThrow()
  })
})
