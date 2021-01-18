import React from 'react';
//import './insurance.css';
import HealthCare from "./contracts/SupplyChain.json";
import Web3 from "web3";

 export default class Insurance extends React.Component{
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
    const networkData = HealthCare.networks[networkId]
    if(networkData) {
      this.health = new web3.eth.Contract(HealthCare.abi, networkData.address)
      const recordCount = await this.health.methods.recordCount().call()
      let recordArr = [];
      let record = [];
      for(let i=0;i<recordCount;i++)
      {
        recordArr.push(await this.health.methods.recordsArr(i).call())
      }
      for(let i=0;i<recordArr.length;i++)
      {
        record.push(await this.health.methods._records(recordArr[i]).call())  
      }
      this.setState({records:record})
    }
  }
  constructor(props) {
    super(props);
    this.state = {
      records:[]
    };
  }
   render(){
     return(
      <div className="col-md-12">
      <h3  className="text-center">Insurance Page</h3>
      <div className="c-list">
      <h2 className="text-center">Approved Records</h2>
        <table class="table table-bordered table-striped">
        <thead>
             <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Date</th>
                <th>Hospital Name</th>
                <th>Price</th>
                <th>Approved</th>
             </tr>
             </thead>
             <tbody>
                {this.state.records.map((record)=>{
                 return(record.signatureCount==="2"?
                   <tr>
                     <td>{record.ID}</td>
                     <td>{record.testName}</td>
                     <td>{record.date}</td>
                     <td>{record.hospitalName}</td>
                     <td>{record.price}</td>
                     <td>({record.signatureCount}/2) Approved</td>
                   </tr>:null
                 ) 
                })}
             </tbody>
          </table>
         </div>
       </div>
     );
   }
 }
