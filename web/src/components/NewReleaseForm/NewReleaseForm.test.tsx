import { render, act } from '@redwoodjs/testing/web'
import { toast } from '@redwoodjs/web/dist/toast'

import NewReleaseForm from './NewReleaseForm'

jest.mock('@redwoodjs/web/dist/toast', () => {
  return {
    toast: {
      error: jest.fn(),
      success: jest.fn(),
      loading: jest.fn(),
      remove: jest.fn(),
    },
  }
})
//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('NewReleaseForm', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<NewReleaseForm />)
    }).not.toThrow()
  })

  it('calls createRelease with correct input and shows success toast on success', async () => {
    // Mock createRelease to resolve with some data
    const createRelease = jest.fn().mockResolvedValue({ data: 'mockData' })

    // Mock toast functions
    toast.loading = jest.fn()
    toast.remove = jest.fn()
    toast.success = jest.fn()

    // Call onSubmit with some data
    const data = {
      songMasterReference: 'ref',
      songArtworkReference: 'artworkRef',
      AWSFolderKey: 'key',
      label: { id: '1', name: 'label' },
      metadata: {
        songTitle: 'title',
        Artist: 'artist',

      },
    }

    await act(async () =>
      NewReleaseForm.onSubmit(data, { setSubmitting: jest.fn() })
    )

    // Assert that createRelease was called with correct input
    // Assert that toast functions were called
    // Assert that window.location.reload was called
  })

  it('shows error toast on failure', async () => {
    // Similar to the previous test, but mock createRelease to reject with an error
  })
})
