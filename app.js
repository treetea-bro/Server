const express = require("express");
const app = express();
const Web3 = require("web3");
const nftABI = require("./nftABI");

const privateKey = `bc5d4ef2324a7f8b488b92ffec3076b3ebe2d03ba52cefe3217feeb91ac3d4b2`;
const fromAddress = `0x4CEC56Ec01dB05f69dBe8249B8cDd95cAe286178`;
const toAddress = `0x9a3BB1d4a14e4B75B4cD785f3BE201D648ba6B31`;

const CA = `0x892A372AA7847B7175BAde20d9570E1F8f55e7A9`;

let web3;

const connect = () => {
  web3 = new Web3("http://localhost:8545");
};

const sendSignedTx = async (fromAddress, toAddress, value, data) => {
  const tx = {
    from: fromAddress,
    to: toAddress,
    value,
    data,
  };

  const nonce = await web3.eth.getTransactionCount(fromAddress);
  const gasLimit = await web3.eth.estimateGas(tx);
  tx.nonce = nonce;
  tx.gas = gasLimit;
  console.log("tx", tx);
  const signTx = await web3.eth.accounts.signTransaction(tx, privateKey);
  console.log("signTx", signTx);
  const result = await web3.eth.sendSignedTransaction(signTx.rawTransaction);
  console.log("result", result);
};

const callSCF = async () => {
  const contract = new web3.eth.Contract(nftABI, CA);
  const func = contract.methods.safeMint(fromAddress, "https://www.naver.com");
  const callData = func.encodeABI();
  console.log(callData);
  const result = await sendSignedTx(fromAddress, CA, 0, callData);
};

app.get("/", (req, res) => {
  connect();
  callSCF();
  res.json("Hello world");
});

app.listen(3001, () => {
  console.log("서버연결 성공");
});
