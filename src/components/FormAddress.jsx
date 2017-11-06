import React, { Component } from 'react';
import { connect } from 'react-redux';
import { preProcessPlace } from 'utils/parseAddress';
import { GOOGLE_API_KEY } from 'settings/variables';
import { setAddress } from 'actions/address';

const defaultState = {
  index: null,
  street: '',
  ward: '',
  district: '',
  city: '',
  country: '',
  validateString: null,
  isNew: true,
}

class FormAddress extends Component {
  constructor(props) {
    super(props);
    this.state = defaultState;
  }

  componentDidMount() {
    this.initGoogleApiInput();
  }

  componentWillReceiveProps(nextProps) {
    const { address } = nextProps;
    if(!!address)
      return this.setState({...address, isNew: false});
    return this.setState({isNew: true})
  }

  initGoogleApiInput = () => {
    window.initAutocomplete = () => {
      window.autocomplete = new window.google.maps.places.Autocomplete(
          /** @type {!HTMLInputElement} */(this.refs.location),
          {types: ['geocode']});
      window.autocomplete.addListener('place_changed', this.changeLocation);
    }

    const scriptElement = document.createElement('script');
    scriptElement.type = 'text/javascript';
    scriptElement.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places&callback=initAutocomplete`;

    document.body.appendChild(scriptElement);
  }

  getCurrentPosition = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.getCurrSuccess, this.getCurrError);
    }
  }

  getCurrSuccess = (position) => {
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;

    const geocoder = new window.google.maps.Geocoder();
    const self = this;
    
    var latlng = new window.google.maps.LatLng(lat, lng);
    geocoder.geocode({'latLng': latlng}, function(results, status) {
      if (status == window.google.maps.GeocoderStatus.OK) {
        if (results[1]) {
          const place = results[0].formatted_address;
          self.refs.location.value = place;
          self.setState(preProcessPlace(results[0]));
        } else {
          alert('No results found');
        }
      } else {
        alert('Geocoder failed due to: ' + status);
      }
    });
  }

  getCurrError = () => {
    alert('Can not get current position');
  }

  changeLocation = () => {
    const place = window.autocomplete.getPlace();
    this.setState(preProcessPlace(place));
  }

  handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { street, ward, district, city, country, index } = this.state;
    const { dataSize } = this.props;

    if(!street.trim()) return this.setState({validateString: 'Enter the street!'}); 

    if(!city.trim()) {
      if (!ward.trim() && !district.trim()) {
        return this.setState({validateString: 'Enter the both ward and district or the city!'});
      } else if (!ward.trim() || !district.trim()) {
        return this.setState({validateString: 'Enter the both ward and district'});
      }
    }     

    const newIndex = index !== null ? index : dataSize;
    this.props.dispatch(setAddress({index, street, ward, district, city, country}, newIndex));
    this.resetState();
  }


  resetState = () => {
    this.props.clearCurrAddress();
    this.setState(defaultState);
  }

  handleChange = (attr, e) => {
    this.setState({[attr]: e.target.value});
  }

  render() {
    const { isNew, street, ward, district,
            city, country, validateString } = this.state;

    return(
      <div>
        <form>
          <div className="form-row">
            <div className="col-sm-6 col-xs-12">
              <div className="form-group has-danger">
                <label className="control-label form-control-label">Street</label>
                <input type="text" className="form-control"
                  placeholder="Street" ref="streetName" value={street}
                  onChange={this.handleChange.bind(this, 'street')}/>
              </div>
              <div className="form-group">
                <label className="control-label">Ward</label>
                <input type="text" className="form-control"
                  placeholder="Ward" ref="ward" value={ward}
                  onChange={this.handleChange.bind(this, 'ward')}/>
              </div>
            </div>
            <div className="col-sm-6 col-xs-12">
              <div className="form-group">
                <label className="control-label">District</label>
                <input type="text" className="form-control"
                  placeholder="District" ref="district" value={district}
                  onChange={this.handleChange.bind(this, 'district')}/>
              </div>
              <div className="form-group">
                <label className="control-label">City</label>
                <input type="text" className="form-control" placeholder="City" ref="city" value={city}
                  onChange={this.handleChange.bind(this, 'city')}/>
              </div>
            </div>
            <div className="col-sm-12">
              <div className="form-group">
                <label className="control-label">Country</label>
                <input type="text" className="form-control col-sm-12" 
                  placeholder="Country" ref="country" value={country}
                  onChange={this.handleChange.bind(this, 'country')}/>
              </div>
            </div>
            <div className="col-sm-12">
              <div className="form-group">
                <label className="control-label">Find location</label>
                <input type="text" className="form-control"
                  ref="location"/>
              </div>
            </div>
            <div className="col-sm-12">
              <div className="form-group">
                <button className="btn btn-primary" onClick={this.getCurrentPosition}>
                  Get current position
                </button>
              </div>
            </div>
            {!!validateString && <div className="col-sm-12 bd-example">
              <div className="alert alert-danger">
                {this.state.validateString}
              </div>
            </div>}
            <div className="col-sm-6 col-xs-12">
              <div className="form-group">
                <button className="btn btn-primary" onClick={this.handleSubmit}>
                  <i className={`fa fa-${isNew ? 'plus' : 'save'}`}/>
                  {isNew ? 'Add' : 'Update'}
                </button>
              </div>
            </div>
            {!isNew &&
              <div className="col-sm-6 col-xs-12">
                <div className="form-group">
                <button className="btn btn-primary" onClick={this.resetState}>
                  <i className="fa fa-plus"/>
                  New Address
                </button>
                </div>
              </div>
            }
            <div className="col-sm-12 bd-example">
              <ul className="alert alert-warning">
                <li>- "street" is always required</li>
                <li>- if "city" is present, then "ward" and "district" are not required</li>
                <li>- if "city" is not present, then both "ward" and "district" are required</li>
              </ul>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

export default connect()(FormAddress);
