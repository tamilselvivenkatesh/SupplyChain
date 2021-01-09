pragma solidity ^0.5.16;

contract SupplyChain{
    //model a farmer
   struct Farmer {
       uint farmerID;
       string farmerName;
       uint farmerContact;
      string farmerAddress;
       address faddr;
       bool isValue;
   }

   //model crop
    struct Crop{
       uint cropID;
       string cropName;
       uint quantity;
       uint cropPrice;
        address faddr;      
         //string fertilizer_name;
       //string soil_name;
   } 

   //model a distributor
   struct Distributor{
       uint distID;
       string distName;
       uint distContact;
       string distAddress;
       address daddr;
       bool isValue;
   }
   
   //model a retailer
   struct Retailer{
       uint retailID;
       string retailName;
       uint retailContact;
       string  retailAddress;
       address raddr;
       bool isValue;
   }
   
   mapping(address => Farmer) public mfarmer;
   mapping(uint => Crop) public mcrop;
   mapping(address => Distributor) public mdist;
   mapping(address => Retailer) public mretail;

   //count of crop
   uint[] public cropArr;
   uint public farmerCount;
   uint public cropCount;
   uint public distCount;
   uint public retailCount;

   // event for farmer
   event farmerCreated (
       uint farmerID,
       string farmerName,
       uint farmerContact,
      string farmerAddress
   );

   // event for crop
   event cropCreated (
       uint cropID,
       string cropName,
       uint quantity,
       uint cropPrice,
       address faddr
   );

   //event for distributor 
   event distCreated (
       uint distID,
       string distName,
       string distAddress
   );
   
   //event for retailer
   event retailCreated (
       uint retailID,
       string retailName,
       string retailAddress
   );

    //add new farmer
    function newFarmer(
        uint _farmerID,
        string memory _farmerName,
        uint _farmerContact,
        string memory _farmerAddress
    ) public {
        Farmer storage _newfarmer = mfarmer[msg.sender];

        // Only allows new records to be created
        require(!mfarmer[msg.sender].isValue);
        _newfarmer.faddr = msg.sender;
        _newfarmer.farmerID = _farmerID;
        _newfarmer.farmerName = _farmerName;
        _newfarmer.farmerAddress = _farmerAddress;
        _newfarmer.farmerContact = _farmerContact;
        _newfarmer.isValue = true;
        farmerCount++;
        emit farmerCreated(_newfarmer.farmerID, _farmerName, _farmerContact,_farmerAddress);
    }

    //add crop by old farmer
     function addCrop(
        uint _cropID,
        string memory _cropName,
        uint _quantity,
        uint _cropPrice
    ) public {
        Crop storage _newcrop = mcrop[_cropID];
        //Farmer storage _newfarmer = mfarmer[_farmerID];

        _newcrop.faddr = msg.sender;
        _newcrop.cropID = _cropID;
        _newcrop.cropName = _cropName;
        _newcrop.quantity = _quantity;
        _newcrop.cropPrice = _cropPrice;
        cropCount++;
        cropArr.push(_cropID);
        emit cropCreated(_newcrop.cropID, _cropName, _quantity, _cropPrice, _newcrop.faddr);
    }

    //add new distributor
    function addDist(
        uint _distID,
        string memory _distName,
        string memory _distAddress
    ) public {
        Distributor storage _newdist = mdist[msg.sender];

        require(!mdist[msg.sender].isValue);
        _newdist.daddr = msg.sender;
        _newdist.distID = _distID;
        _newdist.distName = _distName;
        _newdist.distAddress = _distAddress;
        distCount++;
        emit distCreated(_newdist.distID, _distName, _distAddress);
    }

   
    //add new retailer
    function addRetail(
        uint _retailID,
        string memory _retailName,
        string memory _retailAddress
    ) public {
        Retailer storage _newretail = mretail[msg.sender];
        require(!mretail[msg.sender].isValue);
        _newretail.raddr = msg.sender;
        _newretail.retailID = _retailID;
        _newretail.retailName = _retailName;
        _newretail.retailAddress = _retailAddress;
        retailCount++;
        emit retailCreated(_newretail.retailID, _retailName, _retailAddress);
    }
}