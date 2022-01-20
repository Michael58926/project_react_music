const axios = require('axios')

const spotifyToken = {
  accessToken: '',
  accessTokenExpires: '',

  getAccessToken: async function () {
    let auth = new Buffer.from(
      `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
      'binary'
    ).toString('base64')
    let { data } = await axios.post(
      'https://accounts.spotify.com/api/token?grant_type=client_credentials',
      'grant_type=client_credentials',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${auth}`
        }
      }
    )
    this.accessToken = data.access_token
    this.accessTokenExpires = data.expires_in
  },

  getBearerToken: async function () {
    // no access token or invalid token, so get a fresh one
    if (!this.accessToken || new Date() > this.accessTokenExpires) {
      await this.getAccessToken()
    }

    return this.accessToken
  }
}

module.exports = spotifyToken
