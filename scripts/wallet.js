import { contractAddress, contractABI } from "./contract.js";

// DOM Elements
const connectWalletButton = document.getElementById("connectWallet");

// Initialize Web3 and contract instances
let web3;
let contract;

/**
 * Initializes the Web3 instance and contract.
 * @returns {object} The initialized contract instance.
 */
export function initializeContract() {
    if (!web3) {
        web3 = new Web3(window.ethereum);
    }
    if (!contract) {
        contract = new web3.eth.Contract(contractABI, contractAddress);
    }
    return contract;
}

/**
 * Checks if the user is already connected to MetaMask.
 * Updates the UI if connected.
 */
async function checkIfConnected() {
    try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
            updateWalletButton(accounts[0]);
            console.log("Address connected:", accounts[0]);
            initializeContract();
        } else {
            console.log("No address connected");
        }
    } catch (error) {
        console.error("Error checking connection status:", error);
    }
}

/**
 * Connects to MetaMask and updates the UI.
 */
export async function connectMetaMask() {
    try {
        if (typeof window.ethereum === "undefined") {
            alert("MetaMask is not installed. Please install it to use this feature.");
            return;
        }

        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        const walletAddress = accounts[0];

        updateWalletButton(walletAddress);
        initializeContract();

        console.log("Successfully connected to wallet:", walletAddress);
    } catch (error) {
        console.error("Error connecting to MetaMask:", error);
        alert("Failed to connect to MetaMask. Please try again.");
    }
}

/**
 * Updates the Connect Wallet button with the user's address.
 * @param {string} address - The user's wallet address.
 */
function updateWalletButton(address) {
    const shortenedAddress = `${address.slice(0, 7)}...${address.slice(37, 42)}`;
    connectWalletButton.textContent = shortenedAddress;
    connectWalletButton.classList.add("connected-address");
}

/**
 * Listens for account changes and updates the UI accordingly.
 */
function listenForAccountChanges() {
    if (window.ethereum) {
        window.ethereum.on("accountsChanged", (accounts) => {
            if (accounts.length === 0) {
                // User disconnected their wallet
                connectWalletButton.textContent = "Connect Wallet";
                connectWalletButton.classList.remove("connected-address");
                console.log("Wallet disconnected");
            } else {
                // Account changed, update the display
                updateWalletButton(accounts[0]);
                console.log("Account changed to:", accounts[0]);
            }
        });
    }
}

// Initialize the wallet functionality when the page loads
document.addEventListener("DOMContentLoaded", async () => {
    connectWalletButton.addEventListener("click", connectMetaMask);
    checkIfConnected();
    listenForAccountChanges();
});