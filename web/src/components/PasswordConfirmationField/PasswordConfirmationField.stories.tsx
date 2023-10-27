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

import PasswordConfirmationField from './PasswordConfirmationField'

const meta: Meta<typeof PasswordConfirmationField> = {
  component: PasswordConfirmationField,
}

export default meta

type Story = StoryObj<typeof PasswordConfirmationField>

export const Primary: Story = {}
