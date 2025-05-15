// Import the editor core
import { editor as monacoEditor, IPosition } from "monaco-editor";
import { Tools } from "../../april/tools";

// Define interfaces and data for code snippets
interface CodeSnippet {
    language: string;
    value: string;
    displayName: string; // A user-friendly name for the select dropdown
}

const codeSnippets: Record<string, CodeSnippet> = {
    typescript: {
        language: "typescript",
        displayName: "TypeScript",
        value: `function greet(name: string): void {
  console.log(\`Hello, \${name}!\`);
}

greet("World");

// This is a sample TypeScript function.
// Let's add a few more lines to make it scrollable.
// Line 10
// Line 11
// Line 12
// Line 13
// Line 14
// Line 15
// Line 16
// Line 17
// Line 18
// Line 19
// Line 20: We can target this line!
// Line 21
// Line 22
// Line 23
// Line 24
// Line 25
// Line 26
// Line 27
// Line 28
// Line 29
// Line 30

function calculateSum(a: number, b: number): number {
    return a + b;
}

const total = calculateSum(5, 10); // Line 36
`,
    },
    javascript: {
        language: "javascript",
        displayName: "JavaScript",
        value: `function greet(name) {
  console.log(\`Hello, \${name}!\`);
}

greet("World");

// This is a sample JavaScript function.
// Let's add a few more lines to make it scrollable.
// Line 10
// Line 11
// Line 12
// Line 13
// Line 14
// Line 15
// Line 16
// Line 17
// Line 18
// Line 19
// Line 20: We can target this line!
// Line 21
// Line 22
// Line 23
// Line 24
// Line 25
// Line 26
// Line 27
// Line 28
// Line 29
// Line 30

function calculateSum(a, b) {
    return a + b;
}

const total = calculateSum(5, 10); // Line 36
`,
    },
    python: {
        language: "python",
        displayName: "Python",
        value: `# This is a sample Python script.
# Let's add a few more lines to make it scrollable.
# Line 3
# Line 4
# Line 5
# Line 6
# Line 7
# Line 8
# Line 9
# Line 10
# Line 11
# Line 12
# Line 13
# Line 14
# Line 15
# Line 16
# Line 17
# Line 18
# Line 19
# Line 20: We can target this line!
# Line 21
# Line 22
# Line 23
# Line 24
# Line 25
# Line 26
# Line 27
# Line 28
# Line 29
# Line 30

def greet(name):
  print(f"Hello, {name}!") # Line 33

greet("World")

def calculate_sum(a, b):
    return a + b

total = calculate_sum(5, 10) # Line 40
`,
    },
    css: {
        language: "css",
        displayName: "CSS",
        value: `body {
  font-family: sans-serif;
  margin: 20px;
}

/* This is a sample CSS. */
/* Let's add a few more lines to make it scrollable. */
/* Line 8 */
/* Line 9 */
/* Line 10 */
/* Line 11 */
/* Line 12 */
/* Line 13 */
/* Line 14 */
/* Line 15 */
/* Line 16 */
/* Line 17 */
/* Line 18 */
/* Line 19 */
/* Line 20: We can target this line! */
/* Line 21 */
/* Line 22 */
/* Line 23 */
/* Line 24 */
/* Line 25 */
/* Line 26 */
/* Line 27 */
/* Line 28 */
/* Line 29 */
/* Line 30 */

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
}

button { /* Line 42 */
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}
`,
    },
    // Add more languages/snippets here following the same structure
};

export const EditorView = () => {
    return Tools.div({
        children: [
            Tools.comp("h1", { textContent: "Monaco Editor Example" }),
            Tools.div({
                class: "controls",
                children: [
                    Tools.comp("label", { textContent: "Language:" }),
                    Tools.comp("select", { id: "language-select" }),
                    Tools.comp("label", { textContent: "Go to Line:" }),
                    Tools.comp("input", {
                        type: "number",
                        id: "line-number-input",
                        value: "1",
                        min: "1",
                    }),
                    Tools.comp("button", {
                        id: "go-to-line-button",
                        textContent: "Go",
                    }),
                ],
            }),
            Tools.comp("div", {
                id: "editor-container",
                class: "w-full h-[60vh] border border-gray-300 box-border",
            }),
        ],
    });
};
export const initialize = () => {
    const editorContainer = document.getElementById("editor-container");
    const languageSelect = document.getElementById(
        "language-select"
    ) as HTMLSelectElement;
    const lineNumberInput = document.getElementById(
        "line-number-input"
    ) as HTMLInputElement;
    const goToLineButton = document.getElementById("go-to-line-button");

    // --- Basic Validation ---
    if (
        !editorContainer ||
        !languageSelect ||
        !lineNumberInput ||
        !goToLineButton
    ) {
        console.error("One or more required DOM elements not found!");
        // Exit if essential elements are missing
        throw new Error("Required DOM elements not found.");
    }

    // --- Populate Language Select ---
    Object.keys(codeSnippets).forEach((langKey) => {
        const option = document.createElement("option");
        option.value = langKey;
        option.textContent = codeSnippets[langKey].displayName; // Use the display name
        languageSelect.appendChild(option);
    });

    // --- Initialize Monaco Editor ---
    // Store the editor instance
    let editor: monacoEditor.IStandaloneCodeEditor | undefined;

    const initialLanguageKey = Object.keys(codeSnippets)[0]; // Get the first language key
    const initialSnippet = codeSnippets[initialLanguageKey];

    if (editorContainer && initialSnippet) {
        editor = monacoEditor.create(editorContainer, {
            value: initialSnippet.value, // Set initial content
            language: initialSnippet.language, // Set initial language
            theme: "vs-dark", // You can use 'vs' or 'hc-black' as well
            automaticLayout: true, // Automatically resize the editor when the container resizes
            minimap: { enabled: true }, // You can enable or disable the minimap
        });

        // Set initial language select value
        languageSelect.value = initialLanguageKey;
    } else {
        console.error(
            "Could not initialize editor: container or initial snippet missing."
        );
    }

    // --- Function to Update Editor Content and Language ---
    function updateEditorContent(languageKey: string) {
        if (!editor) {
            console.error("Editor not initialized.");
            return;
        }

        const snippet = codeSnippets[languageKey];
        if (!snippet) {
            console.error(`Snippet not found for language key: ${languageKey}`);
            return;
        }

        // Create a new model with the new content and language
        const newModel = monacoEditor.createModel(
            snippet.value,
            snippet.language
        );

        // Get the old model to dispose of it later
        const oldModel = editor.getModel();

        // Set the new model on the editor
        editor.setModel(newModel);

        // Dispose the old model to free up resources (important for performance and memory)
        if (oldModel) {
            oldModel.dispose();
        }

        // Reset the line number input to 1 when content changes
        lineNumberInput.value = "1";
        // Automatically go to line 1 of the new content
        goToLine(1);
    }

    // --- Function to Go to a Specific Line ---
    function goToLine(lineNumber: number) {
        if (!editor) {
            console.error("Editor not initialized.");
            return;
        }

        const model = editor.getModel();
        if (!model) {
            console.error("Editor model is null.");
            return;
        }

        // Ensure line number is within the valid range
        const totalLines = model.getLineCount();
        let validLineNumber = Math.max(1, Math.min(lineNumber, totalLines));

        // Define the position to go to (line number, column 1)
        const position: IPosition = {
            lineNumber: validLineNumber,
            column: 1,
        };

        // Set the cursor position
        editor.setPosition(position);

        // Reveal the position in the editor, centering it if it's outside the viewport
        // This scrolls the editor to make the line visible.
        editor.revealPositionInCenterIfOutsideViewport(position);

        // Optional: Focus the editor after navigating
        editor.focus();

        // Update the input field to show the actual line number navigated to (after clamping)
        lineNumberInput.value = validLineNumber.toString();
    }

    // Listen for language change
    languageSelect.addEventListener("change", () => {
        const selectedLangKey = languageSelect.value;
        updateEditorContent(selectedLangKey);
    });

    // Listen for the "Go" button click
    goToLineButton.addEventListener("click", () => {
        const lineNumberString = lineNumberInput.value;
        const lineNumber = parseInt(lineNumberString, 10);

        // Validate input
        if (isNaN(lineNumber)) {
            alert("Please enter a valid number for the line.");
            lineNumberInput.value = "1"; // Reset input on invalid entry
            return;
        }

        goToLine(lineNumber);
    });

    // Optional: Allow pressing Enter in the input field to trigger "Go"
    lineNumberInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent default form submission if it were in a form
            goToLineButton.click(); // Simulate button click
        }
    });

    // --- Initial Action ---
    // After initialization, go to the first line and focus the editor
    if (editor) {
        goToLine(1);
    }
};
