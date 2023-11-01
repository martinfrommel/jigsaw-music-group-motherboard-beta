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

import ListAllUsers from './ListAllUsers'

const meta: Meta<typeof ListAllUsers> = {
  component: ListAllUsers,
}

export default meta

type Story = StoryObj<typeof ListAllUsers>

export const Primary: Story = {}
