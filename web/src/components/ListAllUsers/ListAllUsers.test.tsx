import { render } from '@redwoodjs/testing/web'

import ListAllUsers from './ListAllUsers'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('ListAllUsers', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ListAllUsers />)
    }).not.toThrow()
  })
})
