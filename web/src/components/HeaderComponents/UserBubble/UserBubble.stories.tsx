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

import UserBubble from './UserBubble'

const meta: Meta<typeof UserBubble> = {
  component: UserBubble,
}

export default meta

type Story = StoryObj<typeof UserBubble>

export const Primary: Story = {}
