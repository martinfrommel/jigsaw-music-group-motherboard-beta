import { render } from '@redwoodjs/testing/web'

import ArtworkUpload from './ArtworkUpload'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('ArtworkUpload', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ArtworkUpload />)
    }).not.toThrow()
  })
})
