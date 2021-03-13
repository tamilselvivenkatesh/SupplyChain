import React from "react";
import SupplyChain from "./contracts/SupplyChain.json";
import Web3 from 'web3'
import "./menu.css"


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
      const farmerCount = await this.supply.methods.farmerCount().call()
      const retailCount = await this.supply.methods.retailCount().call()

      let cropArr = [];
      let crop = [];
      let distArr =[];
      let dist=[];
      let farmerAdd=[];
      let farmerArr=[];
      let retailArr=[];
      let retailAdd=[];

      //farmer
      for(let i=0;i<farmerCount;i++)
      {
        farmerAdd.push(await this.supply.methods.farmerAdd(i).call())
      }
      this.setState({farmerAdds:farmerAdd})
      for(let i=0;i<farmerCount;i++)
      {
        farmerArr.push(await this.supply.methods.mfarmer(farmerAdd[i]).call())  
      }
      this.setState({farmers:farmerArr})

      //distcrop
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

      //retail
      for(let i=0;i<retailCount;i++)
      {
        retailAdd.push(await this.supply.methods.retailAdd(i).call())
      }
      this.setState({retailAdds:retailAdd})
      for(let i=0;i<retailCount;i++)
      {
        retailArr.push(await this.supply.methods.mretail(retailAdd[i]).call())  
      }
      this.setState({retailers:retailArr})
      
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
      farmerAdds: [],
      farmers: [],
      distributorArrs: [],
      retailers:[],
      retailAdds: [],
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

  render() {
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
         
          {this.state.isDetailsFilled ?
          <div class="menucontainer">
          <div class="radio-tile-group">
            <div class="input-container">
            <button type="button" id="walk" class="radio-button" data-toggle="modal" data-target="#myModal1">Crop Record</button>
              {/* <input id="walk" class="radio-button" type="radio" name="radio" /> */}
              <div class="radio-tile">
                <label for="walk" class="radio-tile-label">Crop Records</label>
              </div>
            </div>
        
            <div class="input-container">
            <button id ="bike" type="button" class="radio-button" data-toggle="modal" data-target="#myModal2">Purchased records </button>
              <div class="radio-tile">
                <div class="icon bike-icon">
                </div>
                <label for="bike" class="radio-tile-label">Purchased Records</label>
              </div>
            </div>
        
            <div class="input-container">
            <button id ="drive" type="button" class="radio-button" data-toggle="modal" data-target="#myModal3">Distributor Record</button>
              <div class="radio-tile">
                <div class="icon car-icon">
                  
                </div>
                <label for="drive" class="radio-tile-label">Distributor Record</label>
              </div>
            </div>

            <div class="input-container">
            <button id ="drive" type="button" class="radio-button" data-toggle="modal" data-target="#myModal4">Who Purchased?</button>
              <div class="radio-tile">
                <div class="icon car-icon">
                  
                </div>
                <label for="drive" class="radio-tile-label">Who Purchased?</label>
              </div>
            </div>
          </div>
        </div>: null }
                  {/* Crop Records */}

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
                 <th>Crop Details</th>
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
                    <td>{this.state.farmers.map((farmer)=>(
                    farmer.faddr === crop.faddr?<p>Farmer Name: {farmer.farmerName}<br/>Farmer Address: {farmer.farmerAddress}<br/> Farmer Contact: {farmer.farmerContact}</p>:null  
                    ))}</td>
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

  <div class="modal fade" id="myModal4" role="dialog">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Who Purchased?</h4>
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
                 <th>Who Purchased?</th>
             </tr>
             </thead>
             <tbody>
               {this.state.crops.map((crop)=>{
                return(crop.daddr === this.state.account && crop.isBoughtByRetailer ?
                  <tr>
                    <td>{crop.cropID}</td>
                    <td>{crop.cropName}</td>
                    <td>{crop.quantity}</td>
                    <td>{crop.cropPrice}</td>
                    <td>{ this.state.retailers.map((retail)=>(
                      retail.raddr === crop.raddr?<p>
                      Retailer Name:{retail.retailName}<br/>
                      Retailer Address: {retail.retailAddress}<br/>
                      Retailer Contact: {retail.retailContact}</p>:null
                    ))
                    }</td>
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
