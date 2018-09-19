import React, { Fragment,Component } from 'react'
import escapeRegExp from 'escape-string-regexp'
import axios from 'axios';

import FilterMenu from './Components/FilterMenu.js'
import Map from './Components/Map'
import './App.css'

  const locations = [
    {title: 'Bacchanal Fine Wine & Spirits', location: {lat: 29.9598,lng: -90.0332}, id: 0},
    {title: 'Bourbon Street', location: {lat: 29.9540,lng: -90.0698}, id: 1},
    {title: 'Lafayette Cemetery No. 1', location: {lat: 29.9288,lng: -90.0854}, id: 2},
    {title: 'Cafe Du Monde', location: {lat: 29.9574,lng: -90.0618}, id: 3},
    {title: 'Ace Hotel', location: {lat: 29.9483,lng: -90.0719}, id: 4},
    {title: 'Preservation Hall', location: {lat: 29.9583,lng: -90.0654}, id: 5}
  ]

class App extends Component {
  state = {
    filterMenuIsOpen: true,
    getWidth: window.innerWidth,
    searchfield: '',
    showLocations: [...locations],
    chosenLocation: 0,
    markers: [],
    axiosTest: []
  }

  componentDidMount = () => {
    axios.get( `https://jsonplaceholder.typicode.com/posts/1`/*, {params: {
      id: KEY
    }} */ )
      .then(response => {
        // console.log(response);
        this.setState({ axiosTest: response.data });
      })
      .catch(error => console.log(error))

    window.addEventListener('resize', this.updateWindowDimensions);
    this.updateWindowDimensions();
    }

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions = () => {
    this.setState({ getWidth: window.innerWidth });
  }

  toggleFilterMenu = () => {
    this.setState(currentState => ({
      filterMenuIsOpen: !currentState.filterMenuIsOpen
    }))
  }

  updateSearch = search => {
    this.setState({ searchfield: search })
    this.getLocations(search)
  }

  getLocations = (search) => {
    if (search){
      const match = new RegExp(escapeRegExp(search), 'i')
      this.setState({ showLocations: locations.filter(location=>match.test(location.title)) })
    } else {
      this.setState({ showLocations: locations })
    }
    // console.log(this.state.showLocations);
  }

  updateChosenLocation = (id) => {
    this.setState({ chosenLocation: id})
    // console.log('chosen loc working:' + this.state.chosenLocation)
  }

  getMarkers = (markersFromMap) => {
    this.setState({ markers: markersFromMap })
  }

  animateMarkerFromList = e => {
    let selectedMarker = this.state.markers[e.target.id];

    if (e.target.id) {
      this.animateMarker(selectedMarker)
    }
  }

  animateMarker = (marker) => {
    marker.setAnimation(window.google.maps.Animation.BOUNCE);
    setTimeout(() => {
      marker.setAnimation(null);
    }, 1500);
  }

  render() {
    console.log(this.state.axiosTest);

    return (
      <Fragment>
        <header>
          <h1 className="title"><span>New Orleans</span><br />Neighborhood Map</h1>
        </header>
        <div className="wrapper">
          <FilterMenu
            filterMenuIsOpen={this.state.filterMenuIsOpen}
            onToggleFilterMenu={this.toggleFilterMenu}
            screenWidth={this.state.getWidth}
            onUpdateSearch={this.updateSearch}
            value={this.state.searchfield}
            onGetLocations={this.getLocations}
            showLocations={this.state.showLocations}
            updateChosenLocation={this.updateChosenLocation}
            markers={this.state.markers}
            animateMarker={this.animateMarkerFromList}
            foursquareData={this.state.axiosTest}
          />
          <Map
            locations={locations}
            chosenLocation={this.state.chosenLocation}
            getMarkers={this.getMarkers}
            animateMarker={this.animateMarker}
          />
        </div>
      </Fragment>
    )
  }
}

export default App;
