import Header from 'src/components/HeaderComponents/Header/Header'

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
