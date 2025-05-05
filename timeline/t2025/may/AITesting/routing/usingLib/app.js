// Get the main content element
const contentElement = document.getElementById("content");
const navLinks = document.querySelectorAll("#main-nav a");

// --- Helper Functions ---

// Function to update the main content area
function updateContent(html) {
    contentElement.innerHTML = html;
}

// Function to update the active state of navigation links
function setActiveLink(path) {
    navLinks.forEach((link) => {
        // Handle root path ('/') separately for exact match
        if (path === "/" && link.getAttribute("href") === "/") {
            link.classList.add("active");
        } else if (path !== "/" && link.getAttribute("href") === path) {
            link.classList.add("active");
        } else if (
            path.startsWith("/users/") &&
            link.getAttribute("href").startsWith("/users/")
        ) {
            // Basic handling for nested active states (make more specific if needed)
            // This highlights *any* user link when on a user page.
            // For specific user link highlighting, match the full path.
            if (link.getAttribute("href") === path) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        } else {
            link.classList.remove("active");
        }
    });
}

// --- Route Handlers ---

// Handler for the Home page ('/')
function home(ctx) {
    // 'ctx' is the context object provided by Page.js
    console.log("Navigating to Home");
    const html = `
        <h2>Home Page</h2>
        <p>Welcome to our single-page application demonstration using Page.js!</p>
    `;
    updateContent(html);
    setActiveLink(ctx.path); // ctx.path contains the matched path
}

// Handler for the About page ('/about')
function about(ctx) {
    console.log("Navigating to About");
    const html = `
        <h2>About Us</h2>
        <p>This is a simple example showing how Page.js works.</p>
        <p>It allows client-side routing without full page reloads.</p>
    `;
    updateContent(html);
    setActiveLink(ctx.path);
}

// Handler for the Contact page ('/contact')
function contact(ctx) {
    console.log("Navigating to Contact");
    const html = `
        <h2>Contact Page</h2>
        <p>Get in touch with us!</p>
        <form>
            <label>Name: <input type="text"></label><br>
            <label>Email: <input type="email"></label><br>
            <button type="button">Send (dummy)</button>
        </form>
    `;
    updateContent(html);
    setActiveLink(ctx.path);
}

// Handler for User pages ('/users/:userId')
// ':userId' is a URL parameter
function showUser(ctx) {
    const userId = ctx.params.userId; // Access parameters via ctx.params
    console.log(`Navigating to User: ${userId}`);
    const html = `
        <h2>User Profile</h2>
        <p>Displaying information for user: <strong>${userId}</strong></p>
        <p>Parameter captured from the URL: <code>${userId}</code></p>
        <p><a href="/contact">Contact ${userId}?</a></p> <!-- Internal link -->
    `;
    updateContent(html);
    // Use ctx.pathname which might be cleaner if query strings are involved
    setActiveLink(ctx.pathname);
}

// Handler for 'Not Found' (matches any route not previously defined)
function notFound(ctx) {
    console.log("Route not found:", ctx.path);
    const html = `
        <h2>404 - Page Not Found</h2>
        <p>Sorry, the page you requested (<code>${ctx.path}</code>) could not be found.</p>
        <p><a href="/">Go back to Home</a></p>
    `;
    contentElement.innerHTML = html; // Update directly, no active link needed
    // Clear active state from all links for 404
    setActiveLink("__nomatch__"); // Pass a string that won't match any href
}

// --- Define Routes ---
page("/", home);
page("/about", about);
page("/contact", contact);
page("/users/:userId", showUser); // Route with a parameter

// Catch-all route for 404 must be defined LAST
page("*", notFound);

// --- Initialize Page.js ---
// This starts the routing mechanism. It listens for link clicks and URL changes.
page();

console.log("Page.js router initialized.");
