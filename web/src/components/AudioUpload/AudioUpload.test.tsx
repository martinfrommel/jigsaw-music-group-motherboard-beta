import { render, fireEvent } from '@redwoodjs/testing/web'

import AudioUpload from './AudioUpload'
const onAudioChangeMock = jest.fn()
const onUploadCompleteMock = jest.fn()
const mockBucketName = 'mockBucket'
const mockFolderName = 'mockFolder'
// Mock the supabase client
jest.mock('web/src/lib/initiliaseSupabase.ts', () => ({
  /* Mocked implementation */
}))

describe('AudioUpload', () => {
  it('renders successfully', () => {
    expect(() => {
      render(
        <AudioUpload
          onAudioChange={onAudioChangeMock}
          onUploadComplete={onAudioChangeMock}
          bucketName={mockBucketName}
          folderName={mockFolderName}
        />
      )
    }).not.toThrow()
  })

  it('renders the dropzone', () => {
    const { getByText } = render(
      <AudioUpload
        onAudioChange={onAudioChangeMock}
        onUploadComplete={onAudioChangeMock}
        bucketName={mockBucketName}
        folderName={mockFolderName}
      />
    )
    expect(
      getByText(
        'Drag & drop the master audio file here, or click to select one'
      )
    ).toBeInTheDocument() // Replace with actual dropzone text
  })

  it('handles file upload correctly', () => {
    render(
      <AudioUpload
        onAudioChange={onAudioChangeMock}
        onUploadComplete={onAudioChangeMock}
        bucketName={mockBucketName}
        folderName={mockFolderName}
      />
    )
    // ... Mock file drop event

    expect(onAudioChangeMock).toHaveBeenCalled()
    expect(onUploadCompleteMock).toHaveBeenCalled()
  })

  it('displays an error toast on upload failure', async () => {
    // Mock supabase client to throw an error
    // ... Mock file drop event

    const { findByText } = render(
      <AudioUpload
        onAudioChange={onAudioChangeMock}
        onUploadComplete={onAudioChangeMock}
        bucketName={mockBucketName}
        folderName={mockFolderName}
      />
    )
    expect(await findByText('Failed to upload file')).toBeInTheDocument()
  })

  it('clears the uploaded file', () => {
    const { getByLabelText } = render(
      <AudioUpload
        onAudioChange={onAudioChangeMock}
        onUploadComplete={onAudioChangeMock}
        bucketName={mockBucketName}
        folderName={mockFolderName}
      />
    )
    fireEvent.click(getByLabelText('Clear File Button')) // Replace with the actual label or identifier
    // Expect the file to be cleared, e.g., filename state to be null
  })

  it('displays progress during upload', () => {
    // ... Mock file drop event
    const { getByRole } = render(
      <AudioUpload
        onAudioChange={onAudioChangeMock}
        onUploadComplete={onAudioChangeMock}
        bucketName={mockBucketName}
        folderName={mockFolderName}
      />
    )
    expect(getByRole('progressbar')).toBeInTheDocument()
  })
})
