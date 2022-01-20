const express = require('express')
const axios = require('axios')
const User = require('../models/userModel')
const { isAuth } = require('../utils/user-token')

const spotifyToken = require('../utils/spotify-token.js')

const spotifyRouter = express.Router()

spotifyRouter.get('/newreleases', isAuth, async (req, res) => {
  let token = await spotifyToken.getBearerToken()
  let { data } = await axios.get(
    `https://api.spotify.com/v1/browse/new-releases`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  res.json({ status: 200, data })
})

spotifyRouter.get('/artist/:artistid', isAuth, async (req, res) => {
  let id = req.params.artistid
  let token = await spotifyToken.getBearerToken()
  let { data } = await axios.get(`https://api.spotify.com/v1/artists/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  res.json({ status: 200, data })
})

spotifyRouter.get('/albums/:artistid', isAuth, async (req, res) => {
  let id = req.params.artistid
  let token = await spotifyToken.getBearerToken()
  let { data } = await axios.get(
    `https://api.spotify.com/v1/artists/${id}/albums?include_groups=album,single&limit=50`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  res.json({ status: 200, data })
})

spotifyRouter.get('/album/:albumid', isAuth, async (req, res) => {
  let id = req.params.albumid
  let token = await spotifyToken.getBearerToken()
  let { data } = await axios.get(`https://api.spotify.com/v1/albums/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  res.json({ status: 200, data })
})

spotifyRouter.get('/artists', isAuth, async (req, res) => {
  let searchString = req.query.search
  if (!searchString) {
    return res.json({ status: 400, message: 'There is no search string' })
  }

  let token = await spotifyToken.getBearerToken()
  let { data } = await axios.get(
    `https://api.spotify.com/v1/search?q=${searchString}&type=artist&limit=50`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  res.json({ status: 200, data })
})

spotifyRouter.get('/:userid/favourite/all', isAuth, async (req, res) => {
  let uid = req.params.userid
  let user = await User.findOne({
    _id: uid
  })

  let favourites = user.favourites
  if (favourites.length === 0) {
    return res.json({ status: 200, data: [] })
  }

  let stoken = await spotifyToken.getBearerToken()
  let { data } = await axios.get(
    `https://api.spotify.com/v1/tracks?ids=${favourites.join()}`,
    { headers: { Authorization: `Bearer ${stoken}` } }
  )
  return res.json({ status: 200, data: data.tracks })
})

spotifyRouter.post('/:userid/favourite/:trackid', isAuth, async (req, res) => {
  let uid = req.params.userid
  let tid = req.params.trackid
  let user = await User.findOneAndUpdate(
    { _id: uid },
    { $push: { favourites: tid } },
    { new: true }
  )

  let favourites = user.favourites
  if (favourites.length === 0) {
    return res.json({ status: 200, data: [] })
  }

  let stoken = await spotifyToken.getBearerToken()
  let { data } = await axios.get(
    `https://api.spotify.com/v1/tracks?ids=${favourites.join()}`,
    { headers: { Authorization: `Bearer ${stoken}` } }
  )

  res.json({ status: 200, data: data.tracks })
})

spotifyRouter.delete(
  '/:userid/favourite/:trackid',
  isAuth,
  async (req, res) => {
    let uid = req.params.userid
    let tid = req.params.trackid
    let user = await User.findOneAndUpdate(
      { _id: uid },
      { $pull: { favourites: tid } },
      { new: true }
    )

    let favourites = user.favourites
    if (favourites.length === 0) {
      return res.json({ status: 200, data: [] })
    }

    let stoken = await spotifyToken.getBearerToken()
    let { data } = await axios.get(
      `https://api.spotify.com/v1/tracks?ids=${favourites.join()}`,
      { headers: { Authorization: `Bearer ${stoken}` } }
    )
    return res.json({ status: 200, data: data.tracks })
  }
)

module.exports = spotifyRouter
