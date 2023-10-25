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

import CreateUserForm from './CreateUserForm'

const meta: Meta<typeof CreateUserForm> = {
  component: CreateUserForm,
}

export default meta

type Story = StoryObj<typeof CreateUserForm>

export const Primary: Story = {}
