import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', errorMsg: '', showError: false}

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitForm = async event => {
    event.preventDefault()

    const apiUrl = 'https://apis.ccbp.in/login'

    const {username, password} = this.state

    const userDetails = {username, password}

    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()

    if (response.ok) {
      Cookies.set('jwt_token', data.jwt_token, {expires: 30})
      const {history} = this.props
      history.replace('/')
    } else {
      this.setState({errorMsg: data.error_msg, showError: true})
    }
  }

  render() {
    const {username, password, showError, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="bg-container">
        <form className="card-container" onSubmit={this.onSubmitForm}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            className="logo"
            alt="website logo"
          />
          <br />
          <label htmlFor="name" className="name">
            USERNAME
          </label>
          <br />
          <input
            type="text"
            className="box"
            id="name"
            placeholder="Username"
            value={username}
            onChange={this.onChangeUsername}
          />
          <br />
          <label htmlFor="pass" className="pass">
            PASSWORD
          </label>
          <br />
          <input
            type="password"
            className="box"
            id="pass"
            placeholder="Password"
            value={password}
            onChange={this.onChangePassword}
          />
          <br />
          <button className="btn" type="submit">
            Login
          </button>
          {showError && <p className="error">*{errorMsg}</p>}
        </form>
      </div>
    )
  }
}
export default Login
