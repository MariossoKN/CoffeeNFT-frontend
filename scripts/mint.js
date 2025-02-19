import { getMintStatus, getCurrentSupply, mintNft, getTotalSupply, getReservedSupply, getOwnerAddress, mintReservedSupply, checkMintAmountLeft } from "./contractFunctions.js"

await loadHTML();

async function loadHTML() {
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

    const accounts = await window.ethereum.request({ method: "eth_accounts" });

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
}

// Array of image paths for the carousel
const images = [
    "./images/carousel/Latte.jpg",
    "./images/carousel/Americano.jpg",
    "./images/carousel/Espresso.jpg",
    "./images/carousel/Cappuccino.jpg",
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