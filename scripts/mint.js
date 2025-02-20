import { getMintStatus, getCurrentSupply, mintNft, getTotalSupply, getReservedSupply, getOwnerAddress, mintReservedSupply, checkMintAmountLeft, getMintPrice } from "./contractFunctions.js"
import { connectMetaMask } from "./wallet.js"

await loadHTML();

async function loadHTML() {

    const mintContractStatusContainer = document.getElementById('contract-status');
    if (await getMintStatus() === false) {
        mintContractStatusContainer.innerHTML = `
    <div class="mint-contract-status" id="contract-status">Mint Status: &nbsp;
        <span class="led-closed">&#10625; &nbsp; </span>
        <span class="status-closed"> Closed</span>
    </div>
    `
    } else {
        mintContractStatusContainer.innerHTML = `
    <div class="mint-contract-status" id="contract-status">Mint Status: &nbsp;
        <span class="led-open">&#10625; &nbsp; </span>
        <span class="status-open"> Open</span>
    </div>
    `
    }

    const reservedSupply = document.getElementById('reserved-supply');
    reservedSupply.innerHTML = `
        <div class="reserved-supply">Reserved supply: &nbsp;
            <span class="reserved-supply-amount">${await getReservedSupply()}</span>
        </div>
    `

    const mintPrice = document.getElementById('mint-price');
    mintPrice.innerHTML = `
        <div class="mint-price">Mint Price: &nbsp;
            <span class="price">${Number(await getMintPrice()) / 10 ** 18} ETH</span>
        </div>
    `

    const accounts = await window.ethereum.request({ method: "eth_accounts" });

    if (accounts[0] != undefined) {

        const mintControls = document.getElementById('mint-controls');

        mintControls.innerHTML = `
            <input type="number" id="nft-quantity" placeholder="Amount" min="1" max="10">
            <button id="mint-button">Mint Now</button>
            <div id="reserved-button-container">
                <button class="reserved-button-off" id="reserved-mint-button">Mint reserved supply</button>
            </div>
        `

        const maxMintAmount = await getTotalSupply();

        const mintAmountElement = document.getElementById('mint-amount');
        mintAmountElement.innerHTML = `
            Total minted: ${await getCurrentSupply()} / ${formatNumberWithSpace(maxMintAmount)}
        `

        const mintButton = document.getElementById('mint-button');
        const reservedButtonContainer = document.getElementById('reserved-button-container');
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


        if (accounts[0].toLowerCase() === (await getOwnerAddress()).toLowerCase()) {
            reservedButtonContainer.innerHTML = `
            <button class="reserved-button-on" id="reserved-mint-button">Mint reserved supply</button>
        `

            const reservedButton = document.getElementById('reserved-mint-button');

            reservedButton.addEventListener('click', async () => {
                if (inputAmount.value === '') {
                    alert('Please enter a valid number of NFTs to mint.');
                    return;
                }

                try {
                    const tx = await mintReservedSupply(Number(inputAmount.value));

                    if (tx.status) {
                        // Update the UI only if the transaction was successful
                        mintSection.innerHTML = `
                    <h2>🎉 Congratulations 🎉</h2>
                    <p>You successfully minted ${inputAmount.value} ${checkIfOneNft(Number(inputAmount.value))} from reserved supply.</p>
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
        }

    } else {
        const mintControls = document.getElementById('mint-controls');
        carousel.style.opacity = 0;

        mintControls.innerHTML = `
            <p>Please connect your wallet first: </p>
            <button class="mint-connect-wallet" id="mintConnectWallet">Connect Wallet</button>
        `

        const mintConnectButton = document.getElementById('mintConnectWallet');
        mintConnectButton.addEventListener(('click'), async () => {
            await connectMetaMask();
            await loadHTML()
            carousel.style.opacity = 1;
        })
    }
}

// Array of image paths and corresponding flavor text
const images = [
    { src: "./images/carousel/Latte.jpg", text: "A smooth and milky classic, perfect for any time of day." },
    { src: "./images/carousel/Americano.jpg", text: "Bold and robust, just like a traditional espresso." },
    { src: "./images/carousel/Espresso.jpg", text: "Strong and intense, for those who love a powerful kick." },
    { src: "./images/carousel/Cappuccino.jpg", text: "A creamy and frothy delight, perfect for a cozy morning." }
];

// Get the carousel image and flavor text elements
const carouselImage = document.getElementById('carousel-image');
const flavorText = document.getElementById('flavor-text');

let currentIndex = 0;

// Function to change the image and flavor text with a fade effect
function changeImage() {
    // Fade out the current image and text
    carouselImage.style.opacity = 0;
    flavorText.style.opacity = 0;

    // Wait for the fade-out transition to complete
    setTimeout(() => {
        // Update the image source and flavor text
        carouselImage.src = images[currentIndex].src;
        flavorText.innerHTML = `<p>${images[currentIndex].text}</p>`;

        // Fade in the new image and text
        carouselImage.style.opacity = 1;
        flavorText.style.opacity = 1;

        // Increment the index or reset to 0 if at the end of the array
        currentIndex = (currentIndex + 1) % images.length;
    }, 500); // Match this duration with the CSS transition duration
}

// Change the image and text every 5 seconds (5000 milliseconds)
setInterval(changeImage, 5000);

// Initialize the first image and text
changeImage();

export function checkIfOneNft(number) {
    if (number === 1) {
        return "NFT";
    } else {
        return "NFTs";
    }
}

function formatNumberWithSpace(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}