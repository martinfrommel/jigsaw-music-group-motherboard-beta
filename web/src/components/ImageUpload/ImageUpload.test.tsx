import { render } from '@redwoodjs/testing/web'

import ImageUpload from './ImageUpload'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('ImageUpload', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ImageUpload />)
    }).not.toThrow()
  })
})
