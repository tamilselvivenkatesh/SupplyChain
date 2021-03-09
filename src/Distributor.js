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
      const distCropCount = await this.supply.methods.distCropCount().call()

      let cropArr = [];
      let crop = [];
      let distArr =[];
      let dist=[];
      for(let i=0;i<distCropCount;i++)
      {
        distArr.push(await this.supply.methods.distArr(i).call())
      }
      for(let i=0;i<distArr.length;i++)
      {
        dist.push(await this.supply.methods.dcrop(distArr[i]).call())  
      }
      this.setState({dists:dist})
      for(let i=0;i<cropCount;i++)
      {
        cropArr.push(await this.supply.methods.cropArr(i).call())
      }
      for(let i=0;i<cropArr.length;i++)
      {
        crop.push(await this.supply.methods.mcrop(cropArr[i]).call())  
      }
      this.setState({crops:crop})
      let distributorArr = [];
      distributorArr.push(await this.supply.methods.mdist(this.state.account).call())   
      this.setState({distributorArrs:distributorArr})
      this.setState({isDetailsFilled:this.state.distributorArrs[0].isValue})
    }
  }
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handlePurchase = this.handlePurchase.bind(this);
    this.state = {
      distID:"",
      distName:"",
      distAddress:"",
      distContact:"",
      cropID:"",
      cropName:"",
      quantity:"",
      cropPrice:"",
      crops: [],
      dists: [],
      distributorArrs: [],
      daddr:"",
      isDetailsFilled:false,
      isBought:false,
    };
  }

  handleClick(event) {
    event.preventDefault();
    window.web3.eth.getCoinbase((err, account) => {
    this.setState({account:account})
    this.supply.methods.addDist(
        this.state.distID,
        this.state.distName,
        this.state.distContact, 
        this.state.distAddress).send({ from: account}).then(()=>{ this.setState({ message: "Distributor Details Entered" });  window.location.reload(false);});
      })
    }


    handlePurchase(event) {
       event.preventDefault();
       let id=event.target.value;
      window.web3.eth.getCoinbase((err, account) => {
      this.setState({account}) 
      this.supply.methods.distAddCrop(id).send({ from: account}).then(()=>{ this.setState({ message: "New Crop Added" });  window.location.reload(false);});
        })
       }

  render() {console.log(this.state.crops)
    return (
      <div className="container container-fluid login-conatiner">
        <div>
          {this.state.isDetailsFilled ? null:
        <div className="login-form">
            <form method="post" autoComplete="off">
              <h2 className="text-center">Distributor Details</h2>
              <div className="form-group">
                <input
                  type="number" pattern ="[0-9]*" inputmode="numeric"
                  value={this.state.distID}
                  onChange={event =>
                    this.setState({ distID: event.target.value })
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
                    this.setState({ distName: event.target.value })
                  }
                  className="form-control"
                  placeholder="Name"
                />
              </div>
              <div className="form-group">
                <input
                  type="number" pattern ="[0-9]*" inputmode="numeric"
                  value={this.state.distContact}
                  onChange={event =>
                    this.setState({ distContact: event.target.value })
                  }
                  className="form-control"
                  placeholder="Contact"
                />
              </div>
               <div className="form-group">
                <input
                  type="text"
                  value={this.state.distAddress}
                  onChange={event =>
                    this.setState({ distAddress: event.target.value })
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
          <button type="button" class="btn btn-success pull-right btn-lg" data-toggle="modal" data-target="#myModal1">Crop Records</button> : null }
  <div class="modal fade" id="myModal1" role="dialog">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Crop Records</h4>
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
                return(crop.isBought ? null :
                  <tr>
                    <td>{crop.cropID}</td>
                    <td>{crop.cropName}</td>
                    <td>{crop.quantity}</td>
                    <td>{crop.cropPrice}</td>
                    <td><button type="button" className="btn btn-primary btn-block" value= {crop.cropID} onClick={this.handlePurchase}>Purchase</button></td>
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
                return(crop.isBought ? 
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
            
  {/* Distributor Record */}
  {this.state.isDetailsFilled ?
  <button type="button" class="btn btn-success pull-right btn-lg" data-toggle="modal" data-target="#myModal3">Distributor Record</button> : null }
  <div class="modal fade" id="myModal3" role="dialog">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Distributor Record</h4>
        </div>
        <div class="modal-body">
          {
            <table class="table table-bordered table-dark table-striped">
            <thead>
            <tr>
                <th>Distributor ID</th>
                <th>Distributor Name</th>
                <th>Distributor Address</th>
                <th>Distributor Contact</th>
              </tr>
            </thead>
            <tbody>
              {this.state.distributorArrs.map((record)=>{
               return(
                 <tr>
                   <td>{record.distID}</td>
                   <td>{record.distName}</td>
                   <td>{record.distAddress}</td>
                   <td>{record.distContact}</td>
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
