import React, { useEffect, useState, useRef } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import queryString from 'query-string'
import axios from '../config/axios.config.js'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'

function SearchResult() {
  const [artists, setArtists] = useState([])
  const isMounted = useRef(false)
  const history = useHistory()
  const location = useLocation()
  const searchString = queryString.parse(location.search).search

  useEffect(() => {
    isMounted.current = true

    axios
      .get(`/api/spotify/artists?search=${searchString}`)
      .then(({ data: res }) => {
        let artistsData = res.data.artists.items.filter((item) => {
          return item.images.length > 0
        })
        if (isMounted.current) {
          setArtists(artistsData)
        }
      })

    return () => {
      isMounted.current = false
    }
  }, [searchString])

  return (
    <div>
      <h2>Result for: {searchString}</h2>
      <p>
        Click the <strong>album cover</strong> or <strong>artist name</strong>{' '}
        for more information.
      </p>
      <br />
      <Grid container spacing={2}>
        {artists.map((artist, index) => (
          <Grid item xl={3} lg={3} md={4} sm={6} xs={12} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6">{artist.name}</Typography>
                <Typography color="text.secondary">Artist</Typography>
              </CardContent>

              <CardMedia
                sx={{ cursor: 'pointer' }}
                component="img"
                image={artist.images[0].url}
                onClick={() => {
                  history.push(`/home/artist/${artist.id}`)
                }}
              />

              <CardContent>
                <Typography>
                  <strong>Followers: </strong>
                  {artist.followers.total}
                </Typography>
                <Typography>
                  <strong>Popularity: </strong>
                  {artist.popularity}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  )
}

export default SearchResult
