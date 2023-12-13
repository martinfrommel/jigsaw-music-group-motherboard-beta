import { render } from '@redwoodjs/testing/web'

import EmptyCellAlert from './EmptyCellAlert'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('EmptyCellAlert', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<EmptyCellAlert />)
    }).not.toThrow()
  })
})
