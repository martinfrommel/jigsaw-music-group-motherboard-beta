// Pass props to your component by passing an `args` object to your story
//
// ```tsx
// export const Primary: Story = {
//  args: {
//    propName: propValue
//  }
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { Meta, StoryObj } from '@storybook/react'

import FailedToFetchData from './FailedToFetchData'

const meta: Meta<typeof FailedToFetchData> = {
  component: FailedToFetchData,
}

export default meta

type Story = StoryObj<typeof FailedToFetchData>

export const Primary: Story = {}
