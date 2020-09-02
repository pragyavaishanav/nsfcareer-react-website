import React from 'react';
import { getStatusOfDarkmode } from '../../reducer';
import SignatureCanvas from 'react-signature-canvas'
import Footer from '../Footer';

import { uploadProfilePic } from '../../apis';

import Spinner from '../Spinner/Spinner';
import { formDataToJson } from '../../utilities/utility';
import {
  Link,
  Redirect
} from "react-router-dom";
import { 
    UncontrolledAlert
} from 'reactstrap';
import camera from './camera.png';
import CameraPopup from '../Popup/CameraPopup';
import axios from 'axios';


let sigPad = {};
class ProfileImageUpload extends React.Component {

    constructor(props){
        super(props);
        let search = window.location.search;
        let params = new URLSearchParams(search);

        let token = params.get('key') ;
        if(!token){
            token = '';
        }
        this.state = {
            consent_token : token,
            consent_user : {},
            error : '',
            message : '',
            isGuardianSigned : false,
            isDisplay2: { display: 'none' },
            isDeskTop: false,
            selectedFile: '',
            userData: '',
            Redirect: false
        }
    }

  componentWillMount() {
    if(window.innerWidth > 480){
      this.setState({
        isDeskTop: true
      })
     }
  }

  onChangeHandler2 = (event) => {
      event.persist();
      this.setState({
          selectedFile: event.target.files[0]
      });
      console.log('file',event.target.files[0])
      this.onClickHandler2(event.target.files[0]);
  };

  onClickHandler2 = (profile_pic) => {
      const data = new FormData();
      this.setState({
          isFileBeingUploaded: true,
          isUploading: true,
          isFileUploaded: false,
          fileUploadError: '',
      });
      var user_id = '';
     
      if(this.state.userData){
        user_id = this.state.userData.user_cognito_id ;
      }else{
        this.setState({Redirect: true})
      }
      console.log(this.state.userData.user_cognito_id)
      data.append('profile_pic', profile_pic);
      data.append('user_cognito_id', user_id);
      uploadProfilePic(data)
      .then((response) => {
          console.log(response);
          if (response.data.message === 'success') {
            this.setState({ isUploading: false, isUpdated : true});
            var the = this;
            setTimeout(function(){
              the.setState({Redirect: true});
            }, 2000)
          } else {
            this.setState({ isUploading: false, Error : "Internal Server Error : Failed to upload Selfie !"});
          }
      })
      .catch((err) => {
          console.log(err);
          this.setState({ isUploading: false, Error : "Internal Server Error : Failed to upload Selfie !"});
      });
    };

  componentDidMount() {
    // API to get the details of user whose consent is being approves
    console.log(this.props.location)
    var userData = this.props.location;
    if(userData.state){
      this.setState({userData:userData.state.message})
    }else{
      this.setState({Redirect: true});
    }
  }

  handleCameraPopup = (e) =>{
        console.log('delete',e)
        this.setState({DelData: {type: 'team',data:e} })
        if (this.state.isDisplay2.display === 'none') {
          this.setState({ isDisplay2: {display:'flex'} });
        } else {
          this.setState({ isDisplay2: {display:'none'} });
        }
    }
  makeVisible2 = (data) => {
      this.setState({ isDisplay2: data });
  }
  handleFormSubmit = (e) => {
    e.preventDefault();
  }
  isUpdateData = (data) =>{
    console.log('isUpdateData',data);
    var file = data.dataUri;
    var the = this;
    if(file){
     fetch(file)
      .then(function(res){return res.arrayBuffer();})
      .then(function(buf){
        return new File([buf], 'img',{type:'image/png'});
      }).then(res =>{
        console.log(res)
        if(res){
          the.onClickHandler2(res);
        }
      })
    }
  }
  updateSignature = (e) =>{
      console.log(e);
  }
  render() {
    console.log("Props are - ", this.props);
    if(this.state.Redirect){
      return <Redirect to="/Dashboard" />;
    }
    return (
      <React.Fragment>
        <CameraPopup isVisible2={this.state.isDisplay2}  makeVisible2={(this.props.makeVisible2)? this.props.makeVisible2 : this.makeVisible2} isUpdateData={(this.props.isUpdateData)? this.props.isUpdateData : this.isUpdateData}  />
        <div className="container-fluid pl-0 pr-0 overflow-hidden">
          <div style={{ padding : "4% 0% 5% 0%"}} className="row singup">
            <div className="col-md-6 col-lg-6 offset-md-3 mb-5">
              <div className="text-center">
                <p style={{  fontSize: "34px",
                  fontWeight: "900"}} className="top-heading__login animated fadeInUp">
                 Thanks for registering!
                </p>
                <p className="h4 p_h4" style={{'padding': '13px 0px'}}>
                  We create custom computer models if each person.
                </p>
                <p className="h4 p_h4">
                  To do this we need a profile picture. You can skip this step, you just will not have a custom model of your head.
                </p>
              </div>
              <div className="col-md-12">
                <div className="row">
                  <div className="col-md-12" style={{'marginTop': '15px'}}>
                   {this.state.isUploading ? (
                      <div className="d-flex justify-content-center center-spinner">
                          <div
                              className="spinner-border text-primary"
                              role="status"
                              >
                              <span className="sr-only">Uploading...</span>
                          </div>
                      </div>
                  ) : null}
                  {this.state.isUpdated ? (
                      <UncontrolledAlert
                          color="success"
                          style={{ marginTop: '5px' }}
                          >
                        Uploaded successfully.
                      </UncontrolledAlert>
                  ) : null}
                  {this.state.Error ? (
                      <UncontrolledAlert
                          style={{ marginTop: '5px' }}
                          color="danger"

                          >
                          {this.state.Error}

                      </UncontrolledAlert>
                  ) : null}
                  {this.state.isDeskTop ? 
                    <React.Fragment>
                      <label className="btn profile-picture-btn" for="file_profile" > <img src={camera} className="profileCameraIcon" />  Upload Photo</label>
                      <input
                        onChange={this.onChangeHandler2}
                        type="file"
                        name="file_profile"
                        id="file_profile"
                        style = {{
                            display : "none"
                        }}
                      />
                    </React.Fragment>
                    : 
                    <React.Fragment>
                      <button className="btn profile-picture-btn" onClick={this.handleCameraPopup} > <img src={camera} className="profileCameraIcon" /> Take Profile</button>
                      
                    </React.Fragment>
                  }
                   <Link to="/Login"> <button className="btn singup-cancel-btn">Skip For Now</button></Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {this.state.isLoading ? (
          <div className="d-flex justify-content-center center-spinner">
            <div className="spinner-border text-primary" role="status">
              <span  className="sr-only">Approving Consent !!...</span>
            </div>
          </div>
        ) : null}
        <Footer />
      </React.Fragment>
  );
}
}

export default ProfileImageUpload;
