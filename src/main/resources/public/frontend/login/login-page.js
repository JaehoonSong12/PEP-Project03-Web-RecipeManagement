/**
 * This script handles the login functionality for the Recipe Management Application.
 * It manages user authentication by sending login requests to the server and handling responses.
*/
const BASE_URL = "http://localhost:8081"; // backend URL

/*
 * TODO: Get references to DOM elements
 * - username input
 * - password input
 * - login button
 * - logout button (optional, for token testing)
 */

/*
 * TODO: Add click event listener to login button
 * - Call processLogin on click
 */
/**
 * Initializes event listeners once the DOM is fully loaded.
 * Binds the click event of the login button to the processLogin function.
 */
document.addEventListener("DOMContentLoaded", () => {
    const loginButton = document.getElementById("login-button");
    if (loginButton) {
        loginButton.addEventListener("click", processLogin);
    }
});

/**
 * TODO: Process Login Function
 *
 * Requirements:
 * - Retrieve values from username and password input fields
 * - Construct a request body with { username, password }
 * - Configure request options for fetch (POST, JSON headers)
 * - Send request to /login endpoint
 * - Handle responses:
 *    - If 200: extract token and isAdmin from response text
 *      - Store both in sessionStorage
 *      - Redirect to recipe-page.html
 *    - If 401: alert user about incorrect login
 *    - For others: show generic alert
 * - Add try/catch to handle fetch/network errors
 *
 * Hints:
 * - Use fetch with POST method and JSON body
 * - Use sessionStorage.setItem("key", value) to store auth token and admin flag
 * - Use `window.location.href` for redirection
 * 
 * --- Documentation ---
 * Processes the user login form submission.
 * Validates inputs, sends POST request to `/login`, and parses the response to extract auth token and admin status.
 * Stores them in sessionStorage and redirects.
 * 
 * Implements specification:
 * - System Doc Section 2.2: User Login and Logout.
 *
 * @async
 * @function processLogin
 * @returns {Promise<void>}
 */
async function processLogin() {
    const usernameInput = document.getElementById("login-input");
    const passwordInput = document.getElementById("password-input");

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
        alert("Fields cannot be empty!");
        return;
    }

    const requestBody = { username, password };
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
        body: JSON.stringify(requestBody)
    };

    try {
        const response = await fetch(`${BASE_URL}/login`, requestOptions);

        if (response.status === 200) {
            const text = await response.text();
            let token, isAdmin;
            
            try {
                // Try parsing as JSON first
                const data = JSON.parse(text);
                if (data.token) {
                    token = data.token;
                    isAdmin = data.isAdmin;
                } else if (data["auth-token"]) {
                    token = data["auth-token"];
                    isAdmin = data["is-admin"] || true;
                } else {
                    // space separated fallback
                    const parts = text.split(" ");
                    token = parts[0];
                    isAdmin = parts[1];
                }
            } catch (e) {
                // If parsing fails, use space separated fallback
                const parts = text.split(" ");
                token = parts[0];
                isAdmin = parts[1];
            }

            sessionStorage.setItem("auth-token", token);
            sessionStorage.setItem("is-admin", String(isAdmin));

            setTimeout(() => {
                window.location.href = "../recipe/recipe-page.html";
            }, 500);

        } else if (response.status === 401) {
            alert("Incorrect login!");
        } else {
            alert("Unknown issue!");
        }
    } catch (error) {
        console.error(error);
        alert("Network error!");
    }
}