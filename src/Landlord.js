import React from "react";
// import ReactDOM from "react-dom";
import SupplyChain from "./contracts/SupplyChain.json";
import Web3 from 'web3'


export default class Landlord extends React.Component {

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
      const leaseCount = await this.supply.methods.leaseCount().call()
      const saleCount = await this.supply.methods.saleCount().call()
      let leaseArr = [];
      let lease = [];
      let saleArr =[];
      let sale = [];

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

      //number of landlords
      let landlordArr = [];
      landlordArr.push(await this.supply.methods.mlandlord(this.state.account).call())   
      this.setState({landlordArrs:landlordArr})
      this.setState({isDetailsFilled:this.state.landlordArrs[0].isValue})
    }
  }
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleLeaseClick = this.handleLeaseClick.bind(this);
    this.handleSaleClick = this.handleSaleClick.bind(this);
    this.handleSClick = this.handleSClick.bind(this);
    this.handleLClick = this.handleLClick.bind(this);

    //this.onClick = this.onClick.bind(this);

    
    this.state = {
      landlordID:"",
      landlordName:"",
      landlordAddress:"",
      landlordContact:"",
      landId:"",
      landAddress:"",
      soilType:"",
      duration:"",
      cost:"",
      area:"",
      landlordArrs: [],
      laddr:"",
      leases: [],
      sales: [],
      isDetailsFilled:false,
      isSale:false,
      isLease:false
    };
  }

  handleClick(event) {
    event.preventDefault();
   // console.log("hi")
    window.web3.eth.getCoinbase((err, account) => {
    this.setState({account:account})
    this.supply.methods.newLandlord(
        this.state.landlordID,
        this.state.landlordName,
        this.state.landlordContact,
        this.state.landlordAddress).send({ from: account}).then(()=>{ this.setState({ message: "Landlord Details Entered" });  window.location.reload(false);});
      })
    }

  //lease button  
  handleLeaseClick(event) {
    event.preventDefault();
    // console.log("hi")
    window.web3.eth.getCoinbase((err, account) => {
    this.setState({account}) 
    this.supply.methods.addLandLease(
        this.state.landID,
        this.state.landAddress,
        this.state.soilType,
        this.state.area,
        this.state.cost,
        this.state.duration).send({ from: account}).then(()=>{ this.setState({ message: "New Land Added for Lease" });  window.location.reload(false);});
      })
    }

    //sale button
    handleSaleClick(event) {
      event.preventDefault();
     //console.log("hi1")
    window.web3.eth.getCoinbase((err, account) => {
    this.setState({account}) 
    this.supply.methods.addLandSale(
        this.state.landID,
        this.state.landAddress,
        this.state.soilType,
        this.state.area,
        this.state.cost).send({ from: account}).then(()=>{ this.setState({ message: "New Land Added for Sale" });  window.location.reload(false);});
      })
    }

    handleLClick(event)
    {
      event.preventDefault();
      this.setState({ isLease: !this.state.isLease })  
      this.setState({isSale:false})
    }
     handleSClick(event)
     {
        event.preventDefault();
        this.setState({ isSale: !this.state.isSale })
        this.setState({isLease:false})
     }
 
  render() {
    return (
      <div className="container container-fluid login-conatiner">
        <div className="col-md-4">
          {this.state.isDetailsFilled ? null:
        <div className="login-form">
            <form method="post" autoComplete="off">
              <h2 className="text-center">Landlord Details</h2>
              <div className="form-group">
                <input
                  type="number" pattern ="[0-9]*" inputmode="numeric"
                  value={this.state.landlordID}
                  onChange={event =>
                    this.setState({ landlordID: event.target.value })
                  }
                  className="form-control"
                  placeholder="ID"
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  value={this.state.landlordName}
                  onChange={event =>
                    this.setState({landlordName: event.target.value })
                  }
                  className="form-control"
                  placeholder="Name"
                />
              </div>
              <div className="form-group">
                <input
                  type="number" pattern ="[0-9]*" inputmode="numeric"
                  value={this.state.landlordContact}
                  onChange={event =>
                    this.setState({ landlordContact: event.target.value })
                  }
                  className="form-control"
                  placeholder="Contact"
                />
              </div>
               <div className="form-group">
                <input
                  type="text"
                  value={this.state.landlordAddress}
                  onChange={event =>
                    this.setState({ landlordAddress: event.target.value })
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

        {/* //sale and lease button */}
        {this.state.isDetailsFilled ? 
          <div className="login-form">
          <form  autoComplete="off">
          <div className="form-group">
                <button
                  className="btn btn-primary btn-block"
                   onClick={this.handleLClick}
                >
                  Lease
                </button>
              </div>
              <div className="form-group">
                <button
                  className="btn btn-primary btn-block"
                   onClick={this.handleSClick}
                >
                  Sale
                </button>
              </div>
              </form>
              </div>: null }  

       { this.state.isLease ? 
      //lease form
         <div className="login-form">
        <form method="post" autoComplete="off">
          <h2 className="text-center">Land for Lease Details</h2>
          <div className="form-group">
            <input
              type="number" pattern ="[0-9]*" inputmode="numeric"
              value={this.state.landID}
              onChange={event =>
                this.setState({ landID: event.target.value })
              }
              className="form-control"
              placeholder="ID"
            />
          </div>
          
          <div className="form-group">
            <input
             type ="text"
              value={this.state.landAddress}
              onChange={event =>
                this.setState({ landAddress: event.target.value })
              }
              className="form-control"
              placeholder="Address"
            />
          </div>

          <div className="form-group">
            <input
             type ="text"
              value={this.state.soilType}
              onChange={event =>
                this.setState({ soilType: event.target.value })
              }
              className="form-control"
              placeholder="Soil Type"
            />
          </div>
          <div className="form-group">
            <input
              type="number" pattern ="[0-9]*" inputmode="numeric"
              value={this.state.area}
              onChange={event =>
                this.setState({ area: event.target.value })
              }
              className="form-control"
              placeholder="Area"
            />
          </div>
          <div className="form-group">
            <input
                    type="number" pattern ="[0-9]*" inputmode="numeric" 
                value={this.state.cost}
              onChange={event =>
                this.setState({ cost: event.target.value })
              }
              className="form-control"
              placeholder="Cost"
            />
          </div>
          <div className="form-group">
            <input
                    type="number" pattern ="[0-9]*" inputmode="numeric" 
                value={this.state.duration}
              onChange={event =>
                this.setState({ duration: event.target.value })
              }
              className="form-control"
              placeholder="Duration"
            />
          </div>
          <div className="form-group">
            <button
              className="btn btn-primary btn-block"
              onClick={this.handleLeaseClick}
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
      </div> : null }
       { this.state.isSale?
        //sale form
        <div className="login-form">
        <form method="post" autoComplete="off">
          <h2 className="text-center">Land for Sale Details</h2>
          <div className="form-group">
            <input
              type="number" pattern ="[0-9]*" inputmode="numeric"
              value={this.state.landID}
              onChange={event =>
                this.setState({ landID: event.target.value })
              }
              className="form-control"
              placeholder="ID"
            />
          </div>
          
          <div className="form-group">
            <input
             type ="text"
              value={this.state.landAddress}
              onChange={event =>
                this.setState({ landAddress: event.target.value })
              }
              className="form-control"
              placeholder="Address"
            />
          </div>

          <div className="form-group">
            <input
             type ="text"
              value={this.state.soilType}
              onChange={event =>
                this.setState({ soilType: event.target.value })
              }
              className="form-control"
              placeholder="Soil Type"
            />
          </div>
          <div className="form-group">
            <input
              type="number" pattern ="[0-9]*" inputmode="numeric"
              value={this.state.area}
              onChange={event =>
                this.setState({ area: event.target.value })
              }
              className="form-control"
              placeholder="Area"
            />
          </div>
          <div className="form-group">
            <input
                    type="number" pattern ="[0-9]*" inputmode="numeric" 
                value={this.state.cost}
              onChange={event =>
                this.setState({ cost: event.target.value })
              }
              className="form-control"
              placeholder="Cost"
            />
          </div>
          <div className="form-group">
            <button
              className="btn btn-primary btn-block"
              onClick={this.handleSaleClick}
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
      </div>:null 
       }
       </div>
          
       
        
        <div className="col-md-6 col-md-offset-2">
          <div className="c-list">
          {/* Land Lease Records */}
          {this.state.isDetailsFilled ?
                <div class="menucontainer">
                <div class="radio-tile-group">
                  <div class="input-container">
                  <button type="button" id="walk" class="radio-button" data-toggle="modal" data-target="#myModal1">Land Lease Records</button>
                    {/* <input id="walk" class="radio-button" type="radio" name="radio" /> */}
                    <div class="radio-tile">
                      <label for="walk" class="radio-tile-label">Land Lease Records</label>
                    </div>
                  </div>
              
                  <div class="input-container">
                  <button id ="bike" type="button" class="radio-button" data-toggle="modal" data-target="#myModal2">Land Sale Record </button>
                    <div class="radio-tile">
                      <div class="icon bike-icon">
                      </div>
                      <label for="bike" class="radio-tile-label"> Land Sale Record </label>
                    </div>
                  </div>
              
                  <div class="input-container">
                  <button id ="drive" type="button" class="radio-button" data-toggle="modal" data-target="#myModal3">Landlord Record</button>
                    <div class="radio-tile">
                      <div class="icon car-icon">
                        
                      </div>
                      <label for="drive" class="radio-tile-label">Landlord Record</label>
                    </div>
                  </div>
                </div>
              </div>
       : null } 

{/* Land Sale Records */}
  <div class="modal fade" id="myModal1" role="dialog">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Land Sale Records</h4>
        </div>
        <div class="modal-body">
          {
           <table class="table table-bordered table-dark table-striped">
           <thead>
           <tr>
               <th>Land ID</th>
               <th>Address</th>
               <th>Soil Type</th>
               <th>Area</th>
               <th>Cost</th>
               <th>Duration</th>
           </tr>
           </thead>
           <tbody>
             {this.state.leases.map((land)=>{
              return(land.laddr === this.state.account   && land.isBought===false ?
                <tr>
                  <td>{ land.landID}</td>
                  <td>{ land.landAddress}</td>
                  <td>{ land.soilType}</td>
                  {/* <td>{ land.cropType}</td> */}
                  <td>{ land.area}</td>
                  <td>{ land.cost}</td>
                  <td>{ land.duration}</td>
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
            

            {/* //land sale Records */}
  <div class="modal fade" id="myModal2" role="dialog">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Land Sale Record</h4>
        </div>
        <div class="modal-body">
          {
            <table class="table table-bordered table-dark table-striped">
            <thead>
            <tr>
                <th>Land ID</th>
                <th>Address</th>
                <th>Soil Type</th>
                <th>Area</th>
                <th>Cost</th>
            </tr>
            </thead>
            <tbody>
              {this.state.sales.map((land)=>{
               return(land.laddr === this.state.account && land.isBought===false ?
                 <tr>
                   <td>{ land.landID}</td>
                   <td>{ land.landAddress}</td>
                   <td>{ land.soilType}</td>
                   {/* <td>{ land.cropType}</td> */}
                   <td>{ land.area}</td>
                   <td>{ land.cost}</td>

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
            
  {/* Landlord Record */}
  <div class="modal fade" id="myModal3" role="dialog">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Landlord Record</h4>
        </div>
        <div class="modal-body">
          {
            <table class="table table-bordered table-dark table-striped">
            <thead>
            <tr>
                <th>Landlord ID</th>
                <th>Landlord Name</th>
                <th>Landlord Contact</th>
                <th>Landlord Address</th>
              </tr>
            </thead>
            <tbody>
              {this.state.landlordArrs.map((record)=>{
               return(
                 <tr>
                   <td>{record.landlordID}</td>
                   <td>{record.landlordName}</td>
                   <td>{record.landlordContact}</td>
                   <td>{record.landlordAddress}</td>
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
