document.addEventListener('DOMContentLoaded', () => {
    const neighborhoodInput = document.getElementById('neighborhoodName');
    const createButton = document.getElementById('createNeighborhood');
    const nameSelectionCard = document.getElementById('nameSelectionCard');
    const neighborhoodCard = document.getElementById('neighborhoodCard');
    const displayName = document.getElementById('displayName');
    const backToNameButton = document.getElementById('backToName');
    const budgetAmount = document.getElementById('budgetAmount');
    const buildingOptions = document.querySelectorAll('.building-option');
    const selectedBuildingInfo = document.getElementById('selectedBuildingInfo');
    const selectedBuildingName = document.getElementById('selectedBuildingName');
    const selectedBuildingCost = document.getElementById('selectedBuildingCost');
    const cancelSelection = document.getElementById('cancelSelection');
    const neighborhoodMap = document.getElementById('neighborhoodMap');
    const mapGrid = document.querySelector('.map-grid');

    let currentBudget = 10000;
    let selectedBuilding = null;
    let occupiedCells = new Set();

    // Initialize the grid
    function initializeGrid() {
        mapGrid.innerHTML = '';
        for (let i = 0; i < 100; i++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.dataset.index = i;
            cell.addEventListener('click', () => placeBuilding(cell));
            mapGrid.appendChild(cell);
        }
    }

    function updateBudget(amount) {
        currentBudget += amount;
        budgetAmount.textContent = currentBudget.toLocaleString();
    }

    function showNeighborhoodView(neighborhoodName) {
        displayName.textContent = neighborhoodName;
        nameSelectionCard.classList.add('hidden');
        neighborhoodCard.classList.remove('hidden');
        localStorage.setItem('neighborhoodName', neighborhoodName);
        initializeGrid();
        updateBudget(0); // Initialize budget display
    }

    function showNameSelectionView() {
        neighborhoodCard.classList.add('hidden');
        nameSelectionCard.classList.remove('hidden');
        neighborhoodInput.value = '';
    }

    function selectBuilding(building, cost) {
        selectedBuilding = { type: building, cost: cost };
        selectedBuildingName.textContent = building.charAt(0).toUpperCase() + building.slice(1);
        selectedBuildingCost.textContent = cost.toLocaleString();
        selectedBuildingInfo.classList.remove('hidden');
        
        buildingOptions.forEach(option => {
            option.classList.remove('selected');
            if (option.dataset.building === building) {
                option.classList.add('selected');
            }
        });
    }

    function cancelBuildingSelection() {
        selectedBuilding = null;
        selectedBuildingInfo.classList.add('hidden');
        buildingOptions.forEach(option => option.classList.remove('selected'));
    }

    function placeBuilding(cell) {
        if (!selectedBuilding) return;
        
        const cellIndex = cell.dataset.index;
        if (occupiedCells.has(cellIndex)) {
            alert('This space is already occupied!');
            return;
        }

        if (currentBudget < selectedBuilding.cost) {
            alert('Not enough budget to place this building!');
            return;
        }

        // Create and place the building
        const building = document.createElement('div');
        building.className = 'building';
        building.textContent = selectedBuilding.type;
        cell.appendChild(building);
        cell.classList.add('occupied');
        occupiedCells.add(cellIndex);

        // Update budget
        updateBudget(-selectedBuilding.cost);
        
        // Reset selection
        cancelBuildingSelection();
    }

    createButton.addEventListener('click', () => {
        const neighborhoodName = neighborhoodInput.value.trim();
        if (neighborhoodName) {
            showNeighborhoodView(neighborhoodName);
        } else {
            alert('Please enter a name for your neighborhood!');
        }
    });

    backToNameButton.addEventListener('click', () => {
        showNameSelectionView();
    });

    buildingOptions.forEach(option => {
        option.addEventListener('click', () => {
            const building = option.dataset.building;
            const cost = parseInt(option.dataset.cost);
            selectBuilding(building, cost);
        });
    });

    cancelSelection.addEventListener('click', cancelBuildingSelection);

    // Check if there's a saved neighborhood name
    const savedNeighborhood = localStorage.getItem('neighborhoodName');
    if (savedNeighborhood) {
        showNeighborhoodView(savedNeighborhood);
    }
}); 