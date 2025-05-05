const appDiv = document.getElementById("app");
const navLinks = document.querySelectorAll("#nav a");

// Define routes and their corresponding content/functions
const routes = {
    "/": "<h2>Home Page</h2><p>Welcome to the home page!</p>",
    "/about": "<h2>About Us</h2><p>This is the about page content.</p>",
    "/contact": () => {
        // Example of using a function for dynamic content
        const now = new Date().toLocaleTimeString();
        return `<h2>Contact Us</h2><p>Contact us anytime! Current time: ${now}</p>`;
    },
};

// Function to update content based on the current hash
function router() {
    // Get the current hash path, default to '/'
    const path = window.location.hash.substring(1) || "/"; // Remove '#'
    console.log(`Navigating to path: ${path}`);

    // Find the content for the current path
    const content = routes[path];

    // Update the app content
    if (content) {
        if (typeof content === "function") {
            appDiv.innerHTML = content(); // Execute function if it's a function
        } else {
            appDiv.innerHTML = content; // Otherwise, use the string content
        }
    } else {
        // Handle 404 Not Found
        appDiv.innerHTML =
            "<h2>404 - Page Not Found</h2><p>Sorry, the page you requested does not exist.</p>";
    }

    // Update active link styling
    updateActiveLinks(path);
}

// Function to update the active state of navigation links
function updateActiveLinks(currentPath) {
    navLinks.forEach((link) => {
        // Compare link's hash with the current path (add '#' back for comparison)
        if (link.getAttribute("href") === `#${currentPath}`) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
}

// Listen for hash changes
window.addEventListener("hashchange", router);

// Listen for page load
window.addEventListener("DOMContentLoaded", router); // Initial route check

// Optional: Ensure initial load handles cases where hash might be empty but should default to '/'
if (!window.location.hash) {
    window.location.hash = "#/";
}
