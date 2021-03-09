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
      const consumerCropCount = await this.supply.methods.consumerCropCount().call()

      let cropArr = [];
      let crop = [];
      let consArr =[];
      let cons=[];
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
      conss: [],
      cartArr: [],
      consArrs: [],
      consumerArrs: [],
      caddr:"",
      isDetailsFilled:false,
      isBought:false,
      isBoughtByConsumer:false,
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
        this.state.consumerAddress).send({ from: account}).then(()=>{ this.setState({ message: "consumer Details Entered" });  window.location.reload(false);});
      })
    }

    completePurchase(event){
      console.log("completing purchase")
      window.web3.eth.getCoinbase((err, account) => {
        this.setState({account}) 
        let cart= this.state.cartArr;
        for(let i=0;i<cart.length;i++){
        this.supply.methods.consumerAddCrop(cart[i]).send({ from: account}).then(()=>{ this.setState({ message: "New Crop Added" });  window.location.reload(false);});
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
                   <td>{crop.quantity}</td>
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
                return(crop.isBought && !crop.isBoughtByConsumer ?
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
         {/* Purchased records */}
         {this.state.isDetailsFilled ?
         <button type="button" class="btn btn-success pull-right btn-lg" data-toggle="modal" data-target="#myModal2">Purchased records </button> : null }
  <div class="modal fade" id="myModal2" role="dialog">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Purchased records </h4>
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
               return(crop.isBoughtByConsumer ? 
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
  {this.state.isDetailsFilled ?
  <button type="button" class="btn btn-success pull-right btn-lg" data-toggle="modal" data-target="#myModal3">Consumer Record</button> : null }
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
