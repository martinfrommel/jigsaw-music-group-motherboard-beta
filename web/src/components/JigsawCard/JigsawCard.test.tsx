import { render } from '@redwoodjs/testing/web'

import JigsawCard from './JigsawCard'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('JigsawCard', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<JigsawCard />)
    }).not.toThrow()
  })
})
