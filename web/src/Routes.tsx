// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Router, Route, Set, Private } from '@redwoodjs/router'

import ScaffoldLayout from 'src/layouts/ScaffoldLayout'
import MainLayout from './layouts/MainLayout/MainLayout'
import AuthLayout from './layouts/AuthLayout/AuthLayout'
import { useAuth } from './auth'
import AdminLayout from './layouts/AdminLayout/AdminLayout'
import { useIsAdmin } from './lib/isAdmin'

const Routes = () => {
  const isAdmin = useIsAdmin()
  return (
    <Router useAuth={useAuth}>
      <Set wrap={isAdmin ? AdminLayout : MainLayout}>
        <Route path="/" page={HomePage} name="home" />
        <Private unauthenticated="login">
          <Route path="/submit-release" page={SubmitReleasePage} name="submitRelease" />
          <Route path="/my-releases" page={MyReleasesPage} name="myReleases" />
        </Private>
        <Route path="/login" page={LoginPage} name="login" />
        <Route path="/signup" page={SignupPage} name="signup" />
        <Route path="/forgot-password" page={ForgotPasswordPage} name="forgotPassword" />
        <Route path="/reset-password" page={ResetPasswordPage} name="resetPassword" />
        <Route notfound page={NotFoundPage} />
      </Set>

      <Set private roles="admin" unauthenticated="login" wrap={AdminLayout}>
        <Route path="/admin/create-a-user" page={CreateNewUserPage} name="createNewUser" />
      </Set>
    </Router>
  )
}

export default Routes
