import {Route, Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

const ProtectedRoute = props => {
  const jwtToken = Cookies.get('jwt_token')

  if (jwtToken === undefined) {
    return <Redirect to="/login" />
  }

  const {component: Component, ...rest} = props

  return (
    <Route {...rest} render={routeProps => <Component {...routeProps} />} />
  )
}

export default ProtectedRoute
