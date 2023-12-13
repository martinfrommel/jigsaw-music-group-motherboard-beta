import type { Meta, StoryObj } from '@storybook/react'

import ReleasesPage from './ReleasesPage'

const meta: Meta<typeof ReleasesPage> = {
  component: ReleasesPage,
}

export default meta

type Story = StoryObj<typeof ReleasesPage>

export const Primary: Story = {}
