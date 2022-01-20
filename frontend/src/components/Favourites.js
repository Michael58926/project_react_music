import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import axios from '../config/axios.config.js'
import Card from '@material-ui/core/Card'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import QueueMusicIcon from '@material-ui/icons/QueueMusic'

function Favourites() {
  const [tracks, setTracks] = useState([])
  const [loading, setLoading] = useState(true)
  const isMounted = useRef(false)

  useEffect(() => {
    isMounted.current = true

    let userid = JSON.parse(sessionStorage.getItem('user'))._id
    axios.get(`/api/spotify/${userid}/favourite/all`).then(({ data: res }) => {
      if (isMounted.current) {
        setTracks(res.data)
        setLoading(false)
      }
    })

    return () => {
      isMounted.current = false
    }
  }, [])

  const deleteTrack = async function (trackid) {
    let userid = JSON.parse(sessionStorage.getItem('user'))._id
    let { data: res } = await axios.delete(
      `/api/spotify/${userid}/favourite/${trackid}`
    )
    if (isMounted.current) {
      setTracks(res.data)
    }
  }

  if (loading) {
    return <div></div>
  } else {
    return (
      <div>
        <h2>Favourites</h2>
        <p>
          Click the <QueueMusicIcon></QueueMusicIcon> icon to{' '}
          <strong>remove</strong> a song from your favourites list
        </p>
        <br />

        <h3>Track Listing</h3>
        {tracks.map((track, index) => (
          <Box sx={{ display: 'flex', alignItems: 'center' }} key={index}>
            <QueueMusicIcon
              sx={{
                display: 'block',
                margin: 3,
                verticalAlign: 'middle',
                cursor: 'pointer'
              }}
              onClick={() => {
                deleteTrack(track.id)
              }}
            ></QueueMusicIcon>

            <Card sx={{ flex: '1 0 auto', padding: 2 }}>
              <Typography variant="body1">
                <strong>
                  {track.name} - {(track.duration_ms / 60000).toFixed(2)}
                </strong>
              </Typography>
              <Typography variant="body2" sx={{ marginTop: '10px' }}>
                Artist(s):{' '}
                {track.artists.map((artist, index) => (
                  <Link key={index} to={`/home/artist/${artist.id}`}>
                    {artist.name}
                  </Link>
                ))}
              </Typography>
              <Typography variant="body2" sx={{ marginBottom: '10px' }}>
                {track.name} - {(track.duration_ms / 60000).toFixed(2)}
              </Typography>
              <audio controls src={track.preview_url}></audio>
            </Card>
          </Box>
        ))}
      </div>
    )
  }
}

export default Favourites
