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
      const consumerCropCount = await this.supply.methods.consumerCropCount().call()
      const farmerCount = await this.supply.methods.farmerCount().call()
      const distCount = await this.supply.methods.distCount().call()
      const retailCount = await this.supply.methods.retailCount().call()

      let cropArr = [];
      let crop = [];
      let consArr =[];
      let cons=[];
      let conscrop = [];
      let farmerAdd=[];
      let farmerArr=[];
      let distAdd=[];
      let distArr=[];
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
      
      //distributor
      for(let i=0;i<distCount;i++)
      {
        distAdd.push(await this.supply.methods.distAdd(i).call())
      }
      this.setState({distAdds:distAdd})
      for(let i=0;i<distCount;i++)
      {
        distArr.push(await this.supply.methods.mdist(distAdd[i]).call())  
      }
      this.setState({distributors:distArr})
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
      for(let i=0;i<consumerCropCount;i++)
      {
        consArr.push(await this.supply.methods.consArr(i).call())
      }
      for(let i=0;i<consArr.length;i++)
      {
        cons.push(await this.supply.methods.mcrop(consArr[i]).call())  
      }
      this.setState({conss:cons})
      for(let i=0;i<cropCount;i++)
      {
        cropArr.push(await this.supply.methods.cropArr(i).call())
      }
      for(let i=0;i<cropArr.length;i++)
      {
        crop.push(await this.supply.methods.mcrop(cropArr[i]).call())  
      }
      this.setState({crops:crop})

      //consumer
      for(let i=0;i<cropArr.length;i++)
      {
        conscrop.push(await this.supply.methods.conscrop(cropArr[i]).call())  
      }
      this.setState({conscrops:conscrop})

      let consumerArr = [];
      consumerArr.push(await this.supply.methods.mconsumer(this.state.account).call())   
      this.setState({consumerArrs:consumerArr})
      this.setState({isDetailsFilled:this.state.consumerArrs[0].isValue})
    }
  }
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handlePurchase = this.handlePurchase.bind(this);
    this.completePurchase = this.completePurchase.bind(this);
    this.removePurchase = this.removePurchase.bind(this);

    this.state = {
      consumerID:"",
      consumerName:"",
      consumerAddress:"",
      consumerContact:"",
      cropID:"",
      cropName:"",
      quantity:"",
      cropPrice:"",
      crops: [],
      conscrops:[],
      conss: [],
      cartArr: [],
      consArrs: [],
      consumerArrs: [],
      distAdds: [],
      farmers:[],
      farmerAdds: [],
      distributors:[],
      retailers:[],
      retailAdds: [],
      caddr:"",
      isDetailsFilled:false,
      isBought:false,
      isBoughtByRetailer: false,
      isBoughtByConsumer:false,
      needQuantity:{}
    };
  }

  handleClick(event) {
    event.preventDefault();
    window.web3.eth.getCoinbase((err, account) => {
    this.setState({account:account})
    this.supply.methods.addconsumer(
        this.state.consumerID,
        this.state.consumerName,
        this.state.consumerContact,
        this.state.consumerAddress).send({ from: account}).then(()=>{ this.setState({ message: "consumer Details Entered" });  this.loadBlockchainData();});
      })
    }

    completePurchase(event){
      console.log("completing purchase")
      window.web3.eth.getCoinbase((err, account) => {
        this.setState({account}) 
        let cart= this.state.cartArr;
        for(let i=0;i<cart.length;i++){
        this.supply.methods.consumerAddCrop(cart[i],this.state.needQuantity[cart[i]]).send({ from: account}).then(()=>{ this.setState({ message: "New Crop Added" }); this.loadBlockchainData();});
       } })
    }

    handlePurchase(event) {
       event.preventDefault();
       let id=event.target.value;
       console.log(id);
       let cart = this.state.cartArr;
       cart.push(id);
       let uniqueItems = [...new Set(cart)]
       this.setState({cartArr:uniqueItems})
       alert("Successfully added crop to cart")
      }
      
      removePurchase(event){
        event.preventDefault();
        let id=event.target.value;
        console.log(id);
        let cart = this.state.cartArr;
        let index = cart.indexOf(id);
        if (index !== -1) {
        cart.splice(index, 1);
        }
        this.setState({cartArr:cart})
      }

  render() {
    return (
      <div className="container container-fluid login-conatiner">
        <div>
        
<div class="container">
{/* Cart modal starts */}
<br/>
<button type="button" class="btn btn-success pull-right btn-lg" data-toggle="modal" data-target="#myModal">Cart</button> 
  <div class="modal fade" id="myModal" role="dialog">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Your Cart</h4>
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
               return(
                 this.state.cartArr.includes(crop.cropID)?
                 <tr>
                   <td>{crop.cropID}</td>
                   <td>{crop.cropName}</td>
                   <td>{this.state.needQuantity[crop.cropID]}</td>
                   <td>{crop.cropPrice}</td>
                   <td><button type="button" className="btn btn-primary btn-block" value= {crop.cropID} onClick={this.removePurchase} >Remove</button></td>
                 </tr>:null
               )
              })}
            </tbody>
          </table>    
          }
          {/* {console.log(this.state.crops)} */}
        </div>
        <div class="modal-footer">
        <button type="button" className="btn btn-success btn-block"  onClick={this.completePurchase}>Complete Purchase</button>            
          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
         </div>
      </div>
    </div>
  </div>
</div>
{/* cart Modal ends */}

{/* opens nav */}

{/* ends nav */}
 
          {this.state.isDetailsFilled ? null:
        <div className="login-form">
            <form method="post" autoComplete="off">
              <h2 className="text-center">Consumer Details</h2>
              <div className="form-group">
                <input
                  type="number" pattern ="[0-9]*" inputmode="numeric"
                  value={this.state.consumerID}
                  onChange={event =>
                    this.setState({ consumerID: event.target.value })
                  }
                  className="form-control"
                  placeholder="ID"
                />
              </div>
              <div className="form-group">
                <input
                  type="text" 
                  value={this.state.consumerName}
                  onChange={event =>
                    this.setState({ consumerName: event.target.value })
                  }
                  className="form-control"
                  placeholder="Name"
                />
              </div>
              <div className="form-group">
                <input
                  type="number" pattern ="[0-9]*" inputmode="numeric"
                  value={this.state.consumerContact}
                  onChange={event =>
                    this.setState({ consumerContact: event.target.value })
                  }
                  className="form-control"
                  placeholder="Contact"
                />
              </div>
               <div className="form-group">
                <input
                  type="text"
                  value={this.state.consumerAddress}
                  onChange={event =>
                    this.setState({ consumerAddress: event.target.value })
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
             {/* Crop records */}
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
    <button id ="drive" type="button" class="radio-button" data-toggle="modal" data-target="#myModal3">Consumer Record</button>
      <div class="radio-tile">
        <div class="icon car-icon">
          
        </div>
        <label for="drive" class="radio-tile-label">Consumer Record</label>
      </div>
    </div>
  </div>
</div>

: null }
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
                 <th>Crop Details</th>
                 <th>Purchase quantity</th>
                 <th>Purchase Crop</th>
             </tr>
             </thead>
             <tbody>
               {this.state.crops.map((crop)=>{
              
                return(crop.isBought && crop.isBoughtByRetailer && crop.quantity > 0 ?
                  <tr>
                    <td>{crop.cropID}</td>
                    <td>{crop.cropName}</td>
                    <td>{crop.quantity}</td>
                    <td>{crop.cropPrice}</td>
                    <td>{this.state.farmers.map((farmer)=>(
                    farmer.faddr === crop.faddr?<p>
                    Farmer Name: {farmer.farmerName}<br/>
                    Farmer Address: {farmer.farmerAddress}<br/> 
                    Farmer Contact: {farmer.farmerContact}</p>:null
                    ))}
                    { this.state.distributors.map((dist)=>(
                      dist.daddr === crop.daddr?<p>
                      Distributor Name:{dist.distName}<br/>
                      Distributor Address: {dist.distAddress}<br/>
                      Distributor Contact: {dist.distContact}</p>:null
                    ))
                    }
                    { this.state.retailers.map((retail)=>(
                      retail.raddr === crop.raddr?<p>
                      Retailer Name:{retail.retailName}<br/>
                      Retailer Address: {retail.retailAddress}<br/>
                      Retailer Contact: {retail.retailContact}</p>:null
                    ))
                    }
                    </td>
                    <td><input type = "number"
                    onChange={event => {
                      let dict = this.state.needQuantity;
                      dict[crop.cropID] = event.target.value;
                      this.setState({ needQuantity: dict})
                    }
                  }/></td>
                    <td><button type="button" className="btn btn-primary btn-block" value= {crop.cropID} onClick={this.handlePurchase} disabled={this.state.needQuantity[crop.cropID]>crop.quantity?true:false}>Purchase</button></td>
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
         {/* Purchased records */}
            <div class="modal fade" id="myModal2" role="dialog">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Purchased Records </h4>
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
              {this.state.conscrops.map((crop)=>{
               return(crop.isBoughtByConsumer && crop.caddr === this.state.account? 
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
            
  {/* Consumer Record */}
  <div class="modal fade" id="myModal3" role="dialog">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Consumer Record</h4>
        </div>
        <div class="modal-body">
          {
            <table class="table table-bordered table-dark table-striped">
            <thead>
            <tr>
                <th>consumer ID</th>
                <th>consumer Name</th>
                <th>consumer Address</th>
                <th>consumer Contact</th>
              </tr>
            </thead>
            <tbody>
              {this.state.consumerArrs.map((record)=>{
               return(
                 <tr>
                   <td>{record.consumerID}</td>
                   <td>{record.consumerName}</td>
                   <td>{record.consumerAddress}</td>
                   <td>{record.consumerContact}</td>
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
