document.addEventListener("DOMContentLoaded", () => {
    const selectContainer = document.getElementById("custom-select-container");
    const triggerButton = document.getElementById("custom-select-trigger");
    const valueDisplay = document.getElementById("custom-select-value");
    const optionsList = document.getElementById("custom-select-options");
    const arrowIcon = triggerButton.querySelector(".select-arrow");
    const hiddenInput = document.getElementById("selected-option-value"); // Optional

    // --- Configuration ---
    const optionsData = [
        { value: "", text: "Select...", disabled: true }, // Placeholder
        { value: "option1", text: "Option Alpha" },
        { value: "option2", text: "Option Beta" },
        { value: "option3", text: "Option Gamma" },
        { value: "option4", text: "Option Delta (Longer)" },
        { value: "option5", text: "Option Epsilon" },
    ];
    const openMaxHeight = "max-h-60"; // Tailwind class for max height when open (adjust if needed)
    let isOpen = false;
    let selectedValue = optionsData[0].value; // Start with placeholder value
    let selectedText = optionsData[0].text; // Start with placeholder text

    // --- Populate Options ---
    function populateOptions() {
        optionsList.innerHTML = ""; // Clear existing options
        optionsData.forEach((option) => {
            const listItem = document.createElement("li");
            listItem.setAttribute("role", "option");
            listItem.setAttribute("data-value", option.value);
            listItem.textContent = option.text;
            listItem.className = `relative cursor-pointer select-none py-2 pl-3 pr-9 text-gray-900 hover:bg-indigo-600 hover:text-white`;

            if (option.value === selectedValue) {
                listItem.classList.add("bg-indigo-100", "font-semibold"); // Style selected
                listItem.setAttribute("aria-selected", "true");
                // Add a checkmark or similar indicator if desired
                // const checkmark = document.createElement('span');
                // checkmark.className = 'absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600';
                // checkmark.innerHTML = `<!-- Heroicon: check --> <svg class="h-5 w-5" ... </svg>`;
                // listItem.appendChild(checkmark);
            } else {
                listItem.setAttribute("aria-selected", "false");
            }

            if (option.disabled) {
                listItem.classList.add(
                    "text-gray-400",
                    "cursor-not-allowed",
                    "hover:bg-transparent",
                    "hover:text-gray-400"
                );
                listItem.setAttribute("aria-disabled", "true");
            } else {
                // Add click listener only to non-disabled options
                listItem.addEventListener("click", () =>
                    handleOptionSelect(option)
                );
            }

            optionsList.appendChild(listItem);
        });
    }

    // --- Toggle Dropdown ---
    function toggleDropdown(forceClose = false) {
        if (forceClose) {
            isOpen = false;
        } else {
            isOpen = !isOpen;
        }

        triggerButton.setAttribute("aria-expanded", isOpen.toString());

        if (isOpen) {
            // Open state classes
            optionsList.classList.remove("max-h-0", "opacity-0", "invisible");
            optionsList.classList.add(openMaxHeight, "opacity-100", "visible");
            arrowIcon.classList.add("open"); // Rotate arrow
        } else {
            // Closed state classes
            optionsList.classList.remove(
                openMaxHeight,
                "opacity-100",
                "visible"
            );
            optionsList.classList.add("max-h-0", "opacity-0", "invisible");
            arrowIcon.classList.remove("open"); // Rotate arrow back
        }
    }

    // --- Handle Option Selection ---
    function handleOptionSelect(option) {
        if (option.disabled) return; // Should not happen due to listener logic, but good practice

        selectedValue = option.value;
        selectedText = option.text;

        valueDisplay.textContent = selectedText;
        if (hiddenInput) {
            // Optional: Update hidden input
            hiddenInput.value = selectedValue;
        }

        // Repopulate to update visual selection styles
        populateOptions();
        toggleDropdown(true); // Close dropdown after selection
        triggerButton.focus(); // Optional: return focus to the trigger
    }

    // --- Event Listeners ---
    triggerButton.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent click from bubbling to document
        toggleDropdown();
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
        if (isOpen && !selectContainer.contains(e.target)) {
            toggleDropdown(true); // Force close
        }
    });

    // --- Initial Setup ---
    valueDisplay.textContent = selectedText; // Set initial display text
    if (hiddenInput) {
        // Optional: Set initial hidden input value
        hiddenInput.value = selectedValue;
    }
    populateOptions(); // Create the options in the DOM
});
