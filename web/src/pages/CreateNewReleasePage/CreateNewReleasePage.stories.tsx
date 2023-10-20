import type { Meta, StoryObj } from '@storybook/react'

import CreateNewReleasePage from './CreateNewReleasePage'

const meta: Meta<typeof CreateNewReleasePage> = {
  component: CreateNewReleasePage,
}

export default meta

type Story = StoryObj<typeof CreateNewReleasePage>

export const Primary: Story = {}
