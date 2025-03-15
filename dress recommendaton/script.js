const dressForm = document.getElementById('dressForm');
const wardrobeDiv = document.getElementById('wardrobe');
const recommendationDiv = document.getElementById('recommendation');

let wardrobe = JSON.parse(localStorage.getItem('wardrobe')) || [];

function displayWardrobe() {
    wardrobeDiv.innerHTML = '';
    wardrobe.forEach((dress, index) => {
        const dressCard = document.createElement('div');
        dressCard.className = 'dress-card card';
        dressCard.innerHTML = `
            <img src="${dress.image}" class="card-img-top" alt="${dress.name}">
            <div class="card-body">
                <h5 class="card-title">${dress.name}</h5>
                <p class="card-text">Type: ${dress.type}</p>
                <p class="card-text">Color: ${dress.color}</p>
                <button class="btn btn-danger" onclick="removeDress(${index})">Remove</button>
                <p class="last-worn">Last Worn: ${dress.lastWorn ? new Date(dress.lastWorn).toLocaleDateString() : 'Never'}</p>
                <button class="btn btn-success" onclick="setLastWorn(${index})">Set Last Worn</button>
                <button class="btn btn-info" onclick="editDress(${index})">Edit</button>
            </div>
        `;
        wardrobeDiv.appendChild(dressCard);
    });
    recommendDress();
}

let editIndex = null; // Variable to track the index of the dress being edited

function addDress(event) {
    event.preventDefault();
    const dressName = document.getElementById('dressName').value;
    const dressType = document.getElementById('dressType').value;
    const dressColor = document.getElementById('dressColor').value;
    const dressImageInput = document.getElementById('dressImage');
    const dressImage = dressImageInput.files[0] ? URL.createObjectURL(dressImageInput.files[0]) : '';

    if (editIndex !== null) { // Check if we are in edit mode
        wardrobe[editIndex] = {
            name: dressName,
            type: dressType,
            color: dressColor,
            image: dressImage,
            lastWorn: wardrobe[editIndex].lastWorn // Keep the last worn date unchanged
        };
        editIndex = null; // Reset edit index after updating
    } else {
        wardrobe.push({
            name: dressName,
            type: dressType,
            color: dressColor,
            image: dressImage,
            lastWorn: null
        });
    }




    // Removed duplicate push for adding a new dress


    localStorage.setItem('wardrobe', JSON.stringify(wardrobe));
    displayWardrobe();
    dressForm.reset();
}

function removeDress(index) {
    wardrobe.splice(index, 1);
    localStorage.setItem('wardrobe', JSON.stringify(wardrobe));
    displayWardrobe();
}

function setLastWorn(index) {
    wardrobe[index].lastWorn = new Date().toISOString();
    localStorage.setItem('wardrobe', JSON.stringify(wardrobe));
    displayWardrobe();
}

function editDress(index) {
    const dress = wardrobe[index];
    document.getElementById('dressName').value = dress.name;
    document.getElementById('dressType').value = dress.type;
    document.getElementById('dressColor').value = dress.color;
    document.getElementById('dressImage').value = ''; // Clear the file input
    editIndex = index; // Set the edit index to the current dress index

}

function recommendDress() {
    if (wardrobe.length === 0) {
        recommendationDiv.innerHTML = 'No dresses available for recommendation.';
        return;
    }

    const leastWornDress = wardrobe.reduce((prev, current) => {
        return (prev.lastWorn === null || (current.lastWorn !== null && new Date(current.lastWorn) < new Date(prev.lastWorn))) ? current : prev;
    });

    recommendationDiv.innerHTML = `<h5>${leastWornDress.name}</h5><p>Type: ${leastWornDress.type}</p><p>Color: ${leastWornDress.color}</p>`;
}

dressForm.addEventListener('submit', addDress);
displayWardrobe();
