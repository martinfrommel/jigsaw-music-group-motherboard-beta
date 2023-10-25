import EditReleaseCell from 'src/components/Release/EditReleaseCell'

type ReleasePageProps = {
  id: number
}

const EditReleasePage = ({ id }: ReleasePageProps) => {
  return <EditReleaseCell id={id} />
}

export default EditReleasePage
