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

import AlreadyAuthenticatedAlert from './AlreadyAuthenticatedAlert'

const meta: Meta<typeof AlreadyAuthenticatedAlert> = {
  component: AlreadyAuthenticatedAlert,
}

export default meta

type Story = StoryObj<typeof AlreadyAuthenticatedAlert>

export const Primary: Story = {}
