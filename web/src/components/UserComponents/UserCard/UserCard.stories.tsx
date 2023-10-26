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

import UserCard from './UserCard'

const meta: Meta<typeof UserCard> = {
  component: UserCard,
}

export default meta

type Story = StoryObj<typeof UserCard>

export const Primary: Story = {}
