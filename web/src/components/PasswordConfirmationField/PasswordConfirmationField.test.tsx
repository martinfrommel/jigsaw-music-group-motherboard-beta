import { render } from '@redwoodjs/testing/web'

import PasswordConfirmationField from './PasswordConfirmationField'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('PasswordConfirmationField', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<PasswordConfirmationField />)
    }).not.toThrow()
  })
})
