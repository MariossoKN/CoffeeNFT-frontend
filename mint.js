import { initializeContract } from "./wallet.js";

let mintedAmount = await getCurrentSupply();
const maxMintAmount = await getTotalSupply();

const mintContractStatusContainer = document.getElementById('contract-status');
console.log(mintContractStatusContainer)
if (await getMintStatus() === false) {
    mintContractStatusContainer.innerHTML = `
    <div class="mint-contract-status" id="contract-status">Mint Status: &nbsp;
        <span class="led-closed">&#10625; </span>
        <span class="status-closed">Closed</span>
    </div>
    `
} else {
    mintContractStatusContainer.innerHTML = `
    <div class="mint-contract-status" id="contract-status">Mint Status: &nbsp;
        <span class="led-open">&#10625; </span>
        <span class="status-open">Open</span>
    </div>
    `
}

const mintAmountElement = document.getElementById('mint-mount');
mintAmountElement.innerHTML = `
    Total minted: ${mintedAmount} / ${maxMintAmount}
`

const mintButton = document.getElementById('mint-button');
const inputAmount = document.getElementById('nft-quantity');
const mintSection = document.getElementById('mint-section-id');

mintButton.addEventListener('click', async () => {
    if (inputAmount.value === '') {
        alert('Please enter a valid number of NFTs to mint.');
        return;
    }

    const mintStatus = await getMintStatus();
    if (mintStatus === false) {
        alert('Minting is closed/paused.')
        return;
    }

    const mint = mintNft(Number(inputAmount.value));

    mintSection.innerHTML = `
        <h2>Thank you!</h2>
        <p>☕ You succesfully minted ${inputAmount.value} ${checkIfOneNft()} ☕</p>
        <div class="mint-another-container">
            <a class="mint-another" href="mint.html">Mint Another One</a>
        </div>
        <p>Total minted: ${mintedAmount} / ${maxMintAmount}</p>
    `

    inputAmount.value = '';
})


function checkIfOneNft() {
    if (Number(inputAmount.value) === 1) {
        return "NFT";
    } else {
        return "NFTs";
    }
}

async function getMintPrice() {
    const contract = await initializeContract();

    try {
        const mintPrice = await contract.methods.getMintPrice().call();
        console.log('NFT mint price:', mintPrice);
        return mintPrice;
    } catch (error) {
        console.error('Error getting balance:', error);
    }
}
getMintStatus()
async function getMintStatus() {
    const contract = await initializeContract();

    try {
        const mintStatus = await contract.methods.getMintStatus().call();
        console.log('NFT mint status:', mintStatus);
        return mintStatus;
    } catch (error) {
        console.error('Error getting balance:', error);
    }
}

async function getMintAmount() {
    const contract = await initializeContract();
    const accounts = await window.ethereum.request({ method: "eth_accounts" });

    try {
        const mintAmount = await contract.methods.getMintAmount(accounts[0]).call();
        console.log(`Address ${accounts[0].slice(0, 7)}...${accounts[0].slice(37, 42)} minted ${mintAmount} NFTs so far.`);
        return mintAmount;
    } catch (error) {
        console.error('Error getting balance:', error);
    }
}
getMaxMintAmount()
async function getMaxMintAmount() {
    const contract = await initializeContract();
    const mintAmount = await getMintAmount();
    try {
        const maxMintAmount = await contract.methods.getMaxMintAmount().call();
        console.log(`You can mint ${(Number(maxMintAmount) - Number(mintAmount))} NFTs.`);
        return maxMintAmount;
    } catch (error) {
        console.error('Error getting balance:', error);
    }
}

async function getTotalSupply() {
    const contract = await initializeContract();

    try {
        const totalSupply = await contract.methods.getTotalSupply().call();
        console.log(`Total NFT supply: ${Number(totalSupply) / 10 ** 18}`);
        return Number(totalSupply) / 10 ** 18;
    } catch (error) {
        console.error('Error getting balance:', error);
    }
}

async function getCurrentSupply() {
    const contract = await initializeContract();

    try {
        const currentSupply = await contract.methods.getCurrentSupply().call();
        console.log(`Current NFT supply: ${currentSupply}`);
        return currentSupply;
    } catch (error) {
        console.error('Error getting balance:', error);
    }
}

async function mintNft(mintAmount) {
    const contract = await initializeContract();
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    const mintPrice = await getMintPrice();

    try {
        const tx = await contract.methods.requestNft(mintAmount).send({
            from: accounts[0],
            value: mintAmount * Number(mintPrice)
        });
        console.log('Mint successful:', tx);
        return tx;
    } catch (error) {
        console.error('Error minting:', error);
    }
}