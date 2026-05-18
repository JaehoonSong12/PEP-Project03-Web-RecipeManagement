/**
 * This script defines the add, view, and delete operations for Ingredient objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

/* 
 * TODO: Get references to various DOM elements
 * - addIngredientNameInput
 * - deleteIngredientNameInput
 * - ingredientListContainer
 * - searchInput (optional for future use)
 * - adminLink (if visible conditionally)
 */

/* 
 * TODO: Attach 'onclick' events to:
 * - "add-ingredient-submit-button" → addIngredient()
 * - "delete-ingredient-submit-button" → deleteIngredient()
 */

/*
 * TODO: Create an array to keep track of ingredients
 */
let ingredients = [];

/* 
 * TODO: On page load, call getIngredients()
 */
/**
 * Initializes event listeners once the DOM is fully loaded.
 * Triggers the initial fetch of ingredients.
 */
document.addEventListener("DOMContentLoaded", () => {
    const addSubmitButton = document.getElementById("add-ingredient-submit-button");
    const deleteSubmitButton = document.getElementById("delete-ingredient-submit-button");

    addSubmitButton.addEventListener("click", addIngredient);
    deleteSubmitButton.addEventListener("click", deleteIngredient);

    getIngredients();
});


/**
 * TODO: Add Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from addIngredientNameInput
 * - Validate input is not empty
 * - Send POST request to /ingredients
 * - Include Authorization token from sessionStorage
 * - On success: clear input, call getIngredients() and refreshIngredientList()
 * - On failure: alert the user
 * 
 * --- Documentation ---
 * Creates a new ingredient via POST /ingredients.
 * Accessible only by administrators.
 * 
 * Implements specification:
 * - System Doc Section 4.1: Create Ingredient.
 * 
 * @async
 * @function addIngredient
 * @returns {Promise<void>}
 */
async function addIngredient() {
    // Implement add ingredient logic here
    const nameInput = document.getElementById("add-ingredient-name-input");
    const name = nameInput.value.trim();

    if (!name) {
        alert("Ingredient name cannot be empty");
        return;
    }

    const token = sessionStorage.getItem("auth-token");
    try {
        const response = await fetch(`${BASE_URL}/ingredients`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ name })
        });

        if (response.status === 201) {
            nameInput.value = "";
            await getIngredients();
        } else {
            alert("Failed to add ingredient");
        }
    } catch (e) {
        console.error(e);
        alert("Error adding ingredient");
    }
}


/**
 * TODO: Get Ingredients Function
 * 
 * Requirements:
 * - Fetch all ingredients from backend
 * - Store result in `ingredients` array
 * - Call refreshIngredientList() to display them
 * - On error: alert the user
 * 
 * --- Documentation ---
 * Fetches all ingredients via GET /ingredients and updates the local array.
 * 
 * Implements specification:
 * - System Doc Section 4.2: Retrieve Ingredients.
 * 
 * @async
 * @function getIngredients
 * @returns {Promise<void>}
 */
async function getIngredients() {
    // Implement get ingredients logic here
    const token = sessionStorage.getItem("auth-token");
    try {
        const response = await fetch(`${BASE_URL}/ingredients`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.ok) {
            ingredients = await response.json();
            refreshIngredientList();
        } else {
            alert("Failed to fetch ingredients");
        }
    } catch (e) {
        console.error(e);
        alert("Error fetching ingredients");
    }
}


/**
 * TODO: Delete Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from deleteIngredientNameInput
 * - Search ingredientListContainer's <li> elements for matching name
 * - Determine ID based on index (or other backend logic)
 * - Send DELETE request to /ingredients/{id}
 * - On success: call getIngredients() and refreshIngredientList(), clear input
 * - On failure or not found: alert the user
 * 
 * --- Documentation ---
 * Deletes an ingredient via DELETE /ingredients/{id}.
 * Locates the correct ingredient ID by matching the name locally.
 * Accessible only by administrators.
 * 
 * Implements specification:
 * - System Doc Section 4.5: Delete Ingredient.
 * 
 * @async
 * @function deleteIngredient
 * @returns {Promise<void>}
 */
async function deleteIngredient() {
    // Implement delete ingredient logic here
    const nameInput = document.getElementById("delete-ingredient-name-input");
    const name = nameInput.value.trim();

    if (!name) {
        alert("Ingredient name cannot be empty");
        return;
    }

    const ingredient = ingredients.find(i => i.name.toLowerCase() === name.toLowerCase());
    if (!ingredient) {
        alert("Ingredient not found");
        return;
    }

    const token = sessionStorage.getItem("auth-token");
    try {
        const response = await fetch(`${BASE_URL}/ingredients/${ingredient.id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.status === 204 || response.status === 200) {
            nameInput.value = "";
            await getIngredients();
        } else {
            alert("Failed to delete ingredient");
        }
    } catch (e) {
        console.error(e);
        alert("Error deleting ingredient");
    }
}


/**
 * TODO: Refresh Ingredient List Function
 * 
 * Requirements:
 * - Clear ingredientListContainer
 * - Loop through `ingredients` array
 * - For each ingredient:
 *   - Create <li> and inner <p> with ingredient name
 *   - Append to container
 * 
 * --- Documentation ---
 * Renders the current state of the ingredients array to the DOM.
 * 
 * @function refreshIngredientList
 */
function refreshIngredientList() {
    // Implement ingredient list rendering logic here
    const list = document.getElementById("ingredient-list");
    list.innerHTML = "";
    ingredients.forEach(i => {
        const li = document.createElement("li");
        li.textContent = i.name;
        list.appendChild(li);
    });
}