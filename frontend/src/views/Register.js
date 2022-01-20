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

function Register() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [usernameMsg, setUsernameMsg] = useState('')
  const [passwordMsg, setPasswordMsg] = useState('')
  const [password2Msg, setPassword2Msg] = useState('')
  const [usernameErr, setUsernameErr] = useState(false)
  const [passwordErr, setPasswordErr] = useState(false)
  const [password2Err, setPassword2Err] = useState(false)
  const [warningMsg, setWarningMsg] = useState(' ')
  const [loading, setLoading] = useState(false)
  const history = useHistory()

  const handleUsername = function (e) {
    if (e.target.value === '') {
      setUsernameMsg('Please provide a valid username')
      setUsernameErr(true)
    } else {
      setUsernameMsg('')
      setUsernameErr(false)
    }
    setUsername(e.target.value)
  }

  const handlePassword = function (e) {
    if (e.target.value === '') {
      setPasswordMsg('Please provide a valid password')
      setPasswordErr(true)
    } else {
      setPasswordMsg('')
      setPasswordErr(false)
    }
    setPassword(e.target.value)
  }

  const handlePassword2 = function (e) {
    if (e.target.value === '') {
      setPassword2Msg('Please provide a valid password')
      setPassword2Err(true)
    } else {
      setPassword2Msg('')
      setPassword2Err(false)
    }
    setPassword2(e.target.value)
  }

  const handleSubmit = async function () {
    setLoading(true)
    let user = {
      username,
      password,
      password2
    }
    let { data } = await axios.post('/api/user/register', user)

    if (data.status !== 200) {
      setWarningMsg(data.message)
      setLoading(false)
    } else {
      history.push('/login')
    }
  }

  return (
    <Card
      sx={{
        width: 400,
        height: 400,
        margin: '100px auto'
      }}
    >
      <CardContent sx={{ paddingBottom: '0' }}>
        <Typography
          variant="h5"
          sx={{ marginTop: '10px', textAlign: 'center' }}
        >
          Register
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
        <Box sx={{ height: '70px' }}>
          <TextField
            variant="standard"
            sx={{ width: '100%' }}
            type="password"
            label="Password"
            required
            value={password2}
            onChange={handlePassword2}
            onBlur={handlePassword2}
            error={password2Err}
            helperText={password2Msg}
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
            startIcon={<AccountBoxIcon />}
            onClick={handleSubmit}
          >
            Register
          </Button>
        )}
        {loading && (
          <Button variant="contained" disabled startIcon={<AccountBoxIcon />}>
            Processing
          </Button>
        )}
      </CardActions>
    </Card>
  )
}

export default Register
