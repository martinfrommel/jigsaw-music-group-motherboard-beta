import { useAuth } from 'src/auth'

export const useIsAdmin = () => {
  const { isAuthenticated, hasRole } = useAuth()
  return isAuthenticated && hasRole('admin')
  
}
