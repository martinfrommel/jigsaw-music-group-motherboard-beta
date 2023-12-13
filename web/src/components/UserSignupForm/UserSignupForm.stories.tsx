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

import UserSignupForm from './UserSignupForm'

const meta: Meta<typeof UserSignupForm> = {
  component: UserSignupForm,
}

export default meta

type Story = StoryObj<typeof UserSignupForm>

export const Primary: Story = {}
