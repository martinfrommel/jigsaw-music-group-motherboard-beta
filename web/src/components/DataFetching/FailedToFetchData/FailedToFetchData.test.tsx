import { render } from '@redwoodjs/testing/web'

import FailedToFetchData from './FailedToFetchData'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('FailedToFetchData', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<FailedToFetchData />)
    }).not.toThrow()
  })
})
