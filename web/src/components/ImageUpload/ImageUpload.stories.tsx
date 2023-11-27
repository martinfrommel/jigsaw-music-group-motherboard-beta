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

import ImageUpload from './ImageUpload'

const meta: Meta<typeof ImageUpload> = {
  component: ImageUpload,
}

export default meta

type Story = StoryObj<typeof ImageUpload>

export const Primary: Story = {}
