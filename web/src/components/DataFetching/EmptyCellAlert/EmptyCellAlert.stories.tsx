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

import EmptyCellAlert from './EmptyCellAlert'

const meta: Meta<typeof EmptyCellAlert> = {
  component: EmptyCellAlert,
}

export default meta

type Story = StoryObj<typeof EmptyCellAlert>

export const Primary: Story = {}
