import { GComponent, IComponent, Tools } from "./GComponent";
import { IFormComponent } from "./GForm";

export class DropdownMenu implements IComponent, IFormComponent {
    s: { [key: string]: any } = {};
    comp: GComponent | null = null;
    options: { [key: string]: any } = {};
    constructor(options: any[] = []) {
        this.s.options = options;
        this.s.funcs = {
            makeOption: this.makeOption.bind(this),
        };
    }

    getElement(): HTMLElement | SVGElement {
        if (this.comp) {
            return this.comp.getElement();
        }
        this.comp = Tools.comp("select", {
            class: "w-full p-1 rounded-sm bg-gray-100 text-black border border-gray-300 transition-all duration-300",
            children: this.s.options.map((option: any) => {
                const comp = this.s.funcs.makeOption(option);
                this.options[option.value] = comp;
                return comp;
            }),
        });

        return this.comp.getElement();
    }
    getProps(): { [key: string]: any } {
        return this.comp!.getProps();
    }
    get() {
        const comp = this.getElement() as HTMLSelectElement;
        return comp.value;
    }
    set(value: any): void {
        const comp = this.getElement() as HTMLSelectElement;
        comp.value = value;
    }
    clear(): void {
        const comp = this.getElement() as HTMLSelectElement;
        comp.value = "";
    }
    makeOption(option: any) {
        return Tools.comp("option", {
            value: option.value,
            textContent: option.textContent,
        });
    }
}

export class MultiSelectWithSearch implements IComponent, IFormComponent {
    s: { [key: string]: any } = {};
    comp: GComponent | null = null;
    constructor(options: any[] = []) {
        this.s.selectedItems = [];

        this.s.isDropdownOpen = false;
        this.setupEventListeners();
        this.setOptions(options);
    }
    clear(): void {
        this.s.selectedItems = [];
        this.updateSelectedItemsDisplay();
        this.renderOptions(this.s.options);
    }
    getElement(): HTMLElement | SVGElement {
        if (this.comp) {
            return this.comp.getElement();
        }
        this.comp = Tools.div({
            class: "relative",
            children: [
                Tools.div(
                    {
                        key: "selectedItems",
                        class: "flex flex-wrap gap-2 p-2 bg-white border border-gray-300 rounded-lg shadow-sm cursor-pointer",
                        child: Tools.comp("span", {
                            key: "placeholder",
                            class: "text-gray-400",
                            textContent: "Select options...",
                        }),
                    },
                    {
                        click: () => this.toggleDropdown(),
                    }
                ),
                Tools.div({
                    key: "dropdownMenu",
                    class: "absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg hidden max-h-60 overflow-y-auto",
                    children: [
                        Tools.div({
                            key: "searchBox",
                            class: "p-2 border-b border-gray-200",
                            child: Tools.comp(
                                "input",
                                {
                                    type: "text",
                                    key: "searchInput",
                                    placeholder: "Search...",
                                    class: "w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500",
                                },
                                {
                                    input: (e: any, ls: any) => {
                                        this.filterOptions(e.target.value);
                                    },
                                }
                            ),
                        }),
                        Tools.div({
                            key: "optionsList",
                            class: "flex flex-wrap gap-2 bg-white border border-gray-300 rounded-lg shadow-sm ",
                        }),
                    ],
                }),
            ],
        });
        this.comp.getElement();
        const selectedItemsContainer = this.comp.s.selectedItems;
        const placeholder = selectedItemsContainer.s.placeholder;
        const dropdownMenu = this.comp.s.dropdownMenu;
        const searchBox = dropdownMenu.s.searchBox;
        const optionsList = dropdownMenu.s.optionsList;
        const searchInput = searchBox.s.searchInput;
        const noOptions = Tools.comp("div", {
            class: "p-3 text-gray-500",
            textContent: "No options found",
        });
        this.s.comps = {
            selectedItemsContainer,
            placeholder,
            dropdownMenu,
            searchBox,
            optionsList,
            searchInput,
            noOptions,
        };

        return this.comp.getElement();
    }
    getProps(): { [key: string]: any } {
        return this.comp!.getProps();
    }
    get(): any {
        return this.s.selectedItems;
    }
    set(value: any): void {
        this.s.selectedItems = value;
        this.updateSelectedItemsDisplay();
        this.renderOptions(this.s.options);
    }
    renderOptions(optionsToRender: any[]) {
        this.getElement();
        this.s.comps.optionsList.update({ innerHTML: "" });

        if (optionsToRender.length === 0) {
            this.s.comps.optionsList.update({ child: this.s.comps.noOptions });
            return;
        }
        this.s.comps.optionsList.update({
            children: optionsToRender.map((option) => {
                const isSelected = this.s.selectedItems.some(
                    (item: any) => item.id === option.id
                );

                const optionElement = Tools.div(
                    {
                        class: `p-2 hover:bg-gray-100 cursor-pointer flex items-center`,
                        children: [
                            Tools.comp("input", {
                                type: "checkbox",
                                class: "mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500",
                                ...(isSelected ? { checked: true } : {}),
                            }),
                            Tools.comp("span", { textContent: option.text }),
                        ],
                    },
                    {
                        click: (e: any, ls: any) => {
                            e.stopPropagation();
                            this.handleOptionSelection(ls.s.id);
                        },
                    },
                    {
                        id: option.id,
                    }
                );
                return optionElement;
            }),
        });
    }
    updateSelectedItemsDisplay() {
        this.s.comps.selectedItemsContainer.update({ innerHTML: "" });

        if (this.s.selectedItems.length === 0) {
            this.s.comps.selectedItemsContainer.update({
                child: this.s.comps.placeholder,
            });
            return;
        }

        this.s.comps.selectedItemsContainer.update({
            children: this.s.selectedItems.map((item: any) => {
                const selectedItemElement = Tools.div({
                    class: "selected-item bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center",
                    children: [
                        Tools.comp("span", { textContent: item.text }),
                        Tools.comp(
                            "button",
                            {
                                class: "ml-2 text-blue-600 hover:text-blue-800",
                                innerHTML: "&times;",
                            },
                            {
                                click: (e: any, ls: any) => {
                                    e.stopPropagation();
                                    const idToRemove = ls.s.data.id;
                                    this.s.selectedItems =
                                        this.s.selectedItems.filter(
                                            (item: any) => item.id != idToRemove
                                        );
                                    this.updateSelectedItemsDisplay();
                                    this.renderOptions(this.s.options);
                                },
                            },
                            {
                                data: item,
                            }
                        ),
                    ],
                });

                return selectedItemElement;
            }),
        });
    }
    toggleDropdown() {
        this.s.isDropdownOpen = !this.s.isDropdownOpen;
        this.s.comps.dropdownMenu
            .getElement()
            .classList.toggle("hidden", !this.s.isDropdownOpen);

        if (this.s.isDropdownOpen) {
            this.s.comps.searchInput.getElement().focus();
        }
    }
    setOptions(options: any[]) {
        this.s.options = options;
        this.renderOptions(this.s.options);
        this.s.selectedItems = [];
        this.updateSelectedItemsDisplay();
    }
    setupEventListeners() {
        document.addEventListener("click", (e: any) => {
            if (!this.getElement().contains(e.target)) {
                this.s.comps.dropdownMenu.getElement().classList.add("hidden");
                this.s.isDropdownOpen = false;
            }
        });
    }
    filterOptions(searchTerm: string) {
        const filtered = this.s.options.filter((option: any) =>
            option.text.toLowerCase().includes(searchTerm.toLowerCase())
        );
        this.renderOptions(filtered);
    }
    handleOptionSelection(optionId: any) {
        const option = this.s.options.find((opt: any) => opt.id == optionId);

        if (!option) return;

        const isSelected = this.s.selectedItems.some(
            (item: any) => item.id == optionId
        );

        if (isSelected) {
            this.s.selectedItems = this.s.selectedItems.filter(
                (item: any) => item.id != optionId
            );
        } else {
            this.s.selectedItems.push(option);
        }

        this.updateSelectedItemsDisplay();
        this.renderOptions(this.s.options);
    }
}

export class MultiSelect implements IComponent, IFormComponent {
    s: { [key: string]: any } = {};
    comp: GComponent | null = null;
    options: { [key: string]: any } = {};

    constructor(options: any[] = []) {
        this.s.options = options;
        this.s.selectedItems = [];
        this.s.funcs = {
            makeOption: this.makeOption.bind(this),
        };
    }
    getElement(): HTMLElement | SVGElement {
        if (this.comp) {
            return this.comp.getElement();
        }
        this.comp = Tools.div({
            class: "relative",
            children: [
                Tools.comp(
                    "button",
                    {
                        key: "selectButton",
                        textContent: "Select options",
                        class: "w-full px-4 py-2 text-left bg-white text-gray-800 border-b-2 border-gray-400 rounded-none focus:outline-none focus:border-black transition-colors",
                    },
                    {
                        click: (e: any, ls: any) => {
                            this.s.comps.dropdownMenu
                                .getElement()
                                .classList.toggle("hidden");
                        },
                    }
                ),
                Tools.div({
                    key: "dropdownMenu",
                    class: "absolute w-full bg-white border-b-2 border-gray-400 rounded-none shadow-md max-h-60 overflow-y-auto z-10",
                    children: this.s.options.map((option: any) => {
                        let comp = this.s.funcs.makeOption(option);
                        this.options[option.id] = comp;
                        return comp;
                    }),
                }),
            ],
        });
        this.comp.getElement();
        const selectButton = this.comp.s.selectButton;
        const dropdownMenu = this.comp.s.dropdownMenu;
        this.s.comps = {
            selectButton,
            dropdownMenu,
        };
        return this.comp.getElement();
    }
    private makeOption(option: any) {
        return Tools.comp("label", {
            class: "flex items-center px-4 py-2 hover:border-l-2 hover:border-gray-600 cursor-pointer text-gray-700",
            children: [
                Tools.comp(
                    "input",
                    {
                        key: "checkbox",
                        type: "checkbox",
                        class: "w-4 h-4 text-black border-gray-400 rounded-none focus:ring-0",
                        value: option.id,
                    },
                    {
                        change: (e: any, ls: any) => {
                            this.updateBtnText();
                        },
                    },
                    {
                        data: option,
                    }
                ),
                Tools.comp("span", {
                    class: "ml-2",
                    textContent: option.text,
                }),
            ],
        });
    }
    updateBtnText() {
        this.s.selectedItems = [];
        for (const key in this.options) {
            if (this.options[key].s.checkbox.component.checked) {
                this.s.selectedItems.push(this.options[key].s.checkbox.s.data);
            }
        }
        let btnText = "";
        const selected = this.s.selectedItems.map((item: any) => item.text);
        if (selected.length === 0) {
            btnText = "Select options";
        } else if (selected.length <= 2) {
            btnText = selected.join(", ");
        } else {
            btnText = `${selected.length} options selected`;
        }
        this.s.comps.selectButton.update({
            textContent: btnText,
        });
    }
    setOptions(options: any[]) {
        this.s.options = options;
        this.s.comps.dropdownMenu.update({
            innerHTML: "",
            children: this.s.options.map((option: any) => {
                let comp = this.s.funcs.makeOption(option);
                this.options[option.id] = comp;
                return comp;
            }),
        });
    }

    getProps(): { [key: string]: any } {
        return this.comp!.getProps();
    }
    get(): any {
        return this.s.selectedItems;
    }
    set(value: any): void {
        this.s.selectedItems = value;
        for (const key in this.options) {
            this.options[key].s.checkbox.component.checked = false;
        }
        for (const option of value) {
            this.options[option.id].s.checkbox.component.checked = true;
        }
        this.updateBtnText();
    }
    clear(): void {
        this.set([]);
    }
}

export class Test {
    static wrapWithIFormCompOps(
        comp: IComponent,
        setValue: any = [
            { id: 1, text: "Option 1" },
            { id: 2, text: "Option 2" },
        ]
    ) {
        return Tools.div({
            children: [
                comp,
                Tools.comp(
                    "button",
                    {
                        textContent: "get value",
                        class: "bg-blue-500 text-white px-4 py-2 rounded-md",
                    },
                    {
                        click: (e: any, ls: any) => {
                            console.log(ls.s.parent.props.children[0].get());
                        },
                    }
                ),
                Tools.comp(
                    "button",
                    {
                        textContent: "set value",
                        class: "bg-blue-500 text-white px-4 py-2 rounded-md",
                    },
                    {
                        click: (e: any, ls: any) => {
                            ls.s.parent.props.children[0].set(setValue);
                        },
                    }
                ),
                Tools.comp(
                    "button",
                    {
                        textContent: "clear value",
                        class: "bg-red-500 text-white px-4 py-2 rounded-md",
                    },
                    {
                        click: (e: any, ls: any) => {
                            ls.s.parent.props.children[0].clear();
                        },
                    }
                ),
            ],
        });
    }
    static multiSelectWithSearch() {
        const options = [
            { id: 1, text: "Option 1" },
            { id: 2, text: "Option 2" },
            { id: 3, text: "Option 3" },
            { id: 4, text: "Option 4" },
            { id: 5, text: "Option 5" },
            { id: 6, text: "Option 6" },
            { id: 7, text: "Option 7" },
            { id: 8, text: "Option 8" },
        ];
        let comp = new MultiSelectWithSearch(options);
        return this.wrapWithIFormCompOps(comp);
    }
    static dropdownMenu() {
        let options = [
            {
                value: "",
                textContent: "--- Select an option ---",
            },
            {
                value: "1",
                textContent: "Option 1",
            },
            {
                value: "2",
                textContent: "Option 2",
            },
            {
                value: "3",
                textContent: "Option 3",
            },
        ];
        let comp = new DropdownMenu(options);
        comp.getElement();
        return this.wrapWithIFormCompOps(comp, 1);
    }
    static multiSelect() {
        const options = [
            { id: 1, text: "Option 1" },
            { id: 2, text: "Option 2" },
            { id: 3, text: "Option 3" },
        ];
        let comp = new MultiSelect(options);
        comp.getElement();
        comp.s.comps.dropdownMenu.getElement().classList.toggle("absolute");
        return this.wrapWithIFormCompOps(comp);
    }
}
