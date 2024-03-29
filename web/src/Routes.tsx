// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Router, Route, Set, PrivateSet } from '@redwoodjs/router'

import { useAuth } from './auth'
import AdminLayout from './layouts/AdminLayout/AdminLayout'
import MainLayout from './layouts/MainLayout/MainLayout'
import { useIsAdmin } from './lib/isAdmin'

const Routes = () => {
  const isAdmin = useIsAdmin()
  return (
    <Router useAuth={useAuth}>
      <Set wrap={isAdmin ? AdminLayout : MainLayout}>
        <Route path="/" page={HomePage} name="home" prerender />
        <PrivateSet unauthenticated="login">
          <Route path="/submit-release" page={SubmitReleasePage} name="submitRelease" />
          <Route path="/user/releases" page={ReleasesPage} name="releases" prerender />
          <Route path="/user/{id:Int}/change-password" page={ChangePasswordPage} name="changePassword" />
        </PrivateSet>
        <Route path="/login" page={LoginPage} name="login" />
        {/* <Route path="/signup" page={SignupPage} name="signup" /> */}
        <Route path="/forgot-password" page={ForgotPasswordPage} name="forgotPassword" />
        <Route path="/reset-password" page={ResetPasswordPage} name="resetPassword" />
        <Route path="/set-password" page={SetPasswordPage} name="setPassword" />
        <Route notfound page={NotFoundPage} />
      </Set>

      <PrivateSet roles="admin" unauthenticated="login" wrap={AdminLayout}>
        <Route path="/admin" page={AdminPage} name="admin" />
        <Route path="/admin/create-a-user" page={CreateNewUserPage} name="createNewUser" />
        <Route path="/admin/releases" page={AdminAllReleasesPage} name="adminAllReleases" />
      </PrivateSet>
    </Router>
  )
}

export default Routes
