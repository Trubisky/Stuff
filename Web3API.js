const web3 = require('web3');
var util = require('ethereumjs-util');
var tx = require('ethereumjs-tx');
fs = require('fs');
var myaddress = '0x9fd0d65e6e16c3fcb12280e229a80c12f9bfc624';
//var lightwallet = require('eth-lightwallet');
//var txutils = lightwallet.txutils;
var fromx = '0x9Fd0D65e6E16C3FcB12280e229A80C12f9bfC624';
Web3 = new web3(new web3.providers.HttpProvider("https://mainnet.infura.io/"));
//balance = Web3.eth.getBalance("0x9fd0d65e6e16c3fcb12280e229a80c12f9bfc624", "latest");
//balance.then(data => {console.log(data);});
var privatex = '8152002fe2f456ec6eb6983292885019b4b9a51e305dcb1f0f8a1881db396348'
var data = Web3.eth.getTransactionCount(fromx);
var abiArray = JSON.parse(fs.readFileSync('tt3.json', 'utf-8'));
var array2 = JSON.parse(abiArray["result"]);


console.log(array2);
var acnt;
data.then(address => {
acnt = address
console.log(acnt);
amountofxei = 1
multi = Math.pow(10, 12);
dataneed = amountofxei * multi;
 var contractAddress = "0x554a39d838F18057A1F8A5191330Cc2D1522339f";
 var contract = new Web3.eth.Contract(array2);



	var rawtx = {
  nonce: Web3.utils.toHex(acnt),
  gasPrice: '0x3b9aca00', 
  gasLimit: '0x030d40', 
  to: contractAddress,
  value: '0x00',
  data: contract.methods.transfer("0xCE631c3db95c09e5Cadc391268E5dEFeF257572a", 25 * multi).encodeABI(),
  chainId: 1
}

var Tx = new tx(rawtx);
Tx.sign(new Buffer(privatex, 'hex'));
var serializedTx = Tx.serialize();
console.log(serializedTx.toString('hex'));
Web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
  if (!err){
    console.log(hash); 
  }
  else{
	  console.log('error');
	  console.log(err);
  }
});


//console.log(newdatabase);
	
	});

	//0xa9059cbb000000000000000000000000ce631c3db95c09e5cadc391268e5defef257572a000000000000000000000000000000000000000000000000000000e8d4a51000 -- 1 xei
	//0xa9059cbb0000000000000000000000009fd0d65e6e16c3fcb12280e229a80c12f9bfc624000000000000000000000000000000000000000000000000000000e8d4a51000
	//0xa9059cbb0000000000000000000000009fd0d65e6e16c3fcb12280e229a80c12f9bfc624000000000000000000000000000000000000000000000000000000e8d4a51000
	
	//0xa9059cbb000000000000000000000000ce631c3db95c09e5cadc391268e5defef257572a000000000000000000000000000000000000000000000000000000e8d4a51000
	//0xa9059cbb000000000000000000000000ce631c3db95c09e5cadc391268e5defef257572a000000000000000000000000000000000000000000000000000009184e72a000
	//
	
	 
//	 