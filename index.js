const express = require("express")
require('dotenv').config()
const ethers = require('ethers');
const loanABI = require('./loan.json')

const WSS = "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"		// Maninet RPC
var provider = new ethers.providers.JsonRpcProvider(WSS);

const loanAddress = '0x0828dCadB0f32a6757B00aA18B753056AA51200A';			// Mainnet Loan

const opKey = process.env.privatekey
const walletForControl = new ethers.Wallet(opKey, provider); //Loan Operator

const loanContract = new ethers.Contract(
	loanAddress,
	loanABI,
	walletForControl
)

const port = 3000;

const app = express();

const main = async () => {
	try {
		const collateralCount = await loanContract.getCollateralLen()
		const isSwap = await loanContract.isSwappable()
		console.log('loanEther:: swappable ', isSwap, collateralCount);
		if(collateralCount > 0 && isSwap) {
			await loanContract.swapAssets();
			console.log('loanEther:: swapAssets');
		}
	} catch (error) {
		console.log('transfer', error)
	}
}

app.listen(process.env.PORT || 3000, () => {
	console.log(`App start on port ${port}`);
});

app.get('/loanEther', async function (req, res) {

	main()
	res.send("loanEther:: success")
})

app.get('/', async function (req, res) {
	res.send("loanEther:: op request")
})