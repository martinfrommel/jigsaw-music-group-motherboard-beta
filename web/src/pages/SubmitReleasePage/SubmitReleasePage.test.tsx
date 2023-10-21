import { render } from '@redwoodjs/testing/web'

import SubmitReleasePage from './SubmitReleasePage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('SubmitReleasePage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<SubmitReleasePage />)
    }).not.toThrow()
  })
})
