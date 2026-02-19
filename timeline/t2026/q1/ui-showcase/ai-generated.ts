interface IComponent {
    render(): HTMLElement;
}

interface IShowableComponent extends IComponent {
    id: string;
    title: string;
    description: string;
    location: string; // e.g., "ui/buttons"
    tags: string[];
    renderPreview(): HTMLElement; // The actual UI component visualization
}

// ==========================================
// 2. DATA MODELS & REGISTRY (The Code Base)
// ==========================================

// Single entry point for managing components
class ComponentRegistry {
    private static instance: ComponentRegistry;
    private components: IShowableComponent[] = [];

    private constructor() {}

    static getInstance(): ComponentRegistry {
        if (!ComponentRegistry.instance)
            ComponentRegistry.instance = new ComponentRegistry();
        return ComponentRegistry.instance;
    }

    // Easy way to organize code base: Add new component here
    register(comp: IShowableComponent) {
        this.components.push(comp);
    }

    getAll(): IShowableComponent[] {
        return this.components;
    }

    getById(id: string): IShowableComponent | undefined {
        return this.components.find((c) => c.id === id);
    }

    search(query: string): IShowableComponent[] {
        const q = query.toLowerCase();
        return this.components.filter(
            (c) =>
                c.title.toLowerCase().includes(q) ||
                c.tags.some((t) => t.toLowerCase().includes(q)),
        );
    }
}

// ==========================================
// 3. TREE EXPLORER LOGIC
// ==========================================

interface ITreeExplorer {
    list_dir(): { folders: string[]; files: IShowableComponent[] };
    cd(folderName: string): void;
    goback(): void;
    gotoRoot(): void;
    get_location(): string;
    goto_loc(path: string): void;
}

class FileSystemExplorer implements ITreeExplorer {
    private currentPath: string[] = [];
    private registry: ComponentRegistry;

    constructor(registry: ComponentRegistry) {
        this.registry = registry;
    }

    list_dir() {
        const fullPathStr = this.currentPath.join("/");
        const all = this.registry.getAll();

        const folders = new Set<string>();
        const files: IShowableComponent[] = [];

        all.forEach((comp) => {
            // Normalize path logic
            const compLoc = comp.location.replace(/^\/+|\/+$/g, "");
            const currentLoc = fullPathStr.replace(/^\/+|\/+$/g, "");

            if (
                compLoc === currentLoc ||
                (currentLoc === "" && compLoc === "")
            ) {
                // Exact match, it's a file in this dir
                files.push(comp);
            } else if (compLoc.startsWith(currentLoc)) {
                // It is inside this folder (or deeper)
                const relative =
                    currentLoc === ""
                        ? compLoc
                        : compLoc.substring(currentLoc.length + 1);
                const parts = relative.split("/");
                if (parts.length > 0 && parts[0] !== "") {
                    folders.add(parts[0]);
                }
            }
        });

        return { folders: Array.from(folders), files };
    }

    cd(folderName: string) {
        this.currentPath.push(folderName);
    }

    goback() {
        this.currentPath.pop();
    }

    gotoRoot() {
        this.currentPath = [];
    }

    get_location(): string {
        return this.currentPath.length > 0
            ? this.currentPath.join("/")
            : "root";
    }

    goto_loc(path: string) {
        this.currentPath = path === "root" ? [] : path.split("/");
    }
}

// ==========================================
// 4. GROUP & FILTER LOGIC
// ==========================================

interface IGroupComponent {
    get_comp(): IComponent;
    get_name(): string;
    get_description(): string;
}

// Implementation of a group (collection of cards)
class ListGroup implements IGroupComponent {
    private title: string;
    private elements: IShowableComponent[] = [];

    constructor(title: string) {
        this.title = title;
    }

    add(element: IShowableComponent) {
        this.elements.push(element);
    }

    get_name() {
        return this.title;
    }
    get_description() {
        return `Group of ${this.elements.length} items`;
    }

    get_comp(): IComponent {
        return {
            render: () => {
                const container = document.createElement("div");
                container.className = "mb-8";

                const header = document.createElement("h3");
                header.className =
                    "text-xl font-bold mb-4 text-slate-700 border-b pb-2";
                header.innerText = this.title;
                container.appendChild(header);

                const grid = document.createElement("div");
                grid.className =
                    "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4";

                this.elements.forEach((el) => {
                    grid.appendChild(new CardComponent(el).render());
                });

                container.appendChild(grid);
                return container;
            },
        };
    }
}

// Filter Logic
class FilterModel {
    private filters: { name: string; value: string }[] = [
        { name: "Framework", value: "React" },
        { name: "Framework", value: "Vue" },
        { name: "Type", value: "UI" },
        { name: "Type", value: "Logic" },
    ];

    read_all() {
        return this.filters;
    }

    add(name: string, value: string) {
        this.filters.push({ name, value });
    }

    remove(index: number) {
        this.filters.splice(index, 1);
    }
}

// ==========================================
// 5. UI COMPONENTS (Visuals)
// ==========================================

class CardComponent implements IComponent {
    private data: IShowableComponent;
    constructor(data: IShowableComponent) {
        this.data = data;
    }

    render(): HTMLElement {
        const card = document.createElement("div");
        card.className =
            "bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer border border-slate-200 flex flex-col h-full";

        card.innerHTML = `
                    <div class="flex items-center justify-between mb-2">
                        <div class="font-bold text-lg text-blue-600">${this.data.title}</div>
                        <div class="text-xs text-slate-400 font-mono">${this.data.location}</div>
                    </div>
                    <div class="bg-slate-50 p-2 rounded mb-3 text-xs overflow-hidden h-24 border border-dashed border-slate-300">
                        <!-- Preview placeholder -->
                        <div class="w-full h-full flex items-center justify-center text-slate-400">Preview</div>
                    </div>
                    <p class="text-sm text-slate-600 mb-4 flex-grow">${this.data.description}</p>
                    <div class="flex flex-wrap gap-1 mt-auto">
                        ${this.data.tags.map((t) => `<span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">${t}</span>`).join("")}
                    </div>
                `;

        card.onclick = () => {
            alert(
                `Opening ${this.data.title}\nCode: import { ${this.data.title} } from '...'`,
            );
        };

        return card;
    }
}

// ==========================================
// 6. PAGES (Views)
// ==========================================

// --- 1. HOME PAGE ---
class HomePage implements IComponent {
    render(): HTMLElement {
        const container = document.createElement("div");

        const favorites = new ListGroup("Favorites");
        const reg = ComponentRegistry.getInstance();

        reg.getAll()
            .filter((c) => c.tags.includes("fav"))
            .forEach((c) => favorites.add(c));

        const recent = new ListGroup("Recently Added");
        reg.getAll()
            .slice(-3)
            .forEach((c) => recent.add(c));

        container.appendChild(favorites.get_comp().render());
        container.appendChild(recent.get_comp().render());

        return container;
    }
}

class ExplorerPage implements IComponent {
    private explorer: ITreeExplorer;
    private container: HTMLElement;

    constructor() {
        this.explorer = new FileSystemExplorer(ComponentRegistry.getInstance());
        this.container = document.createElement("div");
    }

    render(): HTMLElement {
        this.updateView();
        return this.container;
    }

    updateView() {
        this.container.innerHTML = "";

        const navBar = document.createElement("div");
        navBar.className =
            "flex items-center gap-2 mb-6 text-sm bg-white p-2 rounded border";

        const rootBtn = document.createElement("button");
        rootBtn.className = "hover:text-blue-600 font-bold";
        rootBtn.innerHTML = '<i class="fa fa-home"></i> root';
        rootBtn.onclick = () => {
            this.explorer.gotoRoot();
            this.updateView();
        };
        navBar.appendChild(rootBtn);

        const location = this.explorer.get_location();
        if (location !== "root") {
            navBar.innerHTML += ` <span class="text-slate-400">/</span> <span class="font-mono text-blue-600">${location}</span>`;

            const backBtn = document.createElement("button");
            backBtn.className =
                "ml-auto px-3 py-1 bg-slate-200 rounded hover:bg-slate-300 text-xs";
            backBtn.innerHTML = '<i class="fa fa-level-up-alt"></i> Up';
            backBtn.onclick = () => {
                this.explorer.goback();
                this.updateView();
            };
            navBar.appendChild(backBtn);
        }

        this.container.appendChild(navBar);

        const { folders, files } = this.explorer.list_dir();

        if (folders.length > 0) {
            const folderGrid = document.createElement("div");
            folderGrid.className =
                "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8";

            folders.forEach((f) => {
                const div = document.createElement("div");
                div.className =
                    "bg-amber-50 border border-amber-200 p-4 rounded text-center cursor-pointer hover:bg-amber-100 text-amber-800 transition-colors";
                div.innerHTML = `<i class="fa fa-folder text-3xl mb-2 block text-amber-400"></i> <span class="font-bold text-sm truncate block">${f}</span>`;
                div.onclick = () => {
                    this.explorer.cd(f);
                    this.updateView();
                };
                folderGrid.appendChild(div);
            });
            this.container.appendChild(folderGrid);
        }

        if (files.length > 0) {
            const fileGrid = document.createElement("div");
            fileGrid.className =
                "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4";
            files.forEach((f) => {
                fileGrid.appendChild(new CardComponent(f).render());
            });
            this.container.appendChild(fileGrid);
        }

        if (folders.length === 0 && files.length === 0) {
            this.container.innerHTML += `<div class="text-center text-slate-400 py-10">Empty Directory</div>`;
        }
    }
}

class SearchPage implements IComponent {
    render(): HTMLElement {
        const container = document.createElement("div");

        const searchBar = document.createElement("input");
        searchBar.type = "text";
        searchBar.placeholder = "Search components, tags...";
        searchBar.className =
            "w-full p-4 text-lg border border-slate-300 rounded-lg shadow-sm mb-8 focus:ring-2 focus:ring-blue-500 outline-none";

        const resultsContainer = document.createElement("div");
        resultsContainer.className =
            "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4";

        const doSearch = (val: string) => {
            resultsContainer.innerHTML = "";
            const results = ComponentRegistry.getInstance().search(val);
            results.forEach((r) => {
                resultsContainer.appendChild(new CardComponent(r).render());
            });
            if (results.length === 0)
                resultsContainer.innerHTML = `<div class="col-span-3 text-center text-slate-400">No results found</div>`;
        };

        searchBar.onkeyup = (e) =>
            doSearch((e.target as HTMLInputElement).value);

        doSearch("");

        container.appendChild(searchBar);
        container.appendChild(resultsContainer);
        return container;
    }
}

class FilterConfigPage implements IComponent {
    private model = new FilterModel();

    render(): HTMLElement {
        const container = document.createElement("div");
        container.innerHTML = `<h2 class="text-2xl font-bold mb-6">Manage Filters</h2>`;

        const form = document.createElement("div");
        form.className =
            "bg-white p-6 rounded shadow mb-6 flex gap-4 items-end";
        form.innerHTML = `
                    <div class="flex-1">
                        <label class="block text-sm font-bold mb-1">Filter Name</label>
                        <input id="f-name" class="w-full border p-2 rounded" placeholder="e.g. Status">
                    </div>
                    <div class="flex-1">
                        <label class="block text-sm font-bold mb-1">Value</label>
                        <input id="f-value" class="w-full border p-2 rounded" placeholder="e.g. Deprecated">
                    </div>
                    <button id="f-add" class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Add</button>
                `;

        const listContainer = document.createElement("div");

        const renderList = () => {
            listContainer.innerHTML = "";
            const table = document.createElement("table");
            table.className = "w-full bg-white shadow rounded overflow-hidden";
            table.innerHTML = `
                        <thead class="bg-slate-100 border-b">
                            <tr><th class="text-left p-4">Name</th><th class="text-left p-4">Value</th><th class="p-4">Action</th></tr>
                        </thead>
                    `;
            const tbody = document.createElement("tbody");
            this.model.read_all().forEach((item, idx) => {
                const tr = document.createElement("tr");
                tr.className = "border-b last:border-0";
                tr.innerHTML = `
                            <td class="p-4">${item.name}</td>
                            <td class="p-4"><span class="bg-gray-200 px-2 py-1 rounded text-xs">${item.value}</span></td>
                            <td class="p-4 text-center">
                                <button class="text-red-500 hover:text-red-700 delete-btn" data-index="${idx}">
                                    <i class="fa fa-trash"></i>
                                </button>
                            </td>
                        `;
                tbody.appendChild(tr);
            });
            table.appendChild(tbody);
            listContainer.appendChild(table);

            tbody.querySelectorAll(".delete-btn").forEach((btn) => {
                btn.addEventListener("click", (e) => {
                    const idx = parseInt(
                        (e.currentTarget as HTMLElement).getAttribute(
                            "data-index",
                        ) || "0",
                    );
                    this.model.remove(idx);
                    renderList();
                });
            });
        };

        const btn = form.querySelector("#f-add") as HTMLElement;
        btn.onclick = () => {
            const name = (form.querySelector("#f-name") as HTMLInputElement)
                .value;
            const val = (form.querySelector("#f-value") as HTMLInputElement)
                .value;
            if (name && val) {
                this.model.add(name, val);
                (form.querySelector("#f-name") as HTMLInputElement).value = "";
                (form.querySelector("#f-value") as HTMLInputElement).value = "";
                renderList();
            }
        };

        container.appendChild(form);
        container.appendChild(listContainer);
        renderList();

        return container;
    }
}

// ==========================================
// 7. MAIN LAYOUT (WebPageWithNav)
// ==========================================

class AppLayout {
    private mainContent: HTMLElement | null = null;
    private currentView: IComponent | null = null;

    constructor() {
        this.seedData();

        const app = document.getElementById("app");
        if (!app) return;

        // Sidebar
        const nav = document.createElement("nav");
        nav.className =
            "w-64 bg-slate-900 text-slate-300 flex flex-col h-full flex-shrink-0";
        nav.innerHTML = `
                    <div class="p-6 text-white font-bold text-xl border-b border-slate-700">
                        <i class="fa fa-cube mr-2"></i> DomOps
                    </div>
                    <ul class="flex-1 p-4 space-y-2">
                        <li><button id="nav-home" class="w-full text-left p-3 rounded hover:bg-slate-800 transition"><i class="fa fa-home w-6"></i> Home</button></li>
                        <li><button id="nav-explorer" class="w-full text-left p-3 rounded hover:bg-slate-800 transition"><i class="fa fa-folder-tree w-6"></i> Explorer</button></li>
                        <li><button id="nav-search" class="w-full text-left p-3 rounded hover:bg-slate-800 transition"><i class="fa fa-search w-6"></i> Lister / Search</button></li>
                        <li><button id="nav-filter" class="w-full text-left p-3 rounded hover:bg-slate-800 transition"><i class="fa fa-sliders w-6"></i> Filter Setup</button></li>
                    </ul>
                    <div class="p-4 text-xs text-center border-t border-slate-800">
                        &copy; 2023 Dom Component Sys
                    </div>
                `;

        // Main Area
        const main = document.createElement("main");
        main.className = "flex-1 h-full overflow-auto bg-slate-100";

        const contentWrapper = document.createElement("div");
        contentWrapper.className = "p-8 max-w-7xl mx-auto";
        this.mainContent = contentWrapper;
        main.appendChild(contentWrapper);

        app.appendChild(nav);
        app.appendChild(main);

        // Bind Navigation
        document
            .getElementById("nav-home")
            ?.addEventListener("click", () => this.navigate(new HomePage()));
        document
            .getElementById("nav-explorer")
            ?.addEventListener("click", () =>
                this.navigate(new ExplorerPage()),
            );
        document
            .getElementById("nav-search")
            ?.addEventListener("click", () => this.navigate(new SearchPage()));
        document
            .getElementById("nav-filter")
            ?.addEventListener("click", () =>
                this.navigate(new FilterConfigPage()),
            );

        // Default Route
        this.navigate(new HomePage());
    }

    navigate(component: IComponent) {
        this.mainContent!.innerHTML = "";
        this.mainContent!.appendChild(component.render());
    }

    seedData() {
        const reg = ComponentRegistry.getInstance();

        const add = (
            id: string,
            title: string,
            loc: string,
            desc: string,
            tags: string[],
        ) => {
            reg.register({
                id,
                title,
                location: loc,
                description: desc,
                tags,
                renderPreview: () => document.createElement("div"),
                render: () => document.createElement("div"),
            });
        };

        add(
            "btn-1",
            "Primary Button",
            "ui/buttons",
            "Main CTA button with gradient",
            ["ui", "fav"],
        );
        add(
            "btn-2",
            "Secondary Button",
            "ui/buttons",
            "Ghost button for secondary actions",
            ["ui"],
        );
        add(
            "inp-1",
            "Text Input",
            "ui/inputs",
            "Standard text input with validation",
            ["ui", "form"],
        );
        add(
            "inp-2",
            "Date Picker",
            "ui/inputs/complex",
            "Calendar based date selector",
            ["ui", "form", "complex"],
        );
        add(
            "nav-1",
            "Sidebar Nav",
            "layout/navigation",
            "Vertical navigation menu",
            ["layout", "fav"],
        );
        add("mod-1", "User Model", "core/models", "User data definitions", [
            "core",
            "logic",
        ]);
        add(
            "serv-1",
            "API Service",
            "core/services",
            "Axios wrapper for API calls",
            ["core", "logic"],
        );
        add("util-1", "Date Formatter", "utils", "Helper function for dates", [
            "utils",
        ]);
    }
}
