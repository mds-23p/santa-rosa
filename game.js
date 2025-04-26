document.addEventListener('DOMContentLoaded', () => {
    const neighborhoodInput = document.getElementById('neighborhoodName');
    const createButton = document.getElementById('createNeighborhood');
    const neighborhoodDisplay = document.getElementById('neighborhoodDisplay');
    const displayName = document.getElementById('displayName');

    createButton.addEventListener('click', () => {
        const neighborhoodName = neighborhoodInput.value.trim();
        
        if (neighborhoodName) {
            // Store the neighborhood name
            localStorage.setItem('neighborhoodName', neighborhoodName);
            
            // Display the neighborhood name
            displayName.textContent = neighborhoodName;
            neighborhoodDisplay.classList.remove('hidden');
            
            // Clear the input
            neighborhoodInput.value = '';
            
            // Add a success message
            alert(`Welcome to ${neighborhoodName}! Your neighborhood has been created.`);
        } else {
            alert('Please enter a name for your neighborhood!');
        }
    });

    // Check if there's a saved neighborhood name
    const savedNeighborhood = localStorage.getItem('neighborhoodName');
    if (savedNeighborhood) {
        displayName.textContent = savedNeighborhood;
        neighborhoodDisplay.classList.remove('hidden');
    }
}); 