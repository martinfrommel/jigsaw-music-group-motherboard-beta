import type { Meta, StoryObj } from '@storybook/react'

import CreateNewUserPage from './CreateNewUserPage'

const meta: Meta<typeof CreateNewUserPage> = {
  component: CreateNewUserPage,
}

export default meta

type Story = StoryObj<typeof CreateNewUserPage>

export const Primary: Story = {}
