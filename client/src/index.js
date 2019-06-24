import React from "react";

import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Redirect } from 'react-router';

// NAVIGATION
import Nav from "./components/Nav";
import Footer from "./components/Footer";



// PAGES
import Home from "./pages/Home/HomePage";
import About from "./pages/About/AboutPage";
import Sports from "./pages/Sports/SportsPage";
import Military from "./pages/Military/MilitaryPage";
import Contact from "./pages/Contact/ContactPage";
import Login from "./pages/Login/Login";
import LogOutComponent from "./components/Authentication/LogOutComponent"

// Components
import ListUsers from "./components/listUsers/ListUsers"
import Profile from "./components/profile/Profile"

import "./index.css";

// MDReact css
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';

// API
import {verifyUser} from './apis.js'

class Index extends React.Component {
  constructor(props) {
    super();
    console.log(props);
  }
  render() {
    return <div>
    <Nav isAuthenticated={this.props.isAuthenticated} isAdmin ={this.props.isAdmin}/>
    <div className="container">
      <Route exact={true} path="/" component={Home} />
      <Route exaxt path="/about" component={About} />
			<Route exaxt path="/sports" component={Sports} />
 			<Route exact path="/military" component={Military} />
      <Route exact path="/contact" component={Contact} />
      {this.props.isAdmin?<Route exact path="/listUsers" component={ListUsers} /> :null}
      {this.props.isAuthenticated?<React.Fragment><Route exact path="/profile" component={Profile} /><Route exact path="/logout" component={LogOutComponent} /></React.Fragment> :<Route exact path="/login" component={Login} /> }     
      {this.props.isAuthenticated?<Redirect push to="/" />:null}
    </div>
		<Footer />
  </div>
  }
}
// Here we call fetch API to check if user is authenticted or not
verifyUser().then((response)=>{
if(response.data.message=="success"){
  ReactDOM.render(   
    <Router>
    <Index isAuthenticated={true} isAdmin={response.data.isAdmin}/>
  </Router>  
    ,
    document.getElementById('root')        
  );
}
else{
  ReactDOM.render(   
    <Router>
    <Index isAuthenticated={false} isAdmin={false}/>
  </Router>  
    ,
    document.getElementById('root')        
  );
}
}).catch((err)=>{


  ReactDOM.render(   
<h1>Internal Service Error </h1> 
    ,
    document.getElementById('root')        
  );

})

export default Index;
