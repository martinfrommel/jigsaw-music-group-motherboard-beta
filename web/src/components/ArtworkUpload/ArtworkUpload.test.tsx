import { render, screen, fireEvent } from '@redwoodjs/testing/web'
import { useMutation } from '@redwoodjs/web'

import ArtworkUpload from './ArtworkUpload'

describe('ArtworkUpload', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ArtworkUpload />)
    }).not.toThrow()
  })

  it('clears the file from S3 when handleFileClear is called', async () => {
    // Mock the clearFileFromS3 function
    const mockClearFileFromS3 = jest.fn().mockResolvedValue({
      data: {
        clearFileFromS3: {
          ok: true,
        },
      },
    })
    jest.mock(useMutation, () => ({
      clearFileFromS3: mockClearFileFromS3,
    }))

    render(<ArtworkUpload />)

    // Simulate selecting a file
    const fileInput = screen.getByLabelText('Select File')
    fireEvent.change(fileInput, {
      target: { files: [new File([], 'test.jpg')] },
    })

    // Simulate clearing the file
    const clearButton = screen.getByText('Clear File')
    fireEvent.click(clearButton)

    // Assert that the clearFileFromS3 function is called with the correct arguments
    expect(mockClearFileFromS3).toHaveBeenCalledWith({
      variables: {
        filePath: 'path/to/file.jpg', // Replace with the actual file path
        user: {
          id: 'user-id', // Replace with the actual user ID
          firstName: 'John', // Replace with the actual user first name
          lastName: 'Doe', // Replace with the actual user last name
        },
      },
    })

    // Assert that the file input is cleared
    expect(fileInput.value).toBe('')

    // Assert that the state variables are updated
    expect(
      screen.getByText('File successfully deleted from S3')
    ).toBeInTheDocument()
    // Add assertions for other state variables if needed
  })
})
