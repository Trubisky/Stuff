//requirements
var wallet = require('ethereumjs-wallet');
const Discord = require("discord.js");
const client = new Discord.Client();
var datatable = {};
const web3 = require('web3');
var util = require('ethereumjs-util');
var tx = require('ethereumjs-tx');
fs = require('fs');
Web3 = new web3(new web3.providers.HttpProvider("https://mainnet.infura.io/"));
var abiArray = JSON.parse(fs.readFileSync('tt3.json', 'utf-8'));
var array2 = JSON.parse(abiArray["result"]);
var privatex = null
var myaddress = '0x9fd0d65e6e16c3fcb12280e229a80c12f9bfc624';
var contractAddress = "0x554a39d838F18057A1F8A5191330Cc2D1522339f";
const ws = require("ws");
var contract = new Web3.eth.Contract(array2);
var crp = require('crypto'),
algorithm = 'aes-256-ctr',
pass = null;
 
 //Here starts the code for deposits.
 const ethws = new ws('wss://socket.etherscan.io/wshandler', {
  perMessageDeflate: false
}); //Create socket listener
function alerts(){
	ethws.send('{"event": "ping"}')
} //Keep socket open

contxs = [{name: "EOS", method:"0xa9059cbb", address: "0x86fa049857e0209aa7d9e616f7eb3b3b78ecfdb0", decimals: 18}];
contxs.push({name: "XEI", method:"0xa9059cbb", address: "0x554a39d838F18057A1F8A5191330Cc2D1522339f", decimals: 12});
//Contract data; EOS just for socket testing
ethws.on('open', function open() {
  for (item of contxs){
	  ethws.send('{"event": "txlist", "address": "' + item["address"] + '"}'); 
	  console.log('success');
  }
 
  setInterval(alerts, 1000*10)
}); //Link sender listener and keep socket open
 
 
 ethws.on('message', function incoming(data) { //listen for new transactions
if (JSON.parse(data).event != "pong")
	to = null;
	amount = null;
	{
		try{
		for (item of JSON.parse(data)["result"])
		{
			for (contx of contxs){
				//console.log(item["to"]);
				if (item["to"].toLowerCase() == contx["address"].toLowerCase()) {
					//console.log("1");
					if (item["input"].substring(0, contx["method"].length) == contx["method"]){
					//	console.log("2");
						item["input"] = item["input"].substring(contx["method"].length);
						while (true){
							//console.log("3");
							if (item["input"].substring(0,1) == "0"){
								item["input"] = item["input"].substring(1, item["input"].length);
							} else {break};
						}
						to = "0x" + item["input"].substring(0, 40);
						console.log(contx["name"]);
						console.log(to); //all this shit is parsing the data string to figure out what the fuck you're sending
						console.log(parseInt(item["input"].substring(41), 16) / Math.pow(10, contx["decimals"]));
						amount = parseInt(item["input"].substring(41), 16) / Math.pow(10, contx["decimals"]);
						if (contx["name"] == "XEI"){
							console.log("GOT 1");
							for (key in datatable){
								if (datatable[key]["linker"].toLowerCase() == item["from"].toLowerCase()){
									console.log("GOT 2"); // if it's to the hotwallet and a member in the sevrer has the same address
									if (myaddress.toLowerCase() == to.toLowerCase()){
										
										console.log("FOUND SEND");
										userx = null;
										for (usx of client.users.array()){ //find user
											if (usx.id == Number(key)){
												userx = usx;
												break;
											}
										}
										
										userx.send("Your deposit has been received! " + amount + " XEI has been added to your balance.");
										datatable[key]["balance"]+= amount; //add shit and exit
										console.log(userx);
									
									
									}
								}
							}
						}
					}
				}
			}
			
			
		}
		} catch(err) {console.log(err)}
	}
  
});
 

 //Deposit code ends here
 
 
client.on("ready", () => {
  console.log("I am ready!");
   loaddata();
   setInterval(function(){savedata();}, 60000); //save loop
});

function encrypt(texto){
  var cipher = crp.createCipher(algorithm,pass) //ignore
  var crypted = cipher.update(texto,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}

function decrypt(texto){
  var decipher = crp.createDecipher(algorithm,pass)
  var dec = decipher.update(texto,'hex','utf8') //ignore
  dec += decipher.final('utf8');
  return dec;
}
//Data saving and loading to JSON BELOW
function savedata(){
	if ((datatable != {}) || (datatable != null)) {
	datatosave = JSON.stringify(datatable);
	console.log(datatable);
	fs.writeFile(__dirname + "/hotwallet.data", datatosave, (cb) => {});
	fs.writeFile(__dirname + "/hotwalletbackup.data", datatosave, (cb) => {});
	console.log(datatosave);
	console.log('saved data');
	backup = {};
	for (i in datatable)
	{backup[i]=datatable[i];} 
	}
	else
	{
		datatable = {};
		for (i in backup){ //restore backup if issue
			datatable[i] = backup[i];
		}
	}
	//fs.writeFile(__dirname + "/hotwallet.crypt", encrypt(datatosave), (cb) => {});
	//fs.writeFile(__dirname + "/hotwallet.dec", decrypt(encrypt(datatosave)), (cb) => {});
	//old testing stuff
}

function loaddata(){
	try{
	 exitsuccess = false;
	 var page = fs.readFileSync(__dirname + "/hotwallet.data", 'utf-8');
	 for (i=1;i<5;i++){
		 try{
			 datatable = JSON.parse(page); //simple loop to trttry if the JSON errors when loading
			 exitsuccess = true;
			 break;
		 }
		 catch (error) {
			 exitsuccess = false;
		 }
	 }
	 if (exitsuccess == false) {
		 process.exit(); //exit if the data has issues in order to not corrupt it
	 }
	}
	catch(err) {console.log(err); console.log('no data found, creating blank'); if ((page != null) && (page != "")){process.exit();} }
	
}
//Generate transaction for XEI and send it over the net
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
Tx.sign(new Buffer(privatex, 'hex')); //generate and sign transaction
var serializedTx = Tx.serialize();
Web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
  if (!err){
    console.log(hash); 
	 message.author.send("Congratulations! You have successfully withdrawn your CuriosityCoin to your private wallet. You have been credited " + datatable[message.author.id]["balance"] + " CC. You may have to wait for the transaction to go through.");
	 datatable[message.author.id]["balance"] = 0; 
	 message.author.send('Track your CC on the blockchain as it comes to you! Your TX is: *' + hash + "*"); //report transaction to user
  }
  else{
	  console.log('error');
	  message.author.send('Transaction failed');
	  console.log(err);
	  
  }
});
});
}
//create new users wallet

function opentip(user, personal){
	  var newacc = wallet.generate();
	  var pkey = newacc.getPrivateKeyString(); //create new shit and save it
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
  { //handler for new wallets
	 if (datatable[message.author.id] == null){
		 opentip(message.author, true);
	 }
	 else{
		 message.author.send("You already have a tip jar!");
	 }
  } 
  else if (message.content.startsWith("!tip")){
	  //actual tipping function
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
  //REMOVE THIS COMMAND IN THE FUTURE
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
  //check wallet balance
  else if (message.content == "!mybalance"){
	  try {
		  message.author.send('You have ' +  datatable[message.author.id]["balance"] + ' CuriosityCoin');
	  }
	  catch(err){
		  opentip(message.author,true)
		  message.author.send('You have ' +  datatable[message.author.id]["balance"] + ' CuriosityCoin');
	  }
	  
  }
  //show wallet details
  else if (message.content == "!mywallet")
  {
	  if (datatable[message.author.id] != null){
	  ne = new Discord.RichEmbed();
	  ne.setTitle("Your wallet information");
	  ne.addField("Address", datatable[message.author.id]["address"]);
	  ne.addField('Private Key (IMPORTANT - YOU NEED THIS - DO NOT SHARE IT)', datatable[message.author.id]["privatekey"]);
	  ne.addField('My Balance (Not Cashed Out)', datatable[message.author.id]["balance"] + " CuriosityCoin");
	  ne.addField('My Linked Sending Address', datatable[message.author.id]["linker"]);
	  message.author.send(ne);
	  }
	  else {
		  message.author.send('It appears you do not have a wallet. Create one with !createjar');
	  }
  }
  //generate transaction to stored wallet
  else if(message.content == "!cashout"){
	   if (datatable[message.author.id] != null){
		   if (datatable[message.author.id]["balance"] >= 5){

			   transferxei(datatable[message.author.id]["balance"], datatable[message.author.id]["address"], message);
			
			   //current problem is trouble returning cash out results
		   } else {message.author.send("Sorry, you need at least 5 Curiosity Coin to cash out to your linked eth wallet");}
		   
	   }
	   else{
		   message.author.send("Sorry, it appears you don't have a balance. Create one with !createjar");
	   }
	  
  }
  //add reception address
  else if (message.content.startsWith("!link")) {
	  address = message.content.split(" ")[1];
	  if ((address.length == 42) && (address.startsWith("0x"))) {
		  message.author.send("Successfully linked your account! This account will be used for depositing tokens in the future - you may link a new account over this with the same command");
		  datatable[message.author.id]["linker"] = address;
	  }
	  else{
		  message.author.send("Sorry, are you sure you've typed a valid sender address?");
	  }
	  
	  
  }
});


client.login(null);