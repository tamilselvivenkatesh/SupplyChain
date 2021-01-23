import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route,Redirect } from "react-router-dom";
import './index.css'
import Farmer from './Farmer';
import Distributor from './Distributor';
import Retailer from './Retailer';
import Consumer from './Consumer';
import Landlord from './Landlord';


const FullApp = () => (
  <Router>
    <div>
    <header className="App-header">
          <h1 className="App-title text-center">SupplyChain</h1>
          <a href="/"><input type="button" value="Home" class="btn btn-primary" style={{color:"white",backgroundColor:"rgb(103, 3, 143)"}}/></a>
    </header>
      <Route exact path="/" component={App} />
      <Route path="/Landlord" component={Landlord} />
      <Route path="/Farmer" component={Farmer} />
      <Route path="/Distributor" component={Distributor} />
      <Route path="/Retailer" component={Retailer} />
      <Route path="/Consumer" component={Consumer} />

    </div>
  </Router>
);
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user:'',
      password:'',
      login:false
    }
  }
  componentDidMount(){
    window.ethereum.enable();
  }
  render() {
    return (
      <div className="container container-fluid login-conatiner">
      {this.state.login ? this.state.user === "" ? this.state.password === "farmer" ?<Redirect to="/Farmer" /> :
      this.state.password === "landlord" ?<Redirect to="/Landlord" /> :
     this.state.password === "distributor" ?<Redirect to="/Distributor" /> :
      this.state.password === "retailer"? <Redirect to="/Retailer" />:
      this.state.password === "consumer"? <Redirect to="/Consumer" />:null:null:null}
<div style={{
                    maxWidth: '300px',
                    margin: '0 auto' }}>
                    <div className="login-form">
                        <form method="post">
                        <h2 className="text-center">Log in</h2>

  <div className="form-group">

          <select id="selection"  className="form-control">
            <option selected>Select Mode..</option>
            <option>Landlord</option>
            <option>Farmer</option>
            <option>Distributor</option>
            <option>Retailer</option>
            <option>Consumer</option>
          </select>
</div>
<div className="form-group">

          <input type="password"  className="form-control" placeholder="Password" onChange={e => this.setState({password:e.target.value})}  ></input></div>
          <div className="form-group">

          <button className="btn btn-success btn-block but" onClick={()=> this.setState({login:true})} >Submit</button></div>
          <div className="clearfix">
                            </div>
                        </form>
        </div>
      </div>
      </div>
    );
  }
}

ReactDOM.render(<FullApp />, document.getElementById('root'));
