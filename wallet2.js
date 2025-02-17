// import { contractAddress, contractABI } from './contract.js';

// // Initialize Web3 and contract variables
// let web3;
// let contract;
// // const contractAddress = "0xA36Ca74D0Deb23FD231A262F5d7649212D21E0E8";
// // const contractABI = [];

// // Wait for the page to fully load before initializing
// document.addEventListener('DOMContentLoaded', async () => {
//     // Get reference to the Connect Wallet button
//     const connectWalletButton = document.getElementById('connectWallet');

//     // Function to connect to MetaMask
//     async function connectMetaMask() {
//         try {
//             // Check if MetaMask is installed
//             if (typeof window.ethereum === 'undefined') {
//                 alert('MetaMask is not installed. Please install it to use this feature.');
//                 return;
//             }

//             // Initialize Web3 instance
//             web3 = new Web3(window.ethereum);

//             // Request account access
//             const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
//             const walletAddress = accounts[0];

//             // Initialize contract
//             contract = new web3.eth.Contract(contractABI, contractAddress);

//             // Update button text and style
//             connectWalletButton.innerHTML = `${walletAddress.slice(0, 7)}...${walletAddress.slice(37, 42)}`;
//             connectWalletButton.classList.add('connected-address');

//             console.log('Successfully connected to wallet:', walletAddress);
//         } catch (error) {
//             console.error('Error connecting to MetaMask:', error);
//             alert('Failed to connect to MetaMask. Please try again.');
//         }
//     }

//     // Function to check if already connected
//     async function checkIfConnected() {
//         try {
//             const accounts = await window.ethereum.request({ method: "eth_accounts" });
//             if (accounts.length > 0) {
//                 connectWalletButton.innerHTML = `${accounts[0].slice(0, 7)}...${accounts[0].slice(37, 42)}`;
//                 connectWalletButton.classList.add('connected-address');
//                 console.log('Address connected:', accounts[0]);

//                 // Initialize Web3 and contract for already connected accounts
//                 web3 = new Web3(window.ethereum);
//                 contract = new web3.eth.Contract(contractABI, contractAddress);
//             } else {
//                 console.log('No address connected');
//             }
//         } catch (error) {
//             console.error('Error checking connection status:', error);
//         }
//     }

//     // Add event listener to the Connect Wallet button
//     connectWalletButton.addEventListener('click', connectMetaMask);

//     // Check initial connection status
//     checkIfConnected();

//     // Listen for account changes
//     if (window.ethereum) {
//         window.ethereum.on('accountsChanged', (accounts) => {
//             if (accounts.length === 0) {
//                 // User disconnected their wallet
//                 connectWalletButton.innerHTML = 'Connect Wallet';
//                 connectWalletButton.classList.remove('connected-address');
//                 console.log('Wallet disconnected');
//             } else {
//                 // Account changed, update the display
//                 connectWalletButton.innerHTML = `${accounts[0].slice(0, 7)}...${accounts[0].slice(37, 42)}`;
//                 console.log('Account changed to:', accounts[0]);
//             }
//         });
//     }
// });

// async function getPriceOfMint() {

// }

