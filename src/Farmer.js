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
      const leaseCount = await this.supply.methods.leaseCount().call()
      const saleCount = await this.supply.methods.saleCount().call()
      const seedCount = await this.supply.methods.seedCount().call()
      const fertilizerCount = await this.supply.methods.fertilizerCount().call()

      let cropArr = [];
      let crop = [];
      let leaseArr = [];
      let lease = [];
      let saleArr =[];
      let sale = [];
      let seedArr = [];
      let seed = [];
      let fertilizerArr =[];
      let fertilizer=[];
      
      //number of lands for lease
      for(let i=0;i<leaseCount;i++)
      {
        leaseArr.push(await this.supply.methods.leaseArr(i).call())
      }
      for(let i=0;i<leaseArr.length;i++)
      {
        lease.push(await this.supply.methods.mlland(leaseArr[i]).call())  
      }
      this.setState({leases:lease})

      //number of lands for sale
      for(let i=0;i<saleCount;i++)
      {
        saleArr.push(await this.supply.methods.saleArr(i).call())
      }
      for(let i=0;i<saleArr.length;i++)
      {
        sale.push(await this.supply.methods.msland(saleArr[i]).call())  
      }
      this.setState({sales:sale})

      //number of seed
      for(let i=0;i<seedCount;i++)
      {
        seedArr.push(await this.supply.methods.seedArr(i).call())
      }
      for(let i=0;i<seedArr.length;i++)
      {
        seed.push(await this.supply.methods.mseed(seedArr[i]).call())  
      }
      this.setState({seeds:seed})

      //number of fertilizer
      for(let i=0;i<fertilizerCount;i++)
      {
        fertilizerArr.push(await this.supply.methods.fertilizerArr(i).call())
      }
      for(let i=0;i<fertilizerArr.length;i++)
      {
        fertilizer.push(await this.supply.methods.mfertilizer(fertilizerArr[i]).call())  
      }
      this.setState({fertilizers:fertilizer})

      //farmer add crop
      for(let i=0;i<cropCount;i++)
      {
        cropArr.push(await this.supply.methods.cropArr(i).call())
      }
      for(let i=0;i<cropArr.length;i++)
      {
        crop.push(await this.supply.methods.mcrop(cropArr[i]).call())  
      }
      this.setState({crops:crop})
      //current farmer
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
    this.handleLeasePurchase=this.handleLeasePurchase.bind(this);
    this.handleSalePurchase=this.handleSalePurchase.bind(this);
    this.handleSeedPurchase=this.handleSeedPurchase.bind(this);
    this.handleFertilizerPurchase=this.handleFertilizerPurchase.bind(this);
    this.state = {
      farmerID:"",
      farmerName:"",
      farmerAddress:"",
      farmerContact:"",
      cropId:"",
      cropName:"",
      quantity:"",
      cropPrice:"",
      seedID:"",
      seedName:"",
      seedQuantity:"",
      seedcost:"",
      fertilizerID:"",
      fertilizerName:"",
      fertilizerQuantity:"",
      fertilizerCost:"",
      seeds: [],
      fertilizers: [],
      crops: [],
      landId:"",
      landAddress:"",
      soilType:"",
      duration:"",
      cost:"",
      area:"",
      farmerArrs: [],
      leases: [],
      sales: [],
      faddr:"",
      isDetailsFilled:false,
      isBought:false
    };
  }

  //add farmer details
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

    //add crop button
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
    
    //purchase lease land button
    handleLeasePurchase(event) {
      event.preventDefault();
      let id=event.target.value;
     // console.log(id);
     window.web3.eth.getCoinbase((err, account) => {
     this.setState({account}) 
     this.supply.methods.purchaseLandLease(id).send({ from: account}).then(()=>{ this.setState({ message: "Lease Land purchased Added" });  window.location.reload(false);});
       })
      }

      //purchase sale land button
    handleSalePurchase(event) {
      event.preventDefault();
      let id=event.target.value;
     // console.log(id);
     window.web3.eth.getCoinbase((err, account) => {
     this.setState({account}) 
     this.supply.methods.purchaseLandSale(id).send({ from: account}).then(()=>{ this.setState({ message: "Sale land purchased Added" });  window.location.reload(false);});
       })
      }

      //purchase seed land button
    handleSeedPurchase(event) {
      event.preventDefault();
      let id=event.target.value;
     // console.log(id);
     window.web3.eth.getCoinbase((err, account) => {
     this.setState({account}) 
     this.supply.methods.purchaseSeed(id).send({ from: account}).then(()=>{ this.setState({ message: "Seed purchased Added" });  window.location.reload(false);});
       })
      }

      //purchase fertilizer land button
    handleFertilizerPurchase(event) {
      event.preventDefault();
      let id=event.target.value;
     // console.log(id);
     window.web3.eth.getCoinbase((err, account) => {
     this.setState({account}) 
     this.supply.methods.purchaseFertilizer(id).send({ from: account}).then(()=>{ this.setState({ message: "Fertilizer purchased Added" });  window.location.reload(false);});
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
          {this.state.isDetailsFilled ?
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
                  disabled={!this.state.isDetailsFilled}
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
       : null}</div>
        
  <div className="col-md-2 col-md-offset-6">
          <div className="c-list">

{/* seed records */}
 <button type="button" class="btn btn-success pull-right btn-lg" data-toggle="modal" data-target="#myModal1">Seed Records</button>
  <div class="modal fade" id="myModal1" role="dialog">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Seed Records</h4>
        </div>
        <div class="modal-body">
          {
              <table class="table table-bordered table-dark table-striped">
              <thead>
              <tr>
                  <th>Seed ID</th>
                  <th>Name</th>
                  <th>Cost</th>
                  <th>Quantity</th>
                  <th>Purchase Seed</th>
              </tr>
              </thead>
              <tbody>
                {this.state.seeds.map((seed)=>{
                 return(seed.isBought ? null :
                   <tr>
                     <td>{ seed.seedID}</td>
                     <td>{ seed.seedName}</td>
                     <td>{ seed.seedcost}</td>
                     <td>{ seed.seedQuantity}</td>
                     <td><button type="button" className="btn btn-primary btn-block" value= {seed.seedID} onClick={this.handleSeedPurchase}>Purchase</button></td>
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
           

{/* purchased seed table */}
            
  <button type="button" class="btn btn-success pull-right btn-lg" data-toggle="modal" data-target="#myModal2">Purchsed Seed Records</button>
  <div class="modal fade" id="myModal2" role="dialog">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Purchased Seed Records</h4>
        </div>
        <div class="modal-body">
          {
             <table class="table table-bordered table-dark table-striped">
             <thead>
             <tr>
                 <th>Seed ID</th>
                 <th>Seed Name</th>
                 <th>Cost</th>
                 <th>Quantity</th>
                 
             </tr>
             </thead>
             <tbody>
               {this.state.seeds.map((seed)=>{
                return(seed.isBought ?
                  <tr>
                    <td>{ seed.seedID}</td>
                    <td>{ seed.seedName}</td>
                    <td>{ seed.seedcost}</td>
                    <td>{ seed.seedQuantity}</td>
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
           
            {/* fertilizer records */}
<button type="button" class="btn btn-success pull-right btn-lg" data-toggle="modal" data-target="#myModal3">Fertilizer Records</button>
  <div class="modal fade" id="myModal3" role="dialog">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Fertilizer Records</h4>
        </div>
        <div class="modal-body">
          {
            <table class="table table-bordered table-dark table-striped">
            <thead>
            <tr>
                <th>Fertilizer ID</th>
                <th>Name</th>
                <th>Cost</th>
                <th>Quantity</th>
                <th>Purchase Fertilizer</th>
            </tr>
            </thead>
            <tbody>
              {this.state.fertilizers.map((fertilizer)=>{
               return(fertilizer.isBought ? null :
                 <tr>
                   <td>{ fertilizer.fertilizerID}</td>
                   <td>{ fertilizer.fertilizerName}</td>
                   <td>{ fertilizer.fertilizerCost}</td>
                   <td>{ fertilizer.fertilizerQuantity}</td>
                   <td><button type="button" className="btn btn-primary btn-block" value= {fertilizer.fertilizerID} onClick={this.handleFertilizerPurchase}>Purchase</button></td>
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
           
  
            {/* Purchased fertilizers */}
<button type="button" class="btn btn-success pull-right btn-lg" data-toggle="modal" data-target="#myModal4">Purchased Fertilizer Records</button>
  <div class="modal fade" id="myModal4" role="dialog">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Purchased Fertilizer Records</h4>
        </div>
        <div class="modal-body">
          {
            <table class="table table-bordered table-dark table-striped">
            <thead>
            <tr>
                <th>Fertilizer ID</th>
                <th>Fertilizer Name</th>
                <th>Cost</th>
                <th>Quantity</th>
                
            </tr>
            </thead>
            <tbody>
              {this.state.fertilizers.map((fertilizer)=>{
               return(fertilizer.isBought ?
                 <tr>
                   <td>{ fertilizer.fertilizerID}</td>
                   <td>{ fertilizer.fertilizerName}</td>
                   <td>{ fertilizer.fertilizerCost}</td>
                   <td>{ fertilizer.fertilizerQuantity}</td>

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

           

            {/* Lease land records */}
            <button type="button" class="btn btn-success pull-right btn-lg" data-toggle="modal" data-target="#myModal5">Lease land records</button>
  <div class="modal fade" id="myModal5" role="dialog">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Lease land records</h4>
        </div>
        <div class="modal-body">
          {
          <table class="table table-bordered table-dark table-striped">
              <thead>
              <tr>
                  <th>Land ID</th>
                  <th>Address</th>
                  <th>Soil Type</th>
                  <th>Crop Type</th>
                  <th>Area</th>
                  <th>Cost</th>
                  <th>Duration</th>
                  <th>Purchase Land</th>
              </tr>
              </thead>
              <tbody>
                {this.state.leases.map((land)=>{
                 return(land.isBought ? null :
                   <tr>
                     <td>{ land.landID}</td>
                      <td>{ land.landAddress}</td>
                     <td>{ land.soilType}</td>
                     {/* <td>{ land.cropType}</td> */}
                     <td>{ land.area}</td>
                     <td>{ land.cost}</td>
                     <td>{ land.duration}</td>
                     <td><button type="button" className="btn btn-primary btn-block" value= {land.landID} onClick={this.handleLeasePurchase}>Purchase</button></td>
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


         

            {/* purchased lease land table */}
            <button type="button" class="btn btn-success pull-right btn-lg" data-toggle="modal" data-target="#myModal6">Purchase Lease land records</button>
  <div class="modal fade" id="myModal6" role="dialog">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Purchase Lease land records</h4>
        </div>
        <div class="modal-body">
          {
            <table class="table table-bordered table-dark table-striped">
              <thead>
              <tr>
                  <th>Land ID</th>
                  <th>Address</th>
                  <th>Soil Type</th>
                  <th>Crop Type</th>
                  <th>Area</th>
                  <th>Cost</th>
                  <th>Duration</th>
                  
              </tr>
              </thead>
              <tbody>
                {this.state.leases.map((land)=>{
                 return(land.isBought ?
                   <tr>
                     <td>{ land.landID}</td>
                     <td>{ land.landAddress}</td>
                     <td>{ land.soilType}</td>
                     <td>{ land.area}</td>
                     <td>{ land.cost}</td>
                     <td>{ land.duration}</td>
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
             {/* Sale Land Records */}
  <button type="button" class="btn btn-success pull-right btn-lg" data-toggle="modal" data-target="#myModal7">Sale land records</button>
  <div class="modal fade" id="myModal7" role="dialog">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Sale land records</h4>
        </div>
        <div class="modal-body">
          {
            <table class="table table-bordered table-dark table-striped">
            <thead>
            <tr>
                <th>Land ID</th>
                <th>Address</th>
                <th>Soil Type</th>
                <th>Crop Type</th>
                <th>Area</th>
                <th>Cost</th>
                <th>Purchase Land</th>
            </tr>
            </thead>
            <tbody>
              {this.state.sales.map((land)=>{
               return(land.isBought ? null :
                 <tr>
                   <td>{ land.landID}</td>
                    <td>{ land.landAddress}</td>
                   <td>{ land.soilType}</td>
                   <td>{ land.area}</td>
                   <td>{ land.cost}</td>
                   <td><button type="button" className="btn btn-primary btn-block" value= {land.landID} onClick={this.handleSalePurchase}>Purchase</button></td>
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
            

            {/* purchased sale land table */}
            <button type="button" class="btn btn-success pull-right btn-lg" data-toggle="modal" data-target="#myModal8">Purchased sale land table records</button>
  <div class="modal fade" id="myModal8" role="dialog">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title"> Purchased sale land table  records</h4>
        </div>
        <div class="modal-body">
          {
            <table class="table table-bordered table-dark table-striped">
            <thead>
            <tr>
                <th>Land ID</th>
                <th>Address</th>
                <th>Soil Type</th>
                <th>Crop Type</th>
                <th>Area</th>
                <th>Cost</th>
            </tr>
            </thead>
            <tbody>
              {this.state.sales.map((land)=>{
               return(land.isBought ?
                 <tr>
                   <td>{ land.landID}</td>
                   <td>{ land.landAddress}</td>
                   <td>{ land.soilType}</td>
                   <td>{ land.area}</td>
                   <td>{ land.cost}</td>
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
            {/* Crop Records */}

            <button type="button" class="btn btn-success pull-right btn-lg" data-toggle="modal" data-target="#myModal9">Crop Records</button>
  <div class="modal fade" id="myModal9" role="dialog">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title"> Crop Records</h4>
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
            }
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
         </div>
      </div>
    </div>
  </div>
            {/* Farmer Record */}
            <button type="button" class="btn btn-success pull-right btn-lg" data-toggle="modal" data-target="#myModal10"> Farmer Records</button>
  <div class="modal fade" id="myModal10" role="dialog">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">  Farmer Records</h4>
        </div>
        <div class="modal-body">
          {
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
