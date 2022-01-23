import React, { useEffect, useState, useRef } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import axios from '../config/axios.config.js'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import Box from '@material-ui/core/Box'
import Chip from '@material-ui/core/Chip'
import Snackbar from '@material-ui/core/Snackbar'
import Button from '@material-ui/core/Button'
import QueueMusicIcon from '@material-ui/icons/QueueMusic'

function Album() {
  const [album, setAlbum] = useState({})
  const [favourites, setFavourites] = useState([])
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const isMounted = useRef(false)
  const history = useHistory()
  const { id: albumid } = useParams()

  useEffect(() => {
    isMounted.current = true

    let userid = JSON.parse(sessionStorage.getItem('user'))._id
    axios
      .get(`/api/spotify/album/${albumid}`)
      .then(({ data: res }) => {
        if (isMounted.current) {
          setAlbum(res.data)
        }
        return axios.get(`/api/spotify/${userid}/favourite/all`)
      })
      .then(({ data: res }) => {
        if (isMounted.current) {
          setFavourites(res.data)
          setLoading(false)
        }
      })

    return () => {
      isMounted.current = false
    }
  }, [loading, albumid])

  const addTrack = async function (trackid) {
    let userid = JSON.parse(sessionStorage.getItem('user'))._id
    let track = favourites.find((item) => {
      return item.id === trackid
    })

    if (!track) {
      let { data: res } = await axios.post(
        `/api/spotify/${userid}/favourite/${trackid}`,
        {}
      )
      if (isMounted.current) {
        setFavourites(res.data)
        setMessage('Adding to Favourites...')
        setOpen(true)
      }
    } else {
      if (isMounted.current) {
        setMessage('Already in Favourites')
        setOpen(true)
      }
    }
  }

  const handleClose = (reason) => {
    if (reason === 'clickaway') {
      return
    }

    setOpen(false)
  }

  const action = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={handleClose}>
        DONE
      </Button>
    </React.Fragment>
  )

  if (loading) {
    return <div></div>
  } else {
    return (
      <div>
        <h2>{album.name}</h2>
        <p>
          Click the <QueueMusicIcon></QueueMusicIcon> icon to{' '}
          <strong>add</strong> a song to your favourites list
        </p>
        <br />
        <Card sx={{ display: 'flex', paddingTop: 5, paddingBottom: 5 }}>
          <Grid container>
            <Grid item>
              <CardMedia
                component="img"
                sx={{
                  width: 280,
                  marginLeft: 5,
                  marginRight: 5,
                  marginBottom: 5
                }}
                image={album.images[1].url}
              />
            </Grid>
            <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
              <Box sx={{ marginLeft: 5, marginRight: 5 }}>
                <strong>Record Label: </strong> {album.label}
                <br />
                <strong>Release Date: </strong> {album.release_date}
                <br />
                <br />
                <strong>Tracks:</strong> {album.total_tracks}
                <br />
                <strong>Popularity: </strong> {album.popularity}
                <br />
                <br />
                {album.artists.map((artist, index) => (
                  <Chip
                    label={artist.name}
                    key={index}
                    onClick={() => {
                      history.push(`/home/artist/${artist.id}`)
                    }}
                  />
                ))}
                <br />
                <br />
                {album.copyrights.map((copyright, index) => (
                  <div key={index}>{copyright.text}</div>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Card>
        <br />
        <h2>Track Listing</h2>
        {album.tracks.items.map((item, index) => (
          <Box sx={{ display: 'flex', alignItems: 'center' }} key={index}>
            <QueueMusicIcon
              sx={{
                display: 'block',
                margin: 2,
                verticalAlign: 'middle',
                cursor: 'pointer'
              }}
              onClick={() => {
                addTrack(item.id)
              }}
            ></QueueMusicIcon>

            <Card sx={{ flex: '1 0 auto', padding: 2 }}>
              <p>
                {item.track_number}: {item.name} -{' '}
                {(item.duration_ms / 60000).toFixed(2)}
              </p>
              <audio controls src={item.preview_url}></audio>
            </Card>
          </Box>
        ))}

        <div>
          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center'
            }}
            open={open}
            autoHideDuration={2000}
            onClose={handleClose}
            message={message}
            action={action}
          />
        </div>
      </div>
    )
  }
}

export default Album
