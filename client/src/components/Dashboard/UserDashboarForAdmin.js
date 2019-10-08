import React from 'react';
import { Redirect } from 'react-router-dom';
import PlayerDetails from '../PlayerDetails/PlayerDetails';
import CumulativeEvents from '../DashboardEventsChart/CumulativeEvents';
import CumulativeEventsAccelerationEvents from '../DashboardEventsChart/CumulativeEventsAccelerationEvents';
import HeadAccelerationEvents from '../DashboardEventsChart/HeadAccelerationEvents';
import { svgToInline } from '../../config/InlineSvgFromImg';
import DarkMode from '../DarkMode';
import Footer from '../Footer';
import 'jquery';
import '../Buttons/Buttons.css';
import './Dashboard.css';
import {
  getUserDetails,
  isAuthenticated,
  getCumulativeEventPressureData,
  getHeadAccelerationEvents,
  getCumulativeEventLoadData,
  getCumulativeAccelerationData,
  getCumulativeAccelerationTimeData
} from '../../apis';
import Spinner from '../Spinner/Spinner';
import { getStatusOfDarkmode } from '../../reducer';


class UserDashboarForAdmin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      user: null,
      isCheckingAuth: true,
      cumulativeEventData: {},
      headAccelerationEventsData: {},
      cumulativeEventLoadData: {},
      cumulativeAccelerationEventData : {},
      cumulativeAccelerationTimeData : {}
    };
    console.log("THIS IS PROPS ",this.props.location)
  }

  componentDidUpdate() {
    svgToInline();
  }

  gotoTop = () => {
    window.scrollTo({ top: '0', behavior: 'smooth' });
  };

  render() {
    const isLoaded = this.state.user;
    if (!this.state.isAuthenticated && !this.state.isCheckingAuth) {
      return <Redirect to="/Login" />;
    }
    if (!isLoaded) return <Spinner />;
    return (
      <React.Fragment>
        <div id="dashboard" className="container dashboard">
          {/*<PlayerDetails user={this.state.user} />*/}
          <div className="row p-4 mb-5 player-details animated fadeInDown ">
            <div className="col-md-6 player-name">
              <p ref="p1">
                Player Name :
                <span>
                  {` ${this.props.location.state.player_name} `}
                </span>
              </p>
              <p ref="p2">
                Player ID :<span>{this.props.location.state.cognito_user_id}</span>
              </p>
            </div>
            </div>

          <CumulativeEventsAccelerationEvents  is_selfie_image_uploaded={this.state.user.is_selfie_image_uploaded} imageUrl={this.state.user.profile_picture_url} loadData={this.state.cumulativeAccelerationTimeData} data={this.state.cumulativeAccelerationEventData}/>
          {/* <CumulativeEvents  is_selfie_image_uploaded={this.state.user.is_selfie_image_uploaded} imageUrl={this.state.user.profile_picture_url} loadData={this.state.cumulativeEventLoadData} data={this.state.cumulativeEventData}/>*/}
          <HeadAccelerationEvents is_selfie_simulation_file_uploaded={this.state.user.is_selfie_simulation_file_uploaded} imageUrl={this.state.user.simulation_file_url} data={this.state.headAccelerationEventsData}/>
          <div className="row text-center pt-5 pb-5 mt-5 mb-5 animated fadeInUp">
            <div className="col-md-12 goto-top d-flex align-items-center justify-content-center position-relative">
              <div
                onClick={this.gotoTop}
                className=" d-flex align-items-center justify-content-center "
              >
                <img src="/img/icon/arrowUp.svg" alt="" />
              </div>
              <p>Back to top</p>
            </div>
          </div>
        </div>
        <DarkMode isDarkMode={this.props.isDarkModeSet} />
        <Footer />
      </React.Fragment>
    );
  }
  componentDidMount() {
      isAuthenticated(JSON.stringify({}))
        .then((value) => {
          if (value.data.message === 'success') {
              getCumulativeAccelerationTimeData({player_id : this.props.location.state.player_name })
              .then(response => {
                  this.setState({
                      cumulativeAccelerationTimeData : { ...this.state.cumulativeAccelerationTimeData, ...response.data.data }
                  });
                    return getCumulativeAccelerationData({player_id : this.props.location.state.player_name })
              })
              .then(response => {

                  this.setState({
                      cumulativeAccelerationEventData : { ...this.state.cumulativeAccelerationEventData, ...response.data.data }
                  });
                    return getCumulativeEventPressureData(JSON.stringify({}))
              })
              .then(response => {
                  console.log(response.data);
                  this.setState({
                      cumulativeEventData : { ...this.state.cumulativeEventData, ...response.data.data }
                  });
                  return getHeadAccelerationEvents(JSON.stringify({}))
              })
              .then(response => {
                  console.log("Head aceleration data",response.data);
                  this.setState({
                      headAccelerationEventsData : { ...this.state.headAccelerationEventsData, ...response.data.data }
                  });
                  return getCumulativeEventLoadData(JSON.stringify({}))
              })
              .then(response => {
                  console.log("Load event data",response.data);
                  this.setState({
                      cumulativeEventLoadData : { ...this.state.cumulativeEventLoadData, ...response.data.data }
                  });
                  {/*return getUserDetails()*/}

                  this.setState({
                    user: response.data.data,
                    isLoading: false,
                    isAuthenticated: true,
                    isCheckingAuth: false
                  });
              })
              .catch((error) => {

                console.log(error);

                this.setState({
                  user: {},
                  isLoading: false,
                  isCheckingAuth: false
                });
              });

          } else {
            this.setState({ isAuthenticated: false, isCheckingAuth: false });
          }
        })
        .catch((err) => {
          this.setState({ isAuthenticated: false, isCheckingAuth: false });
        })
        if (getStatusOfDarkmode().status) {
            document.getElementsByTagName('body')[0].style.background = '#171b25';
        }

    }
}

export default UserDashboarForAdmin;