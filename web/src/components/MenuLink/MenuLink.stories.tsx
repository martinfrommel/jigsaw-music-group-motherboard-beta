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

import MenuLink from './MenuLink'

const meta: Meta<typeof MenuLink> = {
  component: MenuLink,
}

export default meta

type Story = StoryObj<typeof MenuLink>

export const Primary: Story = {}
