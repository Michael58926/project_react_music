import React, { useEffect, useState, useRef } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import axios from '../config/axios.config.js'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'

function Artist() {
  const [artist, setArtist] = useState({})
  const [albums, setAlbums] = useState([])
  const [loading, setLoading] = useState(true)
  const isMounted = useRef(false)
  const history = useHistory()
  const { id: artistid } = useParams()

  useEffect(() => {
    isMounted.current = true

    axios
      .get(`/api/spotify/artist/${artistid}`, {})
      .then(({ data: res }) => {
        if (isMounted.current) {
          setArtist(res.data)
        }
        return axios.get(`/api/spotify/albums/${artistid}`)
      })
      .then(({ data: res }) => {
        let albumsData = res.data.items.filter((item, index) => {
          let found = false
          for (let i = 0; i < index; i++) {
            if (item.name === res.data.items[i].name) {
              found = true
              break
            }
          }
          return !found
        })

        if (isMounted.current) {
          setAlbums(albumsData)
          setLoading(false)
        }
      })

    return () => {
      isMounted.current = false
    }
  }, [loading, artistid])

  if (loading) {
    return <div></div>
  } else {
    return (
      <div>
        <h2>{artist.name}</h2>
        <p>
          Click the <strong>album cover</strong> for more information.
        </p>
        <Card>
          <CardMedia
            component="img"
            image={artist.images[0].url}
            height="500"
          />
        </Card>
        <br />
        <h2>Full Discography</h2>
        <Grid container spacing={2}>
          {albums.map((album, index) => (
            <Grid item xl={2} lg={3} md={4} sm={6} xs={6} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{album.name}</Typography>
                  <Typography color="text.secondary">Album Title</Typography>
                </CardContent>

                <CardMedia
                  component="img"
                  image={album.images[0].url}
                  sx={{ cursor: 'pointer' }}
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
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    )
  }
}

export default Artist
