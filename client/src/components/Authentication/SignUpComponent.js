import React from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBInput, MDBAlert,  MDBCard, MDBCardBody, MDBCardFooter } from 'mdbreact';
import LoginComponent from './LoginComponent'
import { formDataToJson } from '../../utilities/utility'
import { signUp } from '../../apis';
import "../../mixed_style.css";

class SignUpComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      toLogIn : false,
      isSignUpConfirmed : false,
      isSignUpConfirmed : false,
      isSignUpError : false,
      signUpError : "",
      isLoading : false
    }
    
    this.handleClick = this.handleClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleClick() {
    this.setState({
      toLogIn: true
    });
 
  }
  handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    this.setState({
          isSignUpError : false,
          isSignUpConfirmed : false,
          isLoading : true
    })
    // converting formData to JSON 
    const formJsonData = formDataToJson(formData)
    signUp(formJsonData).then((response) => {
        this.refs.signUpForm.reset();
        // Now update the state with data that we added
      if(response.data.message == "success"){
// show alert
this.setState({
  isSignUpError : false,
  isSignUpConfirmed : true,
  isLoading : false
})  
      }
      else{
        this.setState({
          isSignUpError : true,
          isSignUpConfirmed : false,
          isLoading : false,
          signUpError : response.data.error
    })
      }
        
    }).catch((err) => {
        e.target.reset();
        // catch error 
        console.log("error : ",err);
        
    })
}
  render() {
    if(this.state.toLogIn){
     return  <LoginComponent></LoginComponent>
    }
    return (
      <MDBContainer>
        <MDBRow>
          <MDBCol middle md="6" className="offset-md-3">
          <MDBCard>
            <MDBCardBody>
              <form onSubmit={this.handleSubmit} ref="signUpForm">
                <p className="h4 text-center py-4">Sign up</p>
                <div className="grey-text">
                  <MDBInput
                    label="First Name"
                    name="first_name"
                    icon="user"
                    group
                    type="text"
                    validate
                    error="wrong"
                    success="right"
                  />
                    <MDBInput
                    label="Last Name"
                    name="last_name"
                    icon="user"
                    group
                    type="text"
                    validate
                    error="wrong"
                    success="right"
                  />
                    <MDBInput
                    label="Age"
                    icon="user-circle"
                    name="age"
                    min="0"
                    group
                    type="number"
                    validate
                    error="wrong"
                    success="right"
                  />
                                      <MDBInput
                    label="Contact Number with country code"
                    icon="phone"
                    name="phone_number"
                    group
                    type="text"
                    validate
                    error="wrong"
                    success="right"
                  />
                  <MDBInput
                    label="Your email"
                    icon="envelope"
                    name="user_name"
                    group
                    type="email"
                    validate
                    error="wrong"
                    success="right"
                  />
                <MDBInput
                    name="user_type"
                    group
                    type="hidden"
                    value="StandardUser"
                    validate
                    error="wrong"
                    success="right"
                  />
                  <div class="form-group">
    <label className="">Gender</label>
    <select className="form-control" name="gender">
      <option value="male">Male</option>
      <option value="female" >Female</option>
      <option value="other">Other</option>
    </select>
  </div>
                </div>
                <div className="text-center py-4 mt-3">
                  <MDBBtn color="cyan" type="submit">
                    Register
                  </MDBBtn>
                </div>
                {
                    this.state.isLoading ? 
                    <div className="d-flex justify-content-center center-spinner">
                         <div class="spinner-border text-primary" role="status" >
        <span class="sr-only">Loading...</span>
      </div>
             </div>:null
                  }
                {this.state.isSignUpConfirmed ?
                    <MDBAlert color="success" dismiss>
                      <strong>Account created Successfully! </strong> Check your mail for temporary password .
                  </MDBAlert>
                    : null
                    }
                                {this.state.isSignUpError ?
                    <MDBAlert color="warning" dismiss>
                      <strong>Failed! </strong> {this.state.signUpError}.
                  </MDBAlert>
                    : null
                    }
              </form>
            </MDBCardBody>
            <MDBCardFooter>
            <div className="text-center grey-text">
              Already have an account ? <a className="cyan-text" onClick={this.handleClick}>Log In</a>
            </div>
            </MDBCardFooter>
          </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    );
  }
}

export default SignUpComponent;