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

import ArtworkUpload from './ArtworkUpload'

const meta: Meta<typeof ArtworkUpload> = {
  component: ArtworkUpload,
}

export default meta

type Story = StoryObj<typeof ArtworkUpload>

export const Primary: Story = {}
