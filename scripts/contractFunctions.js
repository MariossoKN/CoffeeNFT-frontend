import { initializeContract } from "./wallet.js";
import { checkIfOneNft } from "./mint.js";

/**
 * Fetches the mint price from the contract.
 * @returns {Promise<string>} The mint price in wei.
 */
export async function getMintPrice() {
    const contract = await initializeContract();
    try {
        return await contract.methods.getMintPrice().call();
    } catch (error) {
        console.error("Error fetching mint price:", error);
        throw error;
    }
}

/**
 * Checks if minting is open or closed.
 * @returns {Promise<boolean>} True if minting is open, false otherwise.
 */
export async function getMintStatus() {
    const contract = await initializeContract();
    try {
        return await contract.methods.getMintStatus().call();
    } catch (error) {
        console.error("Error fetching mint status:", error);
        throw error;
    }
}

/**
 * Fetches the number of NFTs minted by the current user.
 * @returns {Promise<number>} The number of NFTs minted by the user.
 */
export async function getMintAmount() {
    const contract = await initializeContract();
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    try {
        return await contract.methods.getMintAmount(accounts[0]).call();
    } catch (error) {
        console.error("Error fetching mint amount:", error);
        throw error;
    }
}

/**
 * Fetches the maximum number of NFTs a user can mint.
 * @returns {Promise<number>} The maximum number of NFTs a user can mint.
 */
export async function getMaxMintAmount() {
    const contract = await initializeContract();
    try {
        return await contract.methods.getMaxMintAmount().call();
    } catch (error) {
        console.error("Error fetching max mint amount:", error);
        throw error;
    }
}

/**
 * Fetches the total supply of NFTs.
 * @returns {Promise<number>} The total supply of NFTs.
 */
export async function getTotalSupply() {
    const contract = await initializeContract();
    try {
        const totalSupply = await contract.methods.getTotalSupply().call();
        return Number(totalSupply) / 10 ** 18; // Convert from wei to ETH
    } catch (error) {
        console.error("Error fetching total supply:", error);
        throw error;
    }
}

/**
 * Fetches the current supply of NFTs.
 * @returns {Promise<number>} The current supply of NFTs.
 */
export async function getCurrentSupply() {
    const contract = await initializeContract();
    try {
        return await contract.methods.getCurrentSupply().call();
    } catch (error) {
        console.error("Error fetching current supply:", error);
        throw error;
    }
}

/**
 * Fetches the reserved supply of NFTs.
 * @returns {Promise<number>} The reserved supply of NFTs.
 */
export async function getReservedSupply() {
    const contract = await initializeContract();
    try {
        const reservedSupply = await contract.methods.getReservedSupply().call();
        return Number(reservedSupply) / 10 ** 18; // Convert from wei to ETH
    } catch (error) {
        console.error("Error fetching reserved supply:", error);
        throw error;
    }
}

/**
 * Mints a specified number of NFTs.
 * @param {number} mintAmount - The number of NFTs to mint.
 * @returns {Promise<object>} The transaction object.
 */
export async function mintNft(mintAmount) {
    const contract = await initializeContract();
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    const mintPrice = await getMintPrice();

    try {
        return await contract.methods.requestNft(mintAmount).send({
            from: accounts[0],
            value: mintAmount * Number(mintPrice),
        });
    } catch (error) {
        console.error("Error minting NFT:", error);
        throw error;
    }
}

/**
 * Mints a specified number of NFTs from the reserved supply.
 * @param {number} mintAmount - The number of NFTs to mint.
 * @returns {Promise<object>} The transaction object.
 */
export async function mintReservedSupply(mintAmount) {
    const contract = await initializeContract();
    const accounts = await window.ethereum.request({ method: "eth_accounts" });

    try {
        return await contract.methods.mintReservedSupply(mintAmount).send({
            from: accounts[0],
        });
    } catch (error) {
        console.error("Error minting reserved supply:", error);
        throw error;
    }
}

/**
 * Checks how many NFTs the user can still mint.
 * @returns {Promise<string>} A message indicating how many NFTs are left to mint.
 */
export async function checkMintAmountLeft() {
    try {
        const amountMinted = await getMintAmount();
        const maxMintAmount = await getMaxMintAmount();
        const mintAmountRemaining = Number(maxMintAmount) - Number(amountMinted);

        if (mintAmountRemaining === 0) {
            return "";
        } else {
            return `
                <p>
                    There are still ${mintAmountRemaining} more ${checkIfOneNft(mintAmountRemaining)} with your name left!
                </p>
            `;
        }
    } catch (error) {
        console.error("Error checking mint amount left:", error);
        throw error;
    }
}

/**
 * Fetches the owner's address from the contract.
 * @returns {Promise<string>} The owner's address.
 */
export async function getOwnerAddress() {
    const contract = await initializeContract();
    try {
        return await contract.methods.owner().call();
    } catch (error) {
        console.error("Error fetching owner address:", error);
        throw error;
    }
}