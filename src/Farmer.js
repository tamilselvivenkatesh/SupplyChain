import React from "react";
// import ReactDOM from "react-dom";
import SupplyChain from "./contracts/SupplyChain.json";
import Web3 from 'web3'


export default class Farmer extends React.Component {
  async componentWillMount() {
    window.ethereum.enable();
    await this.loadWeb3();
    await this.loadBlockchainData();
  }
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    // Network ID
    const networkId = await web3.eth.net.getId()
    const networkData = SupplyChain.networks[networkId]
    if(networkData) {
      this.supply = new web3.eth.Contract(SupplyChain.abi, networkData.address)
      const cropCount = await this.supply.methods.cropCount().call()
      let cropArr = [];
      let crop = [];
      for(let i=0;i<cropCount;i++)
      {
        cropArr.push(await this.supply.methods.cropArr(i).call())
      }
      for(let i=0;i<cropArr.length;i++)
      {
        crop.push(await this.supply.methods.mcrop(cropArr[i]).call())  
      }
      this.setState({crops:crop})
      let farmerArr = [];
      farmerArr.push(await this.supply.methods.mfarmer(this.state.account).call())   
      this.setState({farmerArrs:farmerArr})
      this.setState({isDetailsFilled:this.state.farmerArrs[0].isValue})
    }
  }
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleCropClick = this.handleCropClick.bind(this);
    this.state = {
      farmerID:"",
      farmerName:"",
      farmerAddress:"",
      farmerContact:"",
      cropId:"",
      cropName:"",
      quantity:"",
      cropPrice:"",
      crops: [],
      farmerArrs: [],
      faddr:"",
      isDetailsFilled:false
    };
  }

  handleClick(event) {
    event.preventDefault();
    window.web3.eth.getCoinbase((err, account) => {
    this.setState({account:account})
    this.supply.methods.newFarmer(
        this.state.farmerID,
        this.state.farmerName,
        this.state.farmerContact,
        this.state.farmerAddress).send({ from: account}).then(()=>{ this.setState({ message: "Farmer Details Entered" });  window.location.reload(false);});
      })
    }

  handleCropClick(event) {
    event.preventDefault();
    window.web3.eth.getCoinbase((err, account) => {
    this.setState({account}) 
    this.supply.methods.addCrop(
        this.state.cropID,
        this.state.cropName,
        this.state.quantity,
        this.state.cropPrice).send({ from: account}).then(()=>{ this.setState({ message: "New Crop Added" });  window.location.reload(false);});
      })
    }

  render() {
    return (
      <div className="container container-fluid login-conatiner">
        <div className="col-md-4">
          {this.state.isDetailsFilled ? null:
        <div className="login-form">
            <form method="post" autoComplete="off">
              <h2 className="text-center">Farmer Details</h2>
              <div className="form-group">
                <input
                  type="number" pattern ="[0-9]*" inputmode="numeric"
                  value={this.state.farmerID}
                  onChange={event =>
                    this.setState({ farmerID: event.target.value })
                  }
                  className="form-control"
                  placeholder="ID"
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  value={this.state.farmerName}
                  onChange={event =>
                    this.setState({ farmerName: event.target.value })
                  }
                  className="form-control"
                  placeholder="Name"
                />
              </div>
              <div className="form-group">
                <input
                  type="number" pattern ="[0-9]*" inputmode="numeric"
                  value={this.state.farmerContact}
                  onChange={event =>
                    this.setState({ farmerContact: event.target.value })
                  }
                  className="form-control"
                  placeholder="Contact"
                />
              </div>
               <div className="form-group">
                <input
                  type="text"
                  value={this.state.farmerAddress}
                  onChange={event =>
                    this.setState({ farmerAddress: event.target.value })
                  }
                  className="form-control"
                  placeholder="Address" 
                />
              </div> 
              <div className="form-group">
                <button
                  className="btn btn-primary btn-block"
                  onClick={this.handleClick}
                >
                  Submit
                </button>
              </div>
              {this.state.message && (
                <p className="alert alert-danger fade in">
                  {this.state.message}
                </p>
              )}
              <div className="clearfix" />
            </form>
          </div>}
          <div className="login-form">
            <form method="post" autoComplete="off">
              <h2 className="text-center">Crop Details</h2>
              <div className="form-group">
                <input
                  type="number" pattern ="[0-9]*" inputmode="numeric"
                  value={this.state.cropID}
                  onChange={event =>
                    this.setState({ cropID: event.target.value })
                  }
                  className="form-control"
                  placeholder="ID"
                />
              </div>
              <div className="form-group">
                <input
                 type ="text"
                  value={this.state.cropName}
                  onChange={event =>
                    this.setState({ cropName: event.target.value })
                  }
                  className="form-control"
                  placeholder="Crop Name"
                />
              </div>
              <div className="form-group">
                <input
                  type="number" pattern ="[0-9]*" inputmode="numeric"
                  value={this.state.quantity}
                  onChange={event =>
                    this.setState({ quantity: event.target.value })
                  }
                  className="form-control"
                  placeholder="Quantity"
                />
              </div>
              <div className="form-group">
                <input
                  type="number" pattern ="[0-9]*" inputmode="numeric"
                  value={this.state.cropPrice}
                  onChange={event =>
                    this.setState({ cropPrice: event.target.value })
                  }
                  className="form-control"
                  placeholder="Price"
                />
              </div>
              <div className="form-group">
                <button
                  className="btn btn-primary btn-block"
                  onClick={this.handleCropClick}
                >
                  Submit
                </button>
              </div>
              {this.state.message && (
                <p className="alert alert-danger fade in">
                  {this.state.message}
                </p>
              )}
              <div className="clearfix" />
            </form>
          </div>
        </div>

        <div className="col-md-6 col-md-offset-2">
          <div className="c-list">
            <h2 className="text-center">Crop Records</h2>
            <table class="table table-bordered table-dark table-striped">
              <thead>
              <tr>
                  <th>Crop ID</th>
                  <th>Crop Name</th>
                  <th>Quantity</th>
                  <th>Crop Price</th>
              </tr>
              </thead>
              <tbody>
                {this.state.crops.map((crop)=>{
                 return(crop.faddr === this.state.account && crop.isBought===false ?
                   <tr>
                     <td>{crop.cropID}</td>
                     <td>{crop.cropName}</td>
                     <td>{crop.quantity}</td>
                     <td>{crop.cropPrice}</td>
                   </tr>: null 
                 )
                })}
              </tbody>
            </table>
            <h2 className="text-center">Farmer Record</h2>
            <table class="table table-bordered table-dark table-striped">
              <thead>
              <tr>
                  <th>Farmer ID</th>
                  <th>Farmer Name</th>
                  <th>Farmer Address</th>
                  <th>Farmer Contact</th>
                </tr>
              </thead>
              <tbody>
                {this.state.farmerArrs.map((record)=>{
                 return(
                   <tr>
                     <td>{record.farmerID}</td>
                     <td>{record.farmerName}</td>
                     <td>{record.farmerAddress}</td>
                     <td>{record.farmerContact}</td>
                   </tr>
                 ) 
                })}
              </tbody>
            </table>
          
          </div>
        </div>
      </div>
    );
  }
}
