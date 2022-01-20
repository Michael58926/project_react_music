import React, { useState } from 'react'
import { Switch, Route, Redirect, useHistory } from 'react-router-dom'
import NewReleases from '../components/NewReleases.js'
import Artist from '../components/Artist.js'
import Album from '../components/Album.js'
import SearchResult from '../components/SearchResult.js'
import Favourites from '../components/Favourites.js'
import NotFound from '../components/NotFound.js'

import { styled, useTheme } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Drawer from '@material-ui/core/Drawer'
import CssBaseline from '@material-ui/core/CssBaseline'
import MuiAppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'

import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import LibraryMusicIcon from '@material-ui/icons/LibraryMusic'
import FavoriteIcon from '@material-ui/icons/Favorite'
import PersonIcon from '@material-ui/icons/Person'
import SearchIcon from '@material-ui/icons/Search'

const drawerWidth = 240

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      }),
      marginLeft: 0
    })
  })
)

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}))

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end'
}))

function Home() {
  const [open, setOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const barOpen = Boolean(anchorEl)
  const [searchString, setSearchString] = useState('')
  const history = useHistory()
  const theme = useTheme()
  const username = JSON.parse(sessionStorage.getItem('user')).username

  const handleDrawerOpen = function () {
    setOpen(true)
  }

  const handleDrawerClose = function () {
    setOpen(false)
  }

  const handleBarOpen = function (event) {
    setAnchorEl(event.currentTarget)
  }
  const handleBarClose = function () {
    setAnchorEl(null)
  }

  const handleSearch = function (e) {
    e.preventDefault()
    history.push(`/home/search?search=${searchString}`)
  }

  const handleLogout = function () {
    setAnchorEl(null)
    sessionStorage.removeItem('token')
    history.push('/login')
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Galaxy Music
          </Typography>

          <Button
            color="inherit"
            style={{ textTransform: 'none' }}
            sx={{ fontSize: '1rem' }}
            id="basic-button"
            aria-controls="basic-menu"
            aria-haspopup="true"
            aria-expanded={barOpen ? 'true' : undefined}
            startIcon={<PersonIcon />}
            onClick={handleBarOpen}
          >
            {username}
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={barOpen}
            onClose={handleBarClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button'
            }}
          >
            <MenuItem onClick={handleLogout}>Log out</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box'
          }
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem>
            <form onSubmit={handleSearch}>
              <TextField
                variant="standard"
                sx={{ width: '100%' }}
                label="Artist"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon />
                    </InputAdornment>
                  )
                }}
                value={searchString}
                onChange={(e) => setSearchString(e.target.value)}
              />
            </form>
          </ListItem>

          <ListItem
            button
            key="New Releases"
            onClick={() => {
              history.push('/home/newreleases')
            }}
          >
            <ListItemIcon>
              <LibraryMusicIcon />
            </ListItemIcon>
            <ListItemText primary="New Releases" />
          </ListItem>

          <ListItem
            button
            key="Favourites"
            onClick={() => {
              history.push('/home/favourites')
            }}
          >
            <ListItemIcon>
              <FavoriteIcon />
            </ListItemIcon>
            <ListItemText primary="Favourites" />
          </ListItem>
        </List>
        <Divider />
      </Drawer>

      <Main open={open} sx={{ backgroundColor: '#fafafa' }}>
        <DrawerHeader />
        <Switch>
          <Route exact path="/home">
            <Redirect to="/home/newreleases" />
          </Route>
          <Route exact path="/home/newreleases">
            <NewReleases />
          </Route>
          <Route exact path="/home/artist/:id">
            <Artist />
          </Route>
          <Route exact path="/home/album/:id">
            <Album />
          </Route>
          <Route exact path="/home/search">
            <SearchResult />
          </Route>
          <Route exact path="/home/favourites">
            <Favourites />
          </Route>
          <Route>
            <NotFound />
          </Route>
        </Switch>
      </Main>
    </Box>
  )
}

export default Home
