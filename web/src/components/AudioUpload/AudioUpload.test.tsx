import { render } from '@redwoodjs/testing/web'

import AudioUpload from './AudioUpload'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('AudioUpload', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<AudioUpload />)
    }).not.toThrow()
  })
})
