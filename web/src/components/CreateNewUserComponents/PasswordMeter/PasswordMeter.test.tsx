import { render } from '@redwoodjs/testing/web'

import PasswordMeter from './PasswordMeter'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('PasswordMeter', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<PasswordMeter />)
    }).not.toThrow()
  })
})
