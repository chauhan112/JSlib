console.log("Tool Hub script loaded!");

// Set current year in footer
const yearSpan = document.getElementById("current-year");
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

// --- Future Functionality Placeholder ---

// Example: Add event listeners to tool buttons
const toolButtons = document.querySelectorAll(".tool-card a");

toolButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
        // Prevent default anchor behavior for now
        event.preventDefault();

        const toolId = button.getAttribute("href").substring(1); // Get 'task-manager', 'link-shortener', etc.
        console.log(`Attempting to launch tool: ${toolId}`);

        // Add logic here based on the toolId
        // For example:
        // if (toolId === 'task-manager') {
        //     openTaskManager(); // Call a function specific to this tool
        // } else if (toolId === 'link-shortener') {
        //     openLinkShortener();
        // }
        // etc.

        alert(
            `Placeholder: Launching ${toolId}. Implement actual functionality here!`
        );
    });
});

// --- Define functions for each tool (Example Stubs) ---

function openTaskManager() {
    console.log("Opening Task Manager tool...");
    // Add code to show/hide elements, navigate, or fetch data for the task manager
}

function openLinkShortener() {
    console.log("Opening Link Shortener tool...");
    // Add code for the link shortener
}

// Add more functions as needed...
