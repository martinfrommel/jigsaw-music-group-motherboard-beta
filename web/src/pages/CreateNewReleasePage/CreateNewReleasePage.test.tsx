import { render } from '@redwoodjs/testing/web'

import CreateNewReleasePage from './CreateNewReleasePage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('CreateNewReleasePage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<CreateNewReleasePage />)
    }).not.toThrow()
  })
})
