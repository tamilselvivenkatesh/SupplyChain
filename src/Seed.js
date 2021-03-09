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
      const seedCount = await this.supply.methods.seedCount().call()
      const fertilizerCount = await this.supply.methods.fertilizerCount().call()

      let seedArr = [];
      let seed = [];
      let fertilizerArr =[];
      let fertilizer=[];
      for(let i=0;i<seedCount;i++)
      {
        seedArr.push(await this.supply.methods.seedArr(i).call())
      }
      for(let i=0;i<seedArr.length;i++)
      {
        seed.push(await this.supply.methods.mseed(seedArr[i]).call())  
      }
      this.setState({seeds:seed})
      for(let i=0;i<fertilizerCount;i++)
      {
        fertilizerArr.push(await this.supply.methods.fertilizerArr(i).call())
      }
      for(let i=0;i<fertilizerArr.length;i++)
      {
        fertilizer.push(await this.supply.methods.mfertilizer(fertilizerArr[i]).call())  
      }
      this.setState({fertilizers:fertilizer})
      let dealerArr = [];
      dealerArr.push(await this.supply.methods.mdealer(this.state.account).call())   
      this.setState({dealerArrs:dealerArr})
      this.setState({isDetailsFilled:this.state.dealerArrs[0].isValue})
    }
  }
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleSeedClick = this.handleSeedClick.bind(this);
    this.handleFertilizerClick = this.handleFertilizerClick.bind(this);
    this.handleSeed=this.handleSeed.bind(this);
    this.handleFertilizer=this.handleFertilizer.bind(this);
    this.state = {
      dealerID:"",
      dealerName:"",
      dealerAddress:"",
      dealerContact:"",
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
      dealerArrs: [],
      daddr:"",
      isDetailsFilled:false,
      isBought:false,
      isSeed:false,
      isFertilizer:false
    };
  }

  handleClick(event) {
    event.preventDefault();
    window.web3.eth.getCoinbase((err, account) => {
    this.setState({account:account})
    this.supply.methods.newSeedDealer(
        this.state.dealerID,
        this.state.dealerName,
        this.state.dealerContact,
        this.state.dealerAddress).send({ from: account}).then(()=>{ this.setState({ message: "Dealer Details Entered" });  window.location.reload(false);});
      })
    }

    handleSeedClick(event) {
        event.preventDefault();
        window.web3.eth.getCoinbase((err, account) => {
        this.setState({account:account})
        this.supply.methods.newSeed(
            this.state.seedID,
            this.state.seedName,
            this.state.seedcost,
            this.state.seedQuantity).send({ from: account}).then(()=>{ this.setState({ message: "Seed Details Entered" });  window.location.reload(false);});
        })
    }

    handleFertilizerClick(event) {
        event.preventDefault();
        window.web3.eth.getCoinbase((err, account) => {
        this.setState({account:account})
        this.supply.methods.newFertilizer(
            this.state.fertilizerID,
            this.state.fertilizerName,
            this.state.fertilizerCost,
            this.state.fertilizerQuantity).send({ from: account}).then(()=>{ this.setState({ message: "Fertilizer Details Entered" });  window.location.reload(false);});
        })
    }
    
    handleSeed(event)
    {
      event.preventDefault();
      this.setState({ isSeed: !this.state.isSeed })  
      this.setState({isFertilizer:false})
    }
     handleFertilizer(event)
     {
        event.preventDefault();
        this.setState({ isFertilizer: !this.state.isFertilizer })
        this.setState({isSeed:false})
     }
 


    // handlePurchase(event) {
    //    event.preventDefault();
    //    let id=event.target.value;
    //   // console.log(id);
    //   window.web3.eth.getCoinbase((err, account) => {
    //   this.setState({account}) 
    //   this.supply.methods.distAddCrop(id).send({ from: account}).then(()=>{ this.setState({ message: "New Crop Added" });  window.location.reload(false);});
    //     })
    //    }

  render() {
    return (
      <div className="container container-fluid login-conatiner">
        <div className="col-md-4">
          {this.state.isDetailsFilled ? null:
        <div className="login-form">
            <form method="post" autoComplete="off">
              <h2 className="text-center">Seed/Fertilizer Dealer Details</h2>
              <div className="form-group">
                <input
                  type="number" pattern ="[0-9]*" inputmode="numeric"
                  value={this.state.dealerID}
                  onChange={event =>
                    this.setState({ dealerID: event.target.value })
                  }
                  className="form-control"
                  placeholder="ID"
                />
              </div>
              <div className="form-group">
                <input
                  type="text" 
                  value={this.state.dealerName}
                  onChange={event =>
                    this.setState({ dealerName: event.target.value })
                  }
                  className="form-control"
                  placeholder="Name"
                />
              </div>
              <div className="form-group">
                <input
                  type="number" pattern ="[0-9]*" inputmode="numeric"
                  value={this.state.dealerContact}
                  onChange={event =>
                    this.setState({ dealerContact: event.target.value })
                  }
                  className="form-control"
                  placeholder="Contact"
                />
              </div>
               <div className="form-group">
                <input
                  type="text"
                  value={this.state.dealerAddress}
                  onChange={event =>
                    this.setState({ dealerAddress: event.target.value })
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
                   onClick={this.handleSeed}
                >
                  Add Seed
                </button>
              </div>
              <div className="form-group">
                <button
                  className="btn btn-primary btn-block"
                   onClick={this.handleFertilizer}
                >
                  Add Fertilizer
                </button>
              </div>
              </form>
              </div> : null}

       { this.state.isSeed ? 
      
         <div className="login-form">
        <form method="post" autoComplete="off">
          <h2 className="text-center">Seed Details</h2>
          <div className="form-group">
            <input
              type="number" pattern ="[0-9]*" inputmode="numeric"
              value={this.state.seedID}
              onChange={event =>
                this.setState({ seedID: event.target.value })
              }
              className="form-control"
              placeholder="ID"
            />
          </div>
          
          <div className="form-group">
            <input
             type ="text"
              value={this.state.seedName}
              onChange={event =>
                this.setState({ seedName: event.target.value })
              }
              className="form-control"
              placeholder="Seed Name"
            />
          </div>

          <div className="form-group">
            <input
             type ="text"
              value={this.state.seedcost}
              onChange={event =>
                this.setState({ seedcost: event.target.value })
              }
              className="form-control"
              placeholder="Cost"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              value={this.state.seedQuantity}
              onChange={event =>
                this.setState({ seedQuantity: event.target.value })
              }
              className="form-control"
              placeholder="Quantity"
            />
          </div>
          <div className="form-group">
            <button
              className="btn btn-primary btn-block"
              onClick={this.handleSeedClick}
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
       { this.state.isFertilizer?
        //sale form
        <div className="login-form">
        <form method="post" autoComplete="off">
          <h2 className="text-center">Fertilizer Details</h2>
          <div className="form-group">
            <input
              type="number" pattern ="[0-9]*" inputmode="numeric"
              value={this.state.fertilizerID}
              onChange={event =>
                this.setState({ fertilizerID: event.target.value })
              }
              className="form-control"
              placeholder="ID"
            />
          </div>
          
          <div className="form-group">
            <input
             type ="text"
              value={this.state.fertilizerName}
              onChange={event =>
                this.setState({ fertilizerName: event.target.value })
              }
              className="form-control"
              placeholder="Name"
            />
          </div>

          <div className="form-group">
            <input
             type ="text"
              value={this.state.fertilizerCost}
              onChange={event =>
                this.setState({ fertilizerCost: event.target.value })
              }
              className="form-control"
              placeholder="Cost"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              value={this.state.fertilizerQuantity}
              onChange={event =>
                this.setState({ fertilizerQuantity: event.target.value })
              }
              className="form-control"
              placeholder="Quantity"
            />
          </div>
          <div className="form-group">
            <button
              className="btn btn-primary btn-block"
              onClick={this.handleFertilizerClick}
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
                   {/* Seed Records   */}
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
                <th>Seed Name</th>
                <th>Cost</th>
                <th>Quantity</th>
            </tr>
            </thead>
            <tbody>
              {this.state.seeds.map((seed)=>{
               return(seed.saddr === this.state.account   && seed.isBought===false ?
                 <tr>
                   <td>{ seed.seedID}</td>
                   <td>{ seed.seedName}</td>
                   <td>{ seed.seedcost}</td>
                   <td>{ seed.seedQuantity}</td>
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
           
            {/* //Fertilizer Records */}
            <button type="button" class="btn btn-success pull-right btn-lg" data-toggle="modal" data-target="#myModal2">Fertilizer Records</button>
  <div class="modal fade" id="myModal2" role="dialog">
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
                <th>Fertilizer Name</th>
                <th>Cost</th>
                <th>Quantity</th>
            </tr>
            </thead>
            <tbody>
              {this.state.fertilizers.map((fertilizer)=>{
               return(fertilizer.saddr === this.state.account && fertilizer.isBought===false ?
                 <tr>
                   <td>{ fertilizer.fertilizerID}</td>
                   <td>{ fertilizer.fertilizerName}</td>
                   <td>{ fertilizer.fertilizerCost}</td>
                   <td>{ fertilizer.fertilizerQuantity}</td>
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
  {/* Seed/Fertilizer Dealer Record */}
  <button type="button" class="btn btn-success pull-right btn-lg" data-toggle="modal" data-target="#myModal3"> Seed/Fertilizer Dealer Record</button>
  <div class="modal fade" id="myModal3" role="dialog">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title"> Seed/Fertilizer Dealer Record</h4>
        </div>
        <div class="modal-body">
          {
            <table class="table table-bordered table-dark table-striped">
            <thead>
            <tr>
                <th>Dealer ID</th>
                <th>Dealer Name</th>
                <th>Dealer Contact</th>
                <th>Dealer Address</th>
              </tr>
            </thead>
            <tbody>
              {this.state.dealerArrs.map((record)=>{
               return(
                 <tr>
                   <td>{record.dealerID}</td>
                   <td>{record.dealerName}</td>
                   <td>{record.dealerContact}</td>
                   <td>{record.dealerAddress}</td>
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
