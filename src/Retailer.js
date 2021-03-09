import React from "react";
import SupplyChain from "./contracts/SupplyChain.json";
import Web3 from 'web3'


export default class Distributor extends React.Component {
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
      const retailCropCount = await this.supply.methods.retailCropCount().call()

      let cropArr = [];
      let crop = [];
      let retailArr =[];
      let retail=[];
      for(let i=0;i<retailCropCount;i++)
      {
        retailArr.push(await this.supply.methods.retailArr(i).call())
      }
      for(let i=0;i<retailArr.length;i++)
      {
        retail.push(await this.supply.methods.mcrop(retailArr[i]).call())  
      }
      this.setState({retails:retail})
      for(let i=0;i<cropCount;i++)
      {
        cropArr.push(await this.supply.methods.cropArr(i).call())
      }
      for(let i=0;i<cropArr.length;i++)
      {
        crop.push(await this.supply.methods.mcrop(cropArr[i]).call())  
      }
      this.setState({crops:crop})
      let retailerArr = [];
      retailerArr.push(await this.supply.methods.mretail(this.state.account).call())   
      this.setState({retailerArrs:retailerArr})
      this.setState({isDetailsFilled:this.state.retailerArrs[0].isValue})
    }
  }
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handlePurchase = this.handlePurchase.bind(this);
    this.state = {
      retailID:"",
      retailName:"",
      retailAddress:"",
      retailContact:"",
      cropID:"",
      cropName:"",
      quantity:"",
      cropPrice:"",
      crops: [],
      retails: [],
      retailerArrs: [],
      raddr:"",
      isDetailsFilled:false,
      isBought:false,
      isBoughtByRetailer:false,
    };
  }

  handleClick(event) {
    event.preventDefault();
    window.web3.eth.getCoinbase((err, account) => {
    this.setState({account:account})
    this.supply.methods.addRetail(
        this.state.retailID,
        this.state.retailName,
        this.state.retailContact,
        this.state.retailAddress).send({ from: account}).then(()=>{ this.setState({ message: "Retailer Details Entered" });  window.location.reload(false);});
      })
    }


    handlePurchase(event) {
       event.preventDefault();
       let id=event.target.value;
      // console.log(id);
      window.web3.eth.getCoinbase((err, account) => {
      this.setState({account}) 
      this.supply.methods.retailAddCrop(id).send({ from: account}).then(()=>{ this.setState({ message: "New Crop Added" });  window.location.reload(false);});
        })
       }

  render() {
    return (
      <div className="container container-fluid login-conatiner">
        <div>
          {this.state.isDetailsFilled ? null:
        <div className="login-form">
            <form method="post" autoComplete="off">
              <h2 className="text-center">Retailer Details</h2>
              <div className="form-group">
                <input
                  type="number" pattern ="[0-9]*" inputmode="numeric"
                  value={this.state.retailID}
                  onChange={event =>
                    this.setState({ retailID: event.target.value })
                  }
                  className="form-control"
                  placeholder="ID"
                />
              </div>
              <div className="form-group">
                <input
                  type="text" 
                  value={this.state.retailName}
                  onChange={event =>
                    this.setState({ retailName: event.target.value })
                  }
                  className="form-control"
                  placeholder="Name"
                />
              </div>
              <div className="form-group">
                <input
                  type="number" pattern ="[0-9]*" inputmode="numeric"
                  value={this.state.retailContact}
                  onChange={event =>
                    this.setState({ retailContact: event.target.value })
                  }
                  className="form-control"
                  placeholder="Contact"
                />
              </div>
               <div className="form-group">
                <input
                  type="text"
                  value={this.state.retailAddress}
                  onChange={event =>
                    this.setState({ retailAddress: event.target.value })
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
         </div>

        <div className="col-md-12">
          <div className="c-list">
            {/* Crop Records */}
            {this.state.isDetailsFilled ?
  <button type="button" class="btn btn-success pull-right btn-lg" data-toggle="modal" data-target="#myModal1">Crop Record</button> : null }
  <div class="modal fade" id="myModal1" role="dialog">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Crop Record</h4>
        </div>
        <div class="modal-body">
          {
           <table class="table table-bordered table-dark table-striped">
           <thead>
           <tr>
               <th>Crop ID</th>
               <th>Crop Name</th>
               <th>Quantity</th>
               <th>Crop Price</th>
               <th>Purchase Crop</th>
           </tr>
           </thead>
           <tbody>
             {this.state.crops.map((crop)=>{
              return(crop.isBought && !crop.isBoughtByRetailer ?
                <tr>
                  <td>{crop.cropID}</td>
                  <td>{crop.cropName}</td>
                  <td>{crop.quantity}</td>
                  <td>{crop.cropPrice}</td>
                  <td><button type="button" className="btn btn-primary btn-block" value= {crop.cropID} onClick={this.handlePurchase}>Purchase</button></td>
                </tr> : null
              )
             })}
           </tbody>
         </table> 
          }
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
         </div>
      </div>
    </div>
  </div>
           
  {/* Purchased Crops */}
  {this.state.isDetailsFilled ?
  <button type="button" class="btn btn-success pull-right btn-lg" data-toggle="modal" data-target="#myModal2">Purchased Crops</button> : null }
  <div class="modal fade" id="myModal2" role="dialog">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Purchased Crops</h4>
        </div>
        <div class="modal-body">
          {
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
              return(crop.isBoughtByRetailer ? 
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
   
          }
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
         </div>
      </div>
    </div>
  </div>
            
  {/* Retailer Record */}
  {this.state.isDetailsFilled ?
  <button type="button" class="btn btn-success pull-right btn-lg" data-toggle="modal" data-target="#myModal3">Retailer Record</button> : null }
  <div class="modal fade" id="myModal3" role="dialog">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Retailer Record</h4>
        </div>
        <div class="modal-body">
          {
            <table class="table table-bordered table-dark table-striped">
            <thead>
            <tr>
                <th>Retailer ID</th>
                <th>Retailer Name</th>
                <th>Retailer Address</th>
                <th>Retailer Contact</th>
              </tr>
            </thead>
            <tbody>
              {this.state.retailerArrs.map((record)=>{
               return(
                 <tr>
                   <td>{record.retailID}</td>
                   <td>{record.retailName}</td>
                   <td>{record.retailAddress}</td>
                   <td>{record.retailContact}</td>
                 </tr>
               ) 
              })}
            </tbody>
          </table>
          }
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
         </div>
      </div>
    </div>
  </div>  
          </div>
        </div>
      </div>
    );
  }
}
