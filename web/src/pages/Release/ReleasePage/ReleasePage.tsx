import ReleaseCell from 'src/components/Release/ReleaseCell'

type ReleasePageProps = {
  id: number
}

const ReleasePage = ({ id }: ReleasePageProps) => {
  return <ReleaseCell id={id} />
}

export default ReleasePage
