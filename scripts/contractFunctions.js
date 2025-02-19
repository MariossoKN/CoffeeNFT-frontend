import { initializeContract } from "./wallet.js";
import { checkIfOneNft } from "./mint.js";

// Coffee contract functions
export async function getMintPrice() {
    const contract = await initializeContract();

    try {
        const mintPrice = await contract.methods.getMintPrice().call();
        console.log('NFT mint price:', mintPrice);
        return mintPrice;
    } catch (error) {
        console.error('Error getting balance:', error);
    }
}

export async function getMintStatus() {
    const contract = await initializeContract();

    try {
        const mintStatus = await contract.methods.getMintStatus().call();
        console.log('NFT mint status:', mintStatus);
        return mintStatus;
    } catch (error) {
        console.error('Error getting balance:', error);
    }
}

export async function getMintAmount() {
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

export async function getMaxMintAmount() {
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

export async function getTotalSupply() {
    const contract = await initializeContract();

    try {
        const totalSupply = await contract.methods.getTotalSupply().call();
        console.log(`Total NFT supply: ${Number(totalSupply) / 10 ** 18}`);
        return Number(totalSupply) / 10 ** 18;
    } catch (error) {
        console.error('Error getting balance:', error);
    }
}

export async function getCurrentSupply() {
    const contract = await initializeContract();

    try {
        const currentSupply = await contract.methods.getCurrentSupply().call();
        console.log(`Current NFT supply: ${currentSupply}`);
        return currentSupply;
    } catch (error) {
        console.error('Error getting balance:', error);
    }
}

export async function getReservedSupply() {
    const contract = await initializeContract();

    try {
        const reservedSupply = await contract.methods.getReservedSupply().call();
        console.log(`Reserved NFT supply: ${reservedSupply}`);
        return Number(reservedSupply) / 10 ** 18;
    } catch (error) {
        console.error('Error getting balance:', error);
    }
}

export async function mintNft(mintAmount) {
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
        throw error; // Re-throw the error to handle it in the calling function
    }
}
export async function mintReservedSupply(mintAmount) {
    const contract = await initializeContract();
    const accounts = await window.ethereum.request({ method: "eth_accounts" });

    try {
        const tx = await contract.methods.mintReservedSupply(mintAmount).send({
            from: accounts[0],
        });
        console.log('Reserved supply mint successful:', tx);
        return tx;
    } catch (error) {
        console.error('Error minting:', error);
        throw error; // Re-throw the error to handle it in the calling function
    }
}

export async function checkMintAmountLeft() {
    const amountMinted = await getMintAmount();
    const maxMintAmount = await getMaxMintAmount();
    const mintAmountRemaining = Number(maxMintAmount) - Number(amountMinted);
    if (mintAmountRemaining === 0) {
        return '';
    } else {
        return `
            <p>
                There are still ${mintAmountRemaining} more ${checkIfOneNft(mintAmountRemaining)} with your name left!
            </p>
        `
    }
}

export async function getOwnerAddress() {
    const contract = await initializeContract();

    try {
        const ownerAddress = await contract.methods.owner().call();
        console.log(`Owners address: ${ownerAddress}`);
        return ownerAddress;
    } catch (error) {
        console.error('Error getting balance:', error);
    }
}