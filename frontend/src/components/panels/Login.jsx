import React, { Component } from 'react'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import { createWalletApi } from 'dream-wallet/lib/network'

let link = (that, p) => (event) => that.setState({ [p]: event.target.value })

const styles = {
  input: {
    width: 360
  }
}

class Login extends Component {
  constructor (props) {
    super(props)
    this.state = {
      guid: 'f9df366a-3fc3-4826-827f-fb3c1e8ce616',
      sharedKey: '00efae13-985b-4858-81ad-71bd8b5ac863',
      password: '100 cent'
    }
    this.api = createWalletApi()
  }

  render () {
    let { loginState, loginStart, loginSuccess, loginError, loadWallet } = this.props
    let { guid, sharedKey, password } = this.state

    let login = () => {
      loginStart()
      this.api.getWallet(guid, sharedKey, password)
        .then(loadWallet)
        .then(loginSuccess)
        .catch(loginError)
    }

    return (
      <div>
        <h2>Login Component</h2>
        <ul>
          <li>Pending: {String(loginState.pending)}</li>
          <li>Success: {String(loginState.success)}</li>
          <li>Error: {String(loginState.error)}</li>
        </ul>
        <div>
          <TextField
            style={styles.input}
            value={guid}
            onChange={link(this, 'guid')}
            placeholder='guid'
          />
        </div>
        <div>
          <TextField
            style={styles.input}
            value={sharedKey}
            onChange={link(this, 'sharedKey')}
            placeholder='shared key'
          />
        </div>
        <div>
          <TextField
            style={styles.input}
            value={password}
            onChange={link(this, 'password')}
            placeholder='password'
            type='password'
          />
        </div>
        <RaisedButton onClick={login} primary label='go' />
      </div>
    )
  }
}

export default Login