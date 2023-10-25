import type { Meta, StoryObj } from '@storybook/react'

import MyReleasesPage from './MyReleasesPage'

const meta: Meta<typeof MyReleasesPage> = {
  component: MyReleasesPage,
}

export default meta

type Story = StoryObj<typeof MyReleasesPage>

export const Primary: Story = {}
