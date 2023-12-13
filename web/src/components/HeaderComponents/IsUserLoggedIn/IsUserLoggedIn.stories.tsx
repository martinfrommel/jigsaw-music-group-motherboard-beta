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

import IsUserLoggedIn from './IsUserLoggedIn'

const meta: Meta<typeof IsUserLoggedIn> = {
  component: IsUserLoggedIn,
}

export default meta

type Story = StoryObj<typeof IsUserLoggedIn>

export const Primary: Story = {}
