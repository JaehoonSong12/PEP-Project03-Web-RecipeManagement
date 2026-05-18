/**
 * This script defines the registration functionality for the Registration page in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

/* 
 * TODO: Get references to various DOM elements
 * - usernameInput, emailInput, passwordInput, repeatPasswordInput, registerButton
 */

/* 
 * TODO: Ensure the register button calls processRegistration when clicked
 */
/**
 * Initializes event listeners once the DOM is fully loaded.
 * Binds the click event of the register button to the processRegistration function.
 */
document.addEventListener("DOMContentLoaded", () => {
    const registerButton = document.getElementById("register-button");
    registerButton.addEventListener("click", processRegistration);
});

/**
 * TODO: Process Registration Function
 * 
 * Requirements:
 * - Retrieve username, email, password, and repeat password from input fields
 * - Validate all fields are filled
 * - Check that password and repeat password match
 * - Create a request body with username, email, and password
 * - Define requestOptions using method POST and proper headers
 * 
 * Fetch Logic:
 * - Send POST request to `${BASE_URL}/register`
 * - If status is 201:
 *      - Redirect user to login page
 * - If status is 409:
 *      - Alert that user/email already exists
 * - Otherwise:
 *      - Alert generic registration error
 * 
 * Error Handling:
 * - Wrap in try/catch
 * - Log error and alert user
 * 
 * --- Documentation ---
 * Processes the user registration form submission.
 * Retrieves values, validates that fields are not blank and passwords match,
 * then sends a POST payload to `/register`.
 * 
 * Implements specification:
 * - System Doc Section 2.1: User Registration.
 * 
 * @async
 * @function processRegistration
 * @returns {Promise<void>}
 */
async function processRegistration() {
    const usernameInput = document.getElementById("username-input");
    const emailInput = document.getElementById("email-input");
    const passwordInput = document.getElementById("password-input");
    const repeatPasswordInput = document.getElementById("repeat-password-input");

    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const repeatPassword = repeatPasswordInput.value;

    if (!username || !email || !password || !repeatPassword) {
        alert("All fields are required!");
        return;
    }

    if (password !== repeatPassword) {
        alert("Passwords do not match!");
        return;
    }

    const registerBody = { username, email, password };
    const requestOptions = {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(registerBody)
    };

    try {
        const response = await fetch(`${BASE_URL}/register`, requestOptions);
        if (response.status === 201) {
            window.location.href = "../login/login-page.html";
        } else if (response.status === 409) {
            alert("User/Email already exists!");
        } else {
            alert("Generic registration error!");
        }
    } catch (error) {
        console.error(error);
        alert("Network error occurred!");
    }
}