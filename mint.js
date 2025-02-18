import { initializeContract } from "./wallet.js";

// let mintedAmount = await getCurrentSupply();
const maxMintAmount = await getTotalSupply();

const mintContractStatusContainer = document.getElementById('contract-status');
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
    Total minted: ${await getCurrentSupply()} / ${formatNumberWithSpace(maxMintAmount)}
`

const reservedSupply = document.getElementById('reserved-supply');
reservedSupply.innerHTML = `
    <div class="reserved-supply">Reserved supply: &nbsp;
        <span class="reserved-supply-amount">${await getReservedSupply()}</span>
    </div>
`

const mintButton = document.getElementById('mint-button');
const inputAmount = document.getElementById('nft-quantity');
const mintSection = document.getElementById('mint-section-id');
const carousel = document.getElementById('carousel');

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

    try {
        // Mint the NFT and wait for the transaction to be confirmed
        const tx = await mintNft(Number(inputAmount.value));

        if (tx.status) {
            // Update the UI only if the transaction was successful
            mintSection.innerHTML = `
                <h2>🎉 Congratulations 🎉</h2>
                <p>You successfully minted ${inputAmount.value} ${checkIfOneNft(Number(inputAmount.value))}.</p>
                ${await checkMintAmountLeft()}
                <div class="mint-another-container">
                    <a class="mint-another" href="mint.html">Mint Another One</a>
                </div>
                <p>Total minted: ${await getCurrentSupply()} / ${formatNumberWithSpace(maxMintAmount)}</p>
            `;
            carousel.innerHTML = ''
        } else {
            alert('Transaction failed. Please try again.');
        }
    } catch (error) {
        console.error('Error minting NFT:', error);
        alert('An error occurred while minting. Please try again.');
    }

    inputAmount.value = '';
})

// Array of image paths for the carousel
const images = [
    "./images/Latte.jpg",
    "./images/Americano.jpg",
    "./images/Espresso.jpg",
    "./images/Cappuccino.jpg",
];

// Get the carousel image element
const carouselImage = document.getElementById('carousel-image');

let currentIndex = 0;

// Function to change the image with a fade effect
function changeImage() {
    // Fade out the current image
    carouselImage.style.opacity = 0;

    // Wait for the fade-out transition to complete
    setTimeout(() => {
        // Update the image source
        carouselImage.src = images[currentIndex];

        // Fade in the new image
        carouselImage.style.opacity = 1;

        // Increment the index or reset to 0 if at the end of the array
        currentIndex = (currentIndex + 1) % images.length;
    }, 500); // Match this duration with the CSS transition duration
}

// Change the image every 5 seconds (5000 milliseconds)
setInterval(changeImage, 5000);

// Initialize the first image
changeImage();


function checkIfOneNft(number) {
    if (number === 1) {
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

async function getReservedSupply() {
    const contract = await initializeContract();

    try {
        const reservedSupply = await contract.methods.getReservedSupply().call();
        console.log(`Reserved NFT supply: ${reservedSupply}`);
        return Number(reservedSupply) / 10 ** 18;
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
        throw error; // Re-throw the error to handle it in the calling function
    }
}

async function checkMintAmountLeft() {
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

function formatNumberWithSpace(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}