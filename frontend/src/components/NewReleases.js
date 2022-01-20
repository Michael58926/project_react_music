import React, { useEffect, useState, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import axios from '../config/axios.config.js'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Typography from '@material-ui/core/Typography'
import Chip from '@material-ui/core/Chip'

function NewReleases() {
  const [albums, setAlbums] = useState([])
  const isMounted = useRef(false)
  const history = useHistory()

  useEffect(() => {
    isMounted.current = true

    axios.get('/api/spotify/newreleases').then(({ data: res }) => {
      if (isMounted.current) {
        setAlbums(res.data.albums.items)
      }
    })

    return () => {
      isMounted.current = false
    }
  }, [])

  return (
    <div>
      <h2>New Releases</h2>
      <p>
        Click the <strong>album cover</strong> or <strong>artist name</strong>{' '}
        for more information.
      </p>
      <br />

      <Grid container spacing={2}>
        {albums.map((album, index) => (
          <Grid item xl={3} lg={3} md={4} sm={6} xs={12} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6">{album.name}</Typography>
                <Typography color="text.secondary">New Release</Typography>
              </CardContent>

              <CardMedia
                sx={{ cursor: 'pointer' }}
                component="img"
                image={album.images[0].url}
                onClick={() => {
                  history.push(`/home/album/${album.id}`)
                }}
              />

              <CardContent>
                <Typography>
                  <strong>Release Date: </strong>
                  {album.release_date}
                </Typography>
                <Typography>
                  <strong>Tracks: </strong>
                  {album.total_tracks}
                </Typography>
              </CardContent>

              <CardActions>
                {album.artists.map((artist, index) => (
                  <Chip
                    label={artist.name}
                    key={index}
                    onClick={() => {
                      history.push(`/home/artist/${artist.id}`)
                    }}
                  />
                ))}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  )
}

export default NewReleases
