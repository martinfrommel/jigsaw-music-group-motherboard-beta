import AdminHeader from 'src/components/AdminHeader/AdminHeader'
import MainLayout from '../MainLayout/MainLayout'

type AdminLayoutProps = {
  children?: React.ReactNode
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <>
      <AdminHeader />
      <MainLayout>{children}</MainLayout>
    </>
  )
}

export default AdminLayout
