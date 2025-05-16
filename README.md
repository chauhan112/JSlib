# JSlib


**Core UI Framework & Component Library (JSlib - Custom Development):**

*   **Developed a foundational TypeScript-based UI component library (`GComponent`, `Tools`) enabling rapid development of web applications.**
    *   Implemented a base `GComponent` with lifecycle-like update mechanisms and state/props/event handling.
    *   Created a `Tools` helper class for streamlined instantiation of custom components.
*   **Built a suite of reusable UI components, including:**
    *   **Form System (`GForm`, `Input`):** For dynamic form creation with various input types, value handling, and submission logic.
    *   **List & CRUD (`ListWithCrud`, `ContextMenu`):** Components for displaying lists of items with integrated Create, Read, Update, Delete operations and context-sensitive menus.
    *   **Accordion (`AccordionShowOne`, `AccordionShowMany`):** For creating collapsible content sections, supporting both single and multiple open items.
    *   **Modal Dialogs (`Modal`):** A generic modal component for displaying focused content or forms.
    *   **Advanced Select Controls (`DropdownMenu`, `MultiSelect`, `MultiSelectWithSearch`):** Custom dropdowns and multi-select components with search and dynamic option capabilities.
    *   **Data Display & Navigation (`Table`, `Breadcrumb`):** Custom table for structured data and breadcrumbs for user navigation.
    *   **Conditional Rendering (`ConditionalComponent`):** Logic for showing/hiding UI elements based on conditions.
    *   **Data Repetition (`Repeater`):** For rendering lists of components from data.
    *   **Icon Integration (`Icon`):** Wrapper for `lucide` vector icons, allowing easy use and styling.
    *   **Toggle Button (`ToggleButton`):** A custom switch component.
*   **Implemented utility classes for common tasks:**
    *   `Atool`: Array manipulation utilities.
    *   `Undoers` & `DocumentHandler`: Basic undo/state management tied to global document events.
    *   `LocalStorageJSONModel`: For client-side data persistence using LocalStorage.

**Applications & Features Built Using the Custom Library:**

*   **DomainOps (Domain Operations & Activity Logger):**
    *   Full-stack (frontend) application for managing "Domains," "Operations," and "Activities."
    *   CRUD functionality for all three entity types, interacting with a backend API (using `axios`).
    *   Dynamic property/attribute management for entities.
    *   Structured UI with a sidebar (using custom Accordion), main content area, and a dedicated property editing panel.
    *   Form generation for creating/editing entities and their properties.
    *   Modal-based forms and settings configuration (e.g., for data structures).
    *   Backend API client targeting both `localhost` and a `PythonAnywhere` deployment.
    *   Implemented data structure definition forms for logger customization.

*   **Portfolio Website (`simplyAwesome.ts`):**
    *   Developed a responsive single-page personal portfolio.
    *   Implemented animated UI elements like "Ripple Lines" and a "Typing Effect" for text.
    *   Structured content into sections (About, Resume, Portfolio, Contact) using custom card and timeline components.
    *   Integrated a contact form with `axios` for submission (e.g., to Formspree).
    *   Data-driven content for skills, experience, projects, and social links.

*   **File Search Tool (Git Repository Cloner & Content Searcher):**
    *   **In-browser Git Operations:**
        *   Integrated `isomorphic-git` to clone public/private (with PAT) GitHub repositories.
        *   Utilized `lightning-fs` for an in-browser filesystem (IndexedDB backend) to store cloned repos.
    *   **File System Management:**
        *   Developed a wrapper (`LightFsWrapper`) for `lightning-fs` providing common FS operations (read, write, delete, list, stat, mkdir) and recursive file listing with ignore patterns.
    *   **Content Indexing & Searching:**
        *   Implemented a `FileSearchModel` to read specified file types (e.g., .js, .ts, .py) from the in-browser FS.
        *   Created a `ContentSearch` utility to perform case-sensitive/insensitive and regex-based text search within file contents, returning line numbers.
    *   **User Interface:**
        *   UI for repository URL input, authentication token, search term input, and result display.
        *   Cached repository data in IndexedDB to avoid re-cloning.
        *   Persistent input fields using `LocalStorage`.
        *   Status messages and loading indicators.

*   **Monaco Editor Integration (`monaco.ts`):**
    *   Successfully integrated the Monaco Editor into the application.
    *   Created an `EditorModel` wrapper to manage editor instances, set language and content, and navigate to specific lines programmatically.

*   **Tools Homepage / Dashboard (`RajaDevKit`):**
    *   Developed a central homepage to showcase and launch various tools/applications.
    *   Implemented a simple client-side hash-based `Router` for navigation between the homepage and individual tools.
    *   Dynamically generated "tool cards" with descriptions, icons, and links.
    *   Shared header and footer components across the dashboard.
