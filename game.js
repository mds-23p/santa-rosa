document.addEventListener('DOMContentLoaded', () => {
    const neighborhoodInput = document.getElementById('neighborhoodName');
    const createButton = document.getElementById('createNeighborhood');
    const nameSelectionCard = document.getElementById('nameSelectionCard');
    const neighborhoodCard = document.getElementById('neighborhoodCard');
    const displayName = document.getElementById('displayName');
    const backToNameButton = document.getElementById('backToName');
    const budgetAmount = document.getElementById('budgetAmount');
    const budgetDisplay = document.querySelector('.budget-display');
    const buildingOptions = document.querySelectorAll('.building-option');
    const selectedBuildingInfo = document.getElementById('selectedBuildingInfo');
    const selectedBuildingName = document.getElementById('selectedBuildingName');
    const selectedBuildingCost = document.getElementById('selectedBuildingCost');
    const cancelSelection = document.getElementById('cancelSelection');
    const neighborhoodMap = document.getElementById('neighborhoodMap');
    const mapGrid = document.querySelector('.map-grid');
    const populationModal = document.getElementById('populationModal');
    const modalBuildingName = document.getElementById('modalBuildingName');
    const buildingDetails = document.getElementById('buildingDetails');
    const populationList = document.getElementById('populationList');
    const closeModal = document.querySelector('.close-modal');

    let currentBudget = 10000;
    let selectedBuilding = null;
    let occupiedCells = new Map(); // Changed to Map to store building data

    // First names for random population generation
    const firstNames = ['John', 'Emma', 'Michael', 'Sophia', 'William', 'Olivia', 'James', 'Ava', 'Alexander', 'Isabella'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];

    function generateRandomPerson() {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const age = Math.floor(Math.random() * 80) + 1;
        return { name: `${firstName} ${lastName}`, age };
    }

    function generatePopulation(buildingType) {
        const population = [];
        let count = 0;
        
        switch(buildingType) {
            case 'house':
                count = Math.floor(Math.random() * 4) + 1; // 1-4 people
                break;
            case 'apartment':
                count = Math.floor(Math.random() * 20) + 10; // 10-30 people
                break;
            case 'school':
                count = Math.floor(Math.random() * 50) + 100; // 100-150 students
                break;
            case 'hospital':
                count = Math.floor(Math.random() * 30) + 20; // 20-50 staff
                break;
            case 'restaurant':
                count = Math.floor(Math.random() * 15) + 5; // 5-20 staff
                break;
            case 'library':
                count = Math.floor(Math.random() * 10) + 5; // 5-15 staff
                break;
            case 'shop':
                count = Math.floor(Math.random() * 10) + 5; // 5-15 staff
                break;
            case 'park':
                count = Math.floor(Math.random() * 20) + 10; // 10-30 visitors
                break;
            case 'ferrisWheel':
                count = Math.floor(Math.random() * 20) + 10; // 10-30 visitors
                break;
            case 'rollerCoaster':
                count = Math.floor(Math.random() * 40) + 20; // 20-60 visitors
                break;
            case 'merryGoRound':
                count = Math.floor(Math.random() * 15) + 5; // 5-20 kids
                break;
            case 'arcade':
                count = Math.floor(Math.random() * 20) + 10; // 10-30 players
                break;
            case 'snackShop':
                count = Math.floor(Math.random() * 8) + 2; // 2-10 staff/visitors
                break;
        }

        for (let i = 0; i < count; i++) {
            // Age-appropriate population for rides
            if (buildingType === 'merryGoRound') {
                // More kids (age 3-12)
                const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
                const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
                const age = Math.floor(Math.random() * 10) + 3;
                population.push({ name: `${firstName} ${lastName}`, age });
            } else if (buildingType === 'rollerCoaster') {
                // More teens (age 10-19)
                const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
                const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
                const age = Math.floor(Math.random() * 10) + 10;
                population.push({ name: `${firstName} ${lastName}`, age });
            } else {
                population.push(generateRandomPerson());
            }
        }
        return population;
    }

    function checkBudgetWarning() {
        if (currentBudget < 2000) {
            budgetDisplay.classList.add('low-budget');
            alert('Warning: Your budget is running low! You have less than $2,000 remaining.');
        } else {
            budgetDisplay.classList.remove('low-budget');
        }
    }

    function initializeGrid() {
        mapGrid.innerHTML = '';
        for (let i = 0; i < 100; i++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.dataset.index = i;
            cell.addEventListener('click', () => handleCellClick(cell));
            cell.addEventListener('mouseenter', () => highlightCell(cell));
            cell.addEventListener('mouseleave', () => unhighlightCell(cell));
            mapGrid.appendChild(cell);
        }
    }

    function updateBudget(amount) {
        currentBudget += amount;
        budgetAmount.textContent = currentBudget.toLocaleString();
        checkBudgetWarning();
    }

    function showNeighborhoodView(neighborhoodName) {
        displayName.textContent = neighborhoodName;
        nameSelectionCard.classList.add('hidden');
        neighborhoodCard.classList.remove('hidden');
        localStorage.setItem('neighborhoodName', neighborhoodName);
        initializeGrid();
        updateBudget(0);
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

        alert(`Selected ${building}. Click on any empty grid cell to place it. Cost: $${cost}`);
    }

    function cancelBuildingSelection() {
        selectedBuilding = null;
        selectedBuildingInfo.classList.add('hidden');
        buildingOptions.forEach(option => option.classList.remove('selected'));
    }

    function highlightCell(cell) {
        if (selectedBuilding && !cell.classList.contains('occupied')) {
            cell.classList.add('can-place');
        }
    }

    function unhighlightCell(cell) {
        cell.classList.remove('can-place');
    }

    function showBuildingInfo(cell) {
        const buildingData = occupiedCells.get(cell.dataset.index);
        if (!buildingData) return;

        modalBuildingName.textContent = buildingData.type.charAt(0).toUpperCase() + buildingData.type.slice(1);
        
        // Show building details
        buildingDetails.innerHTML = `
            <p><strong>Type:</strong> ${buildingData.type}</p>
            <p><strong>Cost:</strong> $${buildingData.cost}</p>
            <p><strong>Population:</strong> ${buildingData.population.length} people</p>
        `;

        // Show population list
        populationList.innerHTML = buildingData.population
            .map(person => `<div class="population-item">${person.name}, ${person.age} years old</div>`)
            .join('');

        populationModal.classList.remove('hidden');
    }

    function handleCellClick(cell) {
        if (selectedBuilding) {
            placeBuilding(cell);
        } else if (cell.classList.contains('occupied')) {
            showBuildingInfo(cell);
        }
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
        building.className = `building ${selectedBuilding.type}`;
        building.textContent = selectedBuilding.type.charAt(0).toUpperCase() + selectedBuilding.type.slice(1);
        cell.appendChild(building);
        cell.classList.add('occupied');

        // Store building data
        occupiedCells.set(cellIndex, {
            type: selectedBuilding.type,
            cost: selectedBuilding.cost,
            population: generatePopulation(selectedBuilding.type)
        });

        // Update budget
        updateBudget(-selectedBuilding.cost);
        
        alert(`Successfully placed ${selectedBuilding.type} for $${selectedBuilding.cost}!`);
        
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

    closeModal.addEventListener('click', () => {
        populationModal.classList.add('hidden');
    });

    // Close modal when clicking outside
    populationModal.addEventListener('click', (e) => {
        if (e.target === populationModal) {
            populationModal.classList.add('hidden');
        }
    });

    // Check if there's a saved neighborhood name
    const savedNeighborhood = localStorage.getItem('neighborhoodName');
    if (savedNeighborhood) {
        showNeighborhoodView(savedNeighborhood);
    }
}); 