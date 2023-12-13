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

import JigsawCard from './JigsawCard'

const meta: Meta<typeof JigsawCard> = {
  component: JigsawCard,
}

export default meta

type Story = StoryObj<typeof JigsawCard>

export const Primary: Story = {}
