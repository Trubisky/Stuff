var wallet = require('ethereumjs-wallet');
const Discord = require("discord.js");
const client = new Discord.Client();
const datatable = {};
const web3 = require('web3');
var util = require('ethereumjs-util');
var tx = require('ethereumjs-tx');
fs = require('fs');
Web3 = new web3(new web3.providers.HttpProvider("https://mainnet.infura.io/"));
var abiArray = JSON.parse(fs.readFileSync('tt3.json', 'utf-8'));
var array2 = JSON.parse(abiArray["result"]);
var privatex = null;
var myaddress = '0x9fd0d65e6e16c3fcb12280e229a80c12f9bfc624';
var contractAddress = "0x554a39d838F18057A1F8A5191330Cc2D1522339f";
var contract = new Web3.eth.Contract(array2);
 
client.on("ready", () => {
  console.log("I am ready!");
});

function transferxei(amount, reception, message){
var data = Web3.eth.getTransactionCount(myaddress);
data.then(acnt => {
multi = Math.pow(10, 12);
dataneed = amount * multi;
var rawtx = {
  nonce: Web3.utils.toHex(acnt),
  gasPrice: '0x3b9aca00', 
  gasLimit: '0x030d40', 
  to: contractAddress,
  value: '0x00',
  data: contract.methods.transfer(reception, dataneed).encodeABI(),
  chainId: 1
}
var Tx = new tx(rawtx);
Tx.sign(new Buffer(privatex, 'hex'));
var serializedTx = Tx.serialize();
Web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
  if (!err){
    console.log(hash); 
	 message.author.send("Congratulations! You have successfully withdrawn your CuriosityCoin to your private wallet. You have been credited " + datatable[message.author.id]["balance"] + " CC. You may have to wait for the transaction to go through.");
	 datatable[message.author.id]["balance"] = 0;
	 message.author.send('Track your CC on the blockchain as it comes to you! Your TX is: *' + hash + "*");
  }
  else{
	  console.log('error');
	  message.author.send('Transaction failed');
	  console.log(err);
	  
  }
});
});
}


function opentip(user, personal){
	  var newacc = wallet.generate();
	  var pkey = newacc.getPrivateKeyString();
	  var add = newacc.getChecksumAddressString();
	  user.send('Thank you for creating an account! Your account details are below. It is recommended to keep this information in a safe place and delete the following message. You may access your wallet using a service such as  https://www.myetherwallet.com/');
	  ne = new Discord.RichEmbed();
	  ne.setTitle("Your wallet information");
	  ne.addField("Address", add);
	  ne.addField('Private Key (IMPORTANT - YOU NEED THIS - DO NOT SHARE IT)', pkey);
	  user.send(ne);
	  user.send("This address has been saved as your receiving address. All tips will be sent to this address in the future.");
	  datatable[user.id] = {balance: 0, address: add, privatekey: pkey, linker: null};
	  if (personal == false){
	  user.send("This message only has been sent to you because someone has sent you a tip - the tip will come through in a moment");}
}

client.on("message", (message) => {
  if (message.content == "!createjar")
  {
	 if (datatable[message.author.id] == null){
		 opentip(message.author, true);
	 }
	 else{
		 message.author.send("You already have a tip jar!");
	 }
  } 
  else if (message.content.startsWith("!tip")){
	  try{
	   if (datatable[message.author.id] != null){
		
	  chunks = message.content.split(" ");
	  ignore = chunks[1];
	  amount = Number(chunks[2]);
      user = message.mentions.users.array()[0];
	  if (!isNaN(amount)){
		  if (datatable[message.author.id]["balance"] >= amount && amount > 0){
	  if (user != null && datatable[user.id] == null){
			opentip(user, false);
	  }
	  datatable[user.id]["balance"] += amount;
	  datatable[message.author.id]["balance"] =  datatable[message.author.id]["balance"] - amount;
	  user.send('You have recieved a tip! ' + message.author.username + ' from server ' + message.guild.name + 'has sent you ' + amount + ' CuriosityCoin');
	  
	  }}
	   }
	   else{
		   message.author.send('Sorry, it appears you do not have a wallet to send funds with. Create one with !createjar');
	   }
	  }
	  catch(err)
	  {
		  message.author.send('Error: are you sure you put in the command correctly?');
	  }
  }
  else if (message.content == "!airdropxx"){
	  try{
	   datatable[message.author.id]["balance"] += 10;
	   message.author.send('Airdropped 10 CuriosityCoin');  
	  }
	  catch(err) {
		  opentip(message.author,true)
		  datatable[message.author.id]["balance"] += 10;
		   message.author.send('Airdropped 10 CuriosityCoin'); 
	  } 
  }
  else if (message.content == "!mybalance"){
	  try {
		  message.author.send('You have ' +  datatable[message.author.id]["balance"] + ' CuriosityCoin');
	  }
	  catch(err){
		  opentip(message.author,true)
		  message.author.send('You have ' +  datatable[message.author.id]["balance"] + ' CuriosityCoin');
	  }
	  
  }
  else if (message.content == "!mywallet")
  {
	  if (datatable[message.author.id] != null){
	  ne = new Discord.RichEmbed();
	  ne.setTitle("Your wallet information");
	  ne.addField("Address", datatable[message.author.id]["address"]);
	  ne.addField('Private Key (IMPORTANT - YOU NEED THIS - DO NOT SHARE IT)', datatable[message.author.id]["privatekey"]);
	  ne.addField('My Balance (Not Cashed Out)', datatable[message.author.id]["balance"] + " CuriosityCoin");
	  message.author.send(ne);
	  }
	  else {
		  message.author.send('It appears you do not have a wallet. Create one with !createjar');
	  }
  }
  else if(message.content == "!cashout"){
	   if (datatable[message.author.id] != null){
		   if (datatable[message.author.id]["balance"] > 5){

			   transferxei(datatable[message.author.id]["balance"], datatable[message.author.id]["address"], message);
			
			   //current problem is trouble returning cash out results
		   } else {message.author.send("Sorry, you need at least 5 Curiosity Coin to cash out to your linked eth wallet");}
		   
	   }
	   else{
		   message.author.send("Sorry, it appears you don't have a balance. Create one with !createjar");
	   }
	  
  }
});


client.login(null);