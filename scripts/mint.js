import {
    getMintStatus,
    getCurrentSupply,
    mintNft,
    getTotalSupply,
    getReservedSupply,
    getOwnerAddress,
    mintReservedSupply,
    checkMintAmountLeft,
    getMintPrice
} from "./contractFunctions.js";
import { connectMetaMask } from "./wallet.js";

// Constants
const IMAGES = [
    { src: "./images/carousel/Latte.jpg", text: "A smooth and milky classic, perfect for any time of day." },
    { src: "./images/carousel/Americano.jpg", text: "Bold and robust, just like a traditional espresso." },
    { src: "./images/carousel/Espresso.jpg", text: "Strong and intense, for those who love a powerful kick." },
    { src: "./images/carousel/Cappuccino.jpg", text: "A creamy and frothy delight, perfect for a cozy morning." }
];

// DOM Elements
const mintContractStatusContainer = document.getElementById('contract-status');
const reservedSupplyContainer = document.getElementById('reserved-supply');
const mintPriceContainer = document.getElementById('mint-price');
const mintControlsContainer = document.getElementById('mint-controls');
const mintAmountElement = document.getElementById('mint-amount');
const mintSection = document.getElementById('mint-section-id');
const carousel = document.getElementById('carousel');
const carouselImage = document.getElementById('carousel-image');
const flavorText = document.getElementById('flavor-text');

let currentIndex = 0;

// Initialize the page
async function init() {
    await loadHTML();
    setupCarousel();
}

// Load HTML content dynamically
async function loadHTML() {
    await updateMintStatus();
    await updateReservedSupply();
    await updateMintPrice();

    const accounts = await window.ethereum.request({ method: "eth_accounts" });

    if (accounts[0]) {
        await setupMintControls(accounts[0]);
    } else {
        showWalletConnectPrompt();
    }
}

// Update mint status
async function updateMintStatus() {
    const isMintOpen = await getMintStatus();
    mintContractStatusContainer.innerHTML = `
        <div class="mint-contract-status" id="contract-status">Mint Status: &nbsp;
            <span class="led-${isMintOpen ? 'open' : 'closed'}">&#10625; &nbsp; </span>
            <span class="status-${isMintOpen ? 'open' : 'closed'}"> ${isMintOpen ? 'Open' : 'Closed'}</span>
        </div>
    `;
}

// Update reserved supply
async function updateReservedSupply() {
    const reservedSupply = await getReservedSupply();
    reservedSupplyContainer.innerHTML = `
        <div class="reserved-supply">Reserved supply: &nbsp;
            <span class="reserved-supply-amount">${reservedSupply}</span>
        </div>
    `;
}

// Update mint price
async function updateMintPrice() {
    const mintPrice = await getMintPrice();
    mintPriceContainer.innerHTML = `
        <div class="mint-price">Mint Price: &nbsp;
            <span class="price">${Number(mintPrice) / 10 ** 18} ETH</span>
        </div>
    `;
}

// Setup mint controls for connected wallet
async function setupMintControls(account) {
    const maxMintAmount = await getTotalSupply();
    mintAmountElement.innerHTML = `Total minted: ${await getCurrentSupply()} / ${formatNumberWithSpace(maxMintAmount)}`;

    mintControlsContainer.innerHTML = `
        <input type="number" id="nft-quantity" placeholder="Amount" min="1" max="10">
        <button id="mint-button">Mint Now</button>
        <div id="reserved-button-container">
            <button class="reserved-button-off" id="reserved-mint-button">Mint reserved supply</button>
        </div>
    `;

    const mintButton = document.getElementById('mint-button');
    const reservedButtonContainer = document.getElementById('reserved-button-container');
    const inputAmount = document.getElementById('nft-quantity');

    mintButton.addEventListener('click', handleMint);
    if (account.toLowerCase() === (await getOwnerAddress()).toLowerCase()) {
        reservedButtonContainer.innerHTML = `<button class="reserved-button-on" id="reserved-mint-button">Mint reserved supply</button>`;
        document.getElementById('reserved-mint-button').addEventListener('click', handleReservedMint);
    }
}

// Handle mint button click
async function handleMint() {
    const inputAmount = document.getElementById('nft-quantity');
    if (!inputAmount.value) {
        alert('Please enter a valid number of NFTs to mint.');
        return;
    }

    if (!await getMintStatus()) {
        alert('Minting is closed/paused.');
        return;
    }

    try {
        const tx = await mintNft(Number(inputAmount.value));
        if (tx.status) {
            updateMintSuccessUI(inputAmount.value);
        } else {
            alert('Transaction failed. Please try again.');
        }
    } catch (error) {
        console.error('Error minting NFT:', error);
        alert('An error occurred while minting. Please try again.');
    }

    inputAmount.value = '';
}

// Handle reserved mint button click
async function handleReservedMint() {
    const inputAmount = document.getElementById('nft-quantity');
    if (!inputAmount.value) {
        alert('Please enter a valid number of NFTs to mint.');
        return;
    }

    try {
        const tx = await mintReservedSupply(Number(inputAmount.value));
        if (tx.status) {
            updateMintSuccessUI(inputAmount.value, true);
        } else {
            alert('Transaction failed. Please try again.');
        }
    } catch (error) {
        console.error('Error minting NFT:', error);
        alert('An error occurred while minting. Please try again.');
    }

    inputAmount.value = '';
}

// Update UI after successful mint
async function updateMintSuccessUI(amount, isReserved = false) {
    const maxMintAmount = await getTotalSupply();
    mintSection.innerHTML = `
        <h2>🎉 Congratulations 🎉</h2>
        <p>You successfully minted ${amount} ${checkIfOneNft(Number(amount))}${isReserved ? ' from reserved supply' : ''}.</p>
        ${await checkMintAmountLeft()}
        <div class="mint-another-container">
            <a class="mint-another" href="mint.html">Mint Another One</a>
        </div>
        <p>Total minted: ${await getCurrentSupply()} / ${formatNumberWithSpace(maxMintAmount)}</p>
    `;
    document.getElementById('carousel').innerHTML = '';
}

// Show wallet connect prompt
function showWalletConnectPrompt() {
    carousel.style.opacity = 0;
    mintControlsContainer.innerHTML = `
        <p>Please connect your wallet first: </p>
        <button class="mint-connect-wallet" id="mintConnectWallet">Connect Wallet</button>
    `;
    document.getElementById('mintConnectWallet').addEventListener('click', async () => {
        await connectMetaMask();
        await loadHTML();

        const accounts = await window.ethereum.request({ method: "eth_accounts" });

        if (accounts[0]) {
            carousel.style.opacity = 1;
        }
    });
}

// Setup carousel
function setupCarousel() {
    setInterval(changeImage, 5000);
    changeImage();
}

// Change carousel image and text
function changeImage() {
    carouselImage.style.opacity = 0;
    flavorText.style.opacity = 0;

    setTimeout(() => {
        carouselImage.src = IMAGES[currentIndex].src;
        flavorText.innerHTML = `<p>${IMAGES[currentIndex].text}</p>`;
        carouselImage.style.opacity = 1;
        flavorText.style.opacity = 1;
        currentIndex = (currentIndex + 1) % IMAGES.length;
    }, 500);
}

// Helper functions
export function checkIfOneNft(number) {
    return number === 1 ? "NFT" : "NFTs";
}

function formatNumberWithSpace(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

// Initialize the page
init();