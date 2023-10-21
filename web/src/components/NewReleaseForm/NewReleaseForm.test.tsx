import { render } from '@redwoodjs/testing/web'

import NewReleaseForm from './NewReleaseForm'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('NewReleaseForm', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<NewReleaseForm />)
    }).not.toThrow()
  })
})
