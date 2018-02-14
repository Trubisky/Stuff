const wallet = require('ethereumjs-wallet')
const Discord = require('discord.js')
const client = new Discord.Client()
const dataTable = {}
const web3 = require('web3')
const tx = require('ethereumjs-tx')
const fs = require('fs')
const Web3 = new web3(new web3.providers.HttpProvider('https://mainnet.infura.io/'))
const abiArray = JSON.parse(fs.readFileSync('tt3.json', 'utf-8'))
const privatex = null
const myAddress = '0x9fd0d65e6e16c3fcb12280e229a80c12f9bfc624'
const contractAddress = '0x554a39d838F18057A1F8A5191330Cc2D1522339f'
const contract = new Web3.eth.Contract(JSON.parse(abiArray['result']))
const {token} = require('./../keys')

const richEmbed = new Discord.RichEmbed()

client.on('ready', () => {
  console.log('I am ready!')
})

transferToken = (amount, reception, message) => {
  const data = Web3.eth.getTransactionCount(myAddress)

  data.then(acnt => {
    const multi = Math.pow(10, 12)
    const dataNeed = amount * multi
    const rawTxn = {
      nonce: Web3.utils.toHex(acnt),
      gasPrice: '0x3b9aca00',
      gasLimit: '0x030d40',
      to: contractAddress,
      value: '0x00',
      data: contract.methods.transfer(reception, dataNeed).encodeABI(),
      chainId: 1
    }

    const txn = new tx(rawTxn)

    txn.sign(new Buffer(privatex, 'hex'))

    const serializedTxn = txn.serialize()

    Web3.eth.sendSignedTransaction('0x' + serializedTxn.toString('hex'), (err, hash) => {
      if (!err) {
        message.author.send(`Congratulations! You have successfully withdrawn your CuriosityCoin to your private wallet. You have been credited ${dataTable[message.author.id]['balance']} CC. You may have to wait for the transaction to go through.`)
        dataTable[message.author.id]['balance'] = 0
        message.author.send(`Track your CC on the blockchain as it comes to you! Your TX is: * ${hash }'*`)
      } else {
        message.author.send('Transaction failed')
      }
    })
  })
}

openTip = (user, personal) => {
  const newAccount = wallet.generate()
  const privateKey = newAccount.getPrivateKeyString()
  const accountAddress = newAccount.getChecksumAddressString()

  user.send('Thank you for creating an account! Your account details are below. It is recommended to keep this information in a safe place and delete the following message. You may access your wallet using a service such as https://www.myetherwallet.com/')

  richEmbed.setTitle('Your wallet information')
  richEmbed.addField('Address', accountAddress)
  richEmbed.addField('Private Key (IMPORTANT - YOU NEED THIS - DO NOT SHARE IT)', privateKey)
  user.send(richEmbed)
  user.send('This address has been saved as your receiving address. All tips will be sent to this address in the future.')

  dataTable[user.id] = {balance: 0, address: accountAddress, privateKey: privateKey, linker: null}

  if (!personal) user.send('This message only has been sent to you because someone has sent you a tip - the tip will come through in a moment')
}

client.on('message', message => {
  if (message.content === '!createjar') {
    if (dataTable[message.author.id] === null) {
      openTip(message.author, true)
    } else {
      message.author.send('You already have a tip jar!')
    }
  } else if (message.content.startsWith('!tip')) {
    try {
      if (dataTable[message.author.id] != null) {
        const chunks = message.content.split(' ')
        const ignore = chunks[1]
        const amount = Number(chunks[2])

        const user = message.mentions.users.array()[0]

        if (!isNaN(amount)) {
          if (dataTable[message.author.id]['balance'] >= amount && amount > 0) {
            if (user != null && dataTable[user.id] === null) openTip(user, false)

            dataTable[user.id]['balance'] += amount
            dataTable[message.author.id]['balance'] = dataTable[message.author.id]['balance'] - amount
            user.send(`You have received a tip! ${message.author.username} from server ${message.guild.name} has sent you ${amount} CuriosityCoin`)
          }
        }
      } else {
        message.author.send('Sorry, it appears you do not have a wallet to send funds with. Create one with !createjar')
      }
    } catch (err) {
      message.author.send('Error: are you sure you put in the command correctly?')
    }
  } else if (message.content === '!airdropxx') {
    try {
      dataTable[message.author.id]['balance'] += 10
      message.author.send('Airdropped 10 CuriosityCoin')
    } catch (err) {
      openTip(message.author, true)
      dataTable[message.author.id]['balance'] += 10
      message.author.send('Airdropped 10 CuriosityCoin')
    }
  } else if (message.content === '!mybalance') {
    try {
      message.author.send(`You have ${dataTable[message.author.id]['balance'] } CuriosityCoin`)
    } catch (err) {
      openTip(message.author, true)

      message.author.send(`You have ${dataTable[message.author.id]['balance'] } CuriosityCoin`)
    }
  } else if (message.content === '!mywallet') {
    if (dataTable[message.author.id] !== null) {
      richEmbed.setTitle('Your wallet information')
      richEmbed.addField('Address', dataTable[message.author.id]['address'])
      richEmbed.addField('Private Key (IMPORTANT - YOU NEED THIS - DO NOT SHARE IT)', dataTable[message.author.id]['privateKey'])
      richEmbed.addField('My Balance (Not Cashed Out)', dataTable[message.author.id]['balance'] + ' CuriosityCoin')
      message.author.send(richEmbed)
    } else {
      message.author.send('It appears you do not have a wallet. Create one with !createjar')
    }
  } else if (message.content === '!cashout') {
    if (dataTable[message.author.id] != null) {
      if (dataTable[message.author.id]['balance'] > 5) {
        transferToken(dataTable[message.author.id]['balance'], dataTable[message.author.id]['address'], message)
        // current problem is trouble returning cash out results
      } else {
        message.author.send('Sorry, you need at least 5 Curiosity Coin to cash out to your linked eth wallet')
      }
    } else {
      message.author.send('Sorry, it appears you do not have a balance. Create one with !createjar')
    }
  }
})

client.login(token)
