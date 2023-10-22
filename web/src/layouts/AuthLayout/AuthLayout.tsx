import Header from 'src/components/Header/Header'

type AuthLayoutProps = {
  children?: React.ReactNode
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <>
      <Header />
      {children}
    </>
  )
}

export default AuthLayout
