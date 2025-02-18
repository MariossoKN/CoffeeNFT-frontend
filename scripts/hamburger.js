// Get references to the hamburger icon and dropdown menu
const hamburger = document.getElementById('hamburger');
const dropdownMenu = document.getElementById('dropdownMenu');

// Toggle the dropdown menu when the hamburger icon is clicked
hamburger.addEventListener('click', () => {
    dropdownMenu.classList.toggle('show'); // Toggle the dropdown menu
});

// Close the dropdown if clicked outside
document.addEventListener('click', (event) => {
    if (!hamburger.contains(event.target)) {
        dropdownMenu.classList.remove('show');
    }
});