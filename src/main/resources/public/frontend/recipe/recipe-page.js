/**
 * This script defines the CRUD operations for Recipe objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

let recipes = [];

// Wait for DOM to fully load before accessing elements
/**
 * Initializes event listeners and performs initial DOM updates on load.
 * Controls the visibility of the admin link and logout button based on sessionStorage.
 * Triggers the initial fetch of recipes.
 */
window.addEventListener("DOMContentLoaded", () => {

    /* 
     * TODO: Get references to various DOM elements
     * - Recipe name and instructions fields (add, update, delete)
     * - Recipe list container
     * - Admin link and logout button
     * - Search input
    */
    const adminLink = document.getElementById("admin-link");
    const logoutButton = document.getElementById("logout-button");
    const addSubmitButton = document.getElementById("add-recipe-submit-input");
    const updateSubmitButton = document.getElementById("update-recipe-submit-input");
    const deleteSubmitButton = document.getElementById("delete-recipe-submit-input");
    const searchButton = document.getElementById("search-button");

    /*
     * TODO: Show logout button if auth-token exists in sessionStorage
     */
    if (sessionStorage.getItem("auth-token")) {
        logoutButton.style.display = "inline-block";
    }

    /*
     * TODO: Show admin link if is-admin flag in sessionStorage is "true"
     */
    if (sessionStorage.getItem("is-admin") === "true") {
        adminLink.style.display = "inline-block";
    }

    /*
     * TODO: Attach event handlers
     * - Add recipe button → addRecipe()
     * - Update recipe button → updateRecipe()
     * - Delete recipe button → deleteRecipe()
     * - Search button → searchRecipes()
     * - Logout button → processLogout()
     */
    addSubmitButton.addEventListener("click", addRecipe);
    updateSubmitButton.addEventListener("click", updateRecipe);
    deleteSubmitButton.addEventListener("click", deleteRecipe);
    searchButton.addEventListener("click", searchRecipes);
    logoutButton.addEventListener("click", processLogout);

    /*
     * TODO: On page load, call getRecipes() to populate the list
     */
    getRecipes();

    /**
     * TODO: Search Recipes Function
     * - Read search term from input field
     * - Send GET request with name query param
     * - Update the recipe list using refreshRecipeList()
     * - Handle fetch errors and alert user
     * 
     * --- Documentation ---
     * Searches for recipes matching the given search term via GET /recipes?name={term}.
     * Re-renders the list with the filtered results.
     * 
     * Implements specification:
     * - System Doc Section 3.2: Retrieve Recipes.
     * 
     * @async
     * @function searchRecipes
     * @returns {Promise<void>}
     */
    async function searchRecipes() {
        const searchInput = document.getElementById("search-input").value.trim();
        const token = sessionStorage.getItem("auth-token");
        try {
            const response = await fetch(`${BASE_URL}/recipes?name=${encodeURIComponent(searchInput)}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                recipes = await response.json();
            } else if (response.status === 404) {
                recipes = [];
            }
            refreshRecipeList();
        } catch (e) {
            console.error(e);
            alert("Search failed");
        }
    }

    /**
     * TODO: Add Recipe Function
     * - Get values from add form inputs
     * - Validate both name and instructions
     * - Send POST request to /recipes
     * - Use Bearer token from sessionStorage
     * - On success: clear inputs, fetch latest recipes, refresh the list
     * 
     * --- Documentation ---
     * Creates a new recipe via POST /recipes.
     * Uses the Bearer token for authorization.
     * 
     * Implements specification:
     * - System Doc Section 3.1: Create Recipe.
     * 
     * @async
     * @function addRecipe
     * @returns {Promise<void>}
     */
    async function addRecipe() {
        const name = document.getElementById("add-recipe-name-input").value.trim();
        const instructions = document.getElementById("add-recipe-instructions-input").value.trim();
        
        if (!name || !instructions) {
            alert("Name and instructions required!");
            return;
        }

        const token = sessionStorage.getItem("auth-token");
        try {
            const response = await fetch(`${BASE_URL}/recipes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ name, instructions })
            });
            if (response.status === 201) {
                document.getElementById("add-recipe-name-input").value = "";
                document.getElementById("add-recipe-instructions-input").value = "";
                await getRecipes();
            } else {
                alert("Failed to add recipe");
            }
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * TODO: Update Recipe Function
     * - Get values from update form inputs
     * - Validate both name and updated instructions
     * - Fetch current recipes to locate the recipe by name
     * - Send PUT request to update it by ID
     * - On success: clear inputs, fetch latest recipes, refresh the list
     * 
     * --- Documentation ---
     * Updates an existing recipe's instructions via PUT /recipes/{id}.
     * Locates the correct recipe ID by matching the name locally.
     * 
     * Implements specification:
     * - System Doc Section 3.4: Update Recipe.
     * 
     * @async
     * @function updateRecipe
     * @returns {Promise<void>}
     */
    async function updateRecipe() {
        const name = document.getElementById("update-recipe-name-input").value.trim();
        const instructions = document.getElementById("update-recipe-instructions-input").value.trim();
        
        if (!name || !instructions) {
            alert("Name and instructions required!");
            return;
        }

        const recipe = recipes.find(r => r.name.toLowerCase() === name.toLowerCase());
        if (!recipe) {
            alert("Recipe not found in list!");
            return;
        }

        const token = sessionStorage.getItem("auth-token");
        try {
            const response = await fetch(`${BASE_URL}/recipes/${recipe.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ ...recipe, instructions })
            });
            if (response.status === 200) {
                document.getElementById("update-recipe-name-input").value = "";
                document.getElementById("update-recipe-instructions-input").value = "";
                await getRecipes();
            } else {
                alert("Failed to update recipe");
            }
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * TODO: Delete Recipe Function
     * - Get recipe name from delete input
     * - Find matching recipe in list to get its ID
     * - Send DELETE request using recipe ID
     * - On success: refresh the list
     * 
     * --- Documentation ---
     * Deletes a recipe via DELETE /recipes/{id}.
     * Locates the correct recipe ID by matching the name locally.
     * 
     * Implements specification:
     * - System Doc Section 3.5: Delete Recipe.
     * 
     * @async
     * @function deleteRecipe
     * @returns {Promise<void>}
     */
    async function deleteRecipe() {
        const name = document.getElementById("delete-recipe-name-input").value.trim();
        const recipe = recipes.find(r => r.name.toLowerCase() === name.toLowerCase());
        
        if (!recipe) {
            alert("Recipe not found in list!");
            return;
        }

        const token = sessionStorage.getItem("auth-token");
        try {
            const response = await fetch(`${BASE_URL}/recipes/${recipe.id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                document.getElementById("delete-recipe-name-input").value = "";
                await getRecipes();
            } else {
                alert("Failed to delete recipe");
            }
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * TODO: Get Recipes Function
     * - Fetch all recipes from backend
     * - Store in recipes array
     * - Call refreshRecipeList() to display
     * 
     * --- Documentation ---
     * Fetches all recipes via GET /recipes and updates the local array.
     * 
     * Implements specification:
     * - System Doc Section 3.2: Retrieve Recipes.
     * 
     * @async
     * @function getRecipes
     * @returns {Promise<void>}
     */
    async function getRecipes() {
        const token = sessionStorage.getItem("auth-token");
        try {
            const response = await fetch(`${BASE_URL}/recipes`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                recipes = await response.json();
            } else if (response.status === 404) {
                recipes = [];
            }
            refreshRecipeList();
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * TODO: Refresh Recipe List Function
     * - Clear current list in DOM
     * - Create <li> elements for each recipe with name + instructions
     * - Append to list container
     * 
     * --- Documentation ---
     * Renders the current state of the recipes array to the DOM.
     * 
     * @function refreshRecipeList
     */
    function refreshRecipeList() {
        const list = document.getElementById("recipe-list");
        list.innerHTML = "";
        recipes.forEach(r => {
            const li = document.createElement("li");
            li.textContent = `${r.name}: ${r.instructions}`;
            list.appendChild(li);
        });
    }

    /**
     * TODO: Logout Function
     * - Send POST request to /logout
     * - Use Bearer token from sessionStorage
     * - On success: clear sessionStorage and redirect to login
     * - On failure: alert the user
     * 
     * --- Documentation ---
     * Processes user logout via POST /logout.
     * Clears sessionStorage and redirects to the login page on success.
     * 
     * Implements specification:
     * - System Doc Section 2.2: User Login and Logout.
     * 
     * @async
     * @function processLogout
     * @returns {Promise<void>}
     */
    async function processLogout() {
        const token = sessionStorage.getItem("auth-token");
        try {
            const response = await fetch(`${BASE_URL}/logout`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                sessionStorage.clear();
                window.location.href = "../login/login-page.html";
            } else {
                alert("Logout failed");
            }
        } catch (e) {
            console.error(e);
            alert("Network error");
        }
    }

});