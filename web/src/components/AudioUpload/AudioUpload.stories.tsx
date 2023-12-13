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

import AudioUpload from './AudioUpload'

const meta: Meta<typeof AudioUpload> = {
  component: AudioUpload,
}

export default meta

type Story = StoryObj<typeof AudioUpload>

export const Primary: Story = {}
