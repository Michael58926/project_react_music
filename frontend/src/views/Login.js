import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import axios from '../config/axios.config.js'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import AccountBoxIcon from '@material-ui/icons/AccountBox'
import PersonIcon from '@material-ui/icons/Person'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [usernameMsg, setUsernameMsg] = useState('')
  const [passwordMsg, setPasswordMsg] = useState('')
  const [usernameErr, setUsernameErr] = useState(false)
  const [passwordErr, setPasswordErr] = useState(false)
  const [warningMsg, setWarningMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const history = useHistory()

  const handleUsername = function (e) {
    if (e.target.value === '') {
      setUsernameMsg('Please enter a username')
      setUsernameErr(true)
    } else {
      setUsernameMsg('')
      setUsernameErr(false)
    }
    setUsername(e.target.value)
  }

  const handlePassword = function (e) {
    if (e.target.value === '') {
      setPasswordMsg('Please enter a password')
      setPasswordErr(true)
    } else {
      setPasswordMsg('')
      setPasswordErr(false)
    }
    setPassword(e.target.value)
  }

  const handleSubmit = async function () {
    setLoading(true)
    let user = {
      username,
      password
    }
    let { data } = await axios.post('/api/user/login', user)

    if (data.status !== 200) {
      setWarningMsg(data.message)
      setLoading(false)
    } else {
      sessionStorage.setItem('token', data.token)
      sessionStorage.setItem('user', JSON.stringify(data.user))
      history.push('/home')
    }
  }

  return (
    <Card
      sx={{
        width: 400,
        height: 350,
        margin: '100px auto'
      }}
    >
      <CardContent sx={{ paddingBottom: '0' }}>
        <Typography
          variant="h5"
          sx={{ marginTop: '10px', textAlign: 'center' }}
        >
          Log in
        </Typography>

        <Box sx={{ height: '70px' }}>
          <TextField
            variant="standard"
            sx={{ width: '100%' }}
            label="Username"
            required
            value={username}
            onChange={handleUsername}
            onBlur={handleUsername}
            error={usernameErr}
            helperText={usernameMsg}
          />
        </Box>
        <Box sx={{ height: '70px' }}>
          <TextField
            variant="standard"
            sx={{ width: '100%' }}
            type="password"
            label="Password"
            required
            value={password}
            onChange={handlePassword}
            onBlur={handlePassword}
            error={passwordErr}
            helperText={passwordMsg}
          />
        </Box>

        <Typography
          variant="body2"
          color="error"
          sx={{
            height: '30px',
            marginTop: '10px',
            marginBottom: '5px',
            textAlign: 'center'
          }}
        >
          {warningMsg}
        </Typography>
      </CardContent>

      <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
        {!loading && (
          <Button
            variant="contained"
            color="success"
            sx={{ width: '130px' }}
            startIcon={<PersonIcon />}
            onClick={handleSubmit}
          >
            Login
          </Button>
        )}
        {loading && (
          <Button
            variant="contained"
            disabled
            sx={{ width: '130px' }}
            startIcon={<PersonIcon />}
          >
            Processing
          </Button>
        )}
        <Button
          variant="contained"
          sx={{ width: '130px' }}
          startIcon={<AccountBoxIcon />}
          onClick={() => {
            history.push('/register')
          }}
        >
          Register
        </Button>
      </CardActions>
    </Card>
  )
}

export default Login
