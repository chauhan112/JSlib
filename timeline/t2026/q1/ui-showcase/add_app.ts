import { GroupComponent } from "./components/group_comp";
import { Pill } from "./components/pills";
import { WebpageComp } from "./pages/generic-webpage";
import { WebpageComp as WebNav } from "../WebPageWithRoutes/webpage_with_nav";
import { Home, Info, Server } from "lucide";
import { WebPageWithBreadcrumb } from "../WebPageWithRoutes/webpages";
import { SearchComponent } from "../view_crud_list/searchComp";
import { Chip } from "../../DeploymentCenter/apps/domOps/searchComp";
import { Tools } from "../../../globalComps/tools";
import { ExplorerComp } from "./pages/explorer";
import { EnumeratedLister, Lister, ListerWithContext } from "../lister/listers";
import { FormMainCtrl } from "../dynamicFormGenerator";
import { TestButtons } from "../directus";
import { AppCard, HeaderWithSearch } from "../../DeploymentCenter/Components";
import { SettingsPage } from "../../DeploymentCenter/settings";
import {
    FancyTitle,
    PillComp,
    PillCompExp,
    RippleLines,
    Typing,
} from "../../../t2025/april/Portfolio/simplyAwesome";
import { accordionTest } from "../../../t2025/april/Accordion";
import { Spinner } from "../../../t2025/aug/jobAIApply/simpleVersion";
import { ToggleButton } from "../../../t2025/april/MoreComponents";
import { Test } from "../../../t2025/april/Select";
import { Test as ContextMenuTest } from "../../../t2025/april/ListWithCrud";
export const apps = [
    {
        title: "pills",
        loc: ["label"],
        get_comp: () => Pill("pills"),
    },
    {
        title: "pill2 ",
        loc: ["label"],
        get_comp: () => PillComp("pills"),
    },
    {
        title: "pill 3 ",
        loc: ["label"],
        get_comp: () => PillCompExp("pills"),
    },
    {
        title: "group component",
        loc: ["ui", "grouper"],
        get_comp: () => {
            let gc = new GroupComponent();
            gc.set_title("Group Component");
            gc.set_items([
                { label: "item 1", value: "item 1" },
                { label: "item 2", value: "item 2" },
            ]);
            return gc.get_comp();
        },
    },
    {
        title: "simple",
        loc: ["big comp", "webpage"],
        get_comp: () => {
            let gc = new WebpageComp();
            let comps = gc.get_subcomponents();
            comps.header_tool.set_title("Web Page Demo");
            return gc.get_comp();
        },
    },
    {
        title: "with nav",
        loc: ["big comp", "webpage"],
        get_comp: () => {
            let gc = new WebNav();
            let comps = gc.get_subcomponents();
            comps.header_tools.set_title("Web Page Nav");
            comps.sidebar.add_nav_item({
                label: "Home",
                value: "home",
                icon: Home,
            });
            comps.sidebar.add_nav_item({
                label: "About",
                value: "about",
                icon: Info,
            });
            comps.sidebar.add_divider("more");
            comps.sidebar.add_nav_item({
                label: "Service",
                value: "service",
                icon: Server,
            });
            comps.sidebar
                .get_subcomponents()
                .footer.set_title("you can change me");
            return gc.get_comp();
        },
    },
    {
        title: "with breadcrumb",
        loc: ["big comp", "webpage"],
        get_comp: () => {
            let wp = new WebPageWithBreadcrumb();
            wp.set_title("Web Page With Breadcrumb");
            wp.set_breadcrumb([
                { name: "Home", value: "home" },
                { name: "About", value: "about" },
                { name: "Service", value: "service" },
            ]);
            return wp.get_comp();
        },
    },
    {
        title: "search comp",
        loc: ["input", "search"],
        get_comp: () => {
            let sc = new SearchComponent();
            // sc.searchComp.inp_comp_ctrl.set_value("hello world");
            sc.setup();
            return sc.get_component();
        },
    },
    {
        title: "chip",
        loc: ["btns", "chip"],
        get_comp: () => {
            const get_chip = (value: string) => {
                let chip = Chip(value.trim());
                chip.s.delete.update(
                    {},
                    {
                        click: () => {
                            console.log("remove", value);
                        },
                    },
                );
                return chip;
            };
            return Tools.comp("div", {
                class: "flex gap-2",
                children: [
                    get_chip("hello world"),
                    get_chip("abc"),
                    get_chip("nice"),
                ],
            });
        },
    },
    {
        title: "simple explorer",
        loc: ["big comp", "explorer"],
        get_comp: () => {
            let exp = new ExplorerComp();
            exp.set_items(
                [
                    { label: "..", value: ".." },
                    { label: "folder1", value: "folder" },
                ],
                [
                    { label: "file1", value: "file" },
                    { label: "file2", value: "file" },
                ],
            );
            return exp.get_comp();
        },
    },

    {
        title: "simple list",
        loc: ["big comp", "lister"],
        get_comp: () => {
            let exp = new Lister();
            exp.set_values([
                { title: "file1", value: "file" },
                { title: "file2", value: "file" },
            ]);
            return exp.get_comp();
        },
    },
    {
        title: "list with context menu",
        loc: ["big comp", "lister"],
        get_comp: () => {
            let exp = new ListerWithContext();
            exp.on_context_clicked = (data: any, label: string) => {
                console.log(label, data);
            };
            exp.set_values([
                { title: "file1", value: "file" },
                { title: "file2", value: "file" },
            ]);
            return exp.get_comp();
        },
    },
    {
        title: "enumered list",
        loc: ["big comp", "lister"],
        get_comp: () => {
            let exp = new EnumeratedLister();

            exp.set_values([
                { title: "file1", value: "file" },
                { title: "file2", value: "file" },
            ]);
            return exp.get_comp();
        },
    },
    {
        title: "dynamic form",
        loc: ["big comp", "input", "form"],
        get_comp: () => {
            return FormMainCtrl.testForm().get_comp(); // exp.get_comp();
        },
    },
    {
        title: "directus model testing",
        loc: ["model", "directus"],
        get_comp: () => {
            let tb = new TestButtons();
            return tb.get_component();
        },
    },
    {
        title: "header with search",
        loc: ["ui", "webpage", "header"],
        get_comp: () => {
            let tb = HeaderWithSearch();
            return tb;
        },
    },
    {
        title: "app-card",
        loc: ["ui", "lister", "components", "card"],
        get_comp: () => {
            let tb = AppCard({
                icon: "rain",
                name: "name",
                status: "status",
            });
            return tb;
        },
    },
    {
        title: "setting page",
        loc: ["ui", "webpage", "setting"],
        get_comp: () => {
            let tb = SettingsPage();
            return tb;
        },
    },
    {
        title: "ripple lines",
        loc: ["ui", "aesthetic", "webpage"],
        get_comp: () => {
            let tb = new RippleLines();
            tb.getElement().classList.remove("z-[-1]");
            tb.getElement().classList.add("z-1");
            return Tools.comp("div", {
                class: "w-full h-full relative",
                child: tb.comp,
            });
        },
    },
    {
        title: "typing text",
        loc: ["ui", "aesthetic", "typing"],
        get_comp: () => {
            let tb = new Typing();
            tb.s.content = ["Hello World", "This is a demo", "for typing text"];
            tb.getElement();
            tb.start();
            return tb.comp;
        },
    },
    {
        title: "double header",
        loc: ["ui", "aesthetic", "header"],
        get_comp: () => {
            let tb = FancyTitle("Example");
            return tb;
        },
    },
    {
        title: "accordion 2024/april",
        loc: ["ui", "grouper"],
        get_comp: () => {
            let acc = accordionTest();
            acc.getElement();
            return acc.comp;
        },
    },
    {
        title: "spinner ",
        loc: ["ui", "aesthetic", "animate"],
        get_comp: () => {
            return Spinner();
        },
    },
    {
        title: "ToggleButton",
        loc: ["ui", "btns", "toggle"],
        get_comp: () => {
            return ToggleButton();
        },
    },
    {
        title: "multiselect with search",
        loc: ["ui", "inputs", "dropdown"],
        get_comp: Test.multiSelectWithSearch,
    },
    {
        title: "multiselect",
        loc: ["ui", "inputs", "dropdown"],
        get_comp: Test.multiSelect, // Test.dropdownMenu.
    },
    {
        title: "simple dropdown",
        loc: ["ui", "inputs", "dropdown"],
        get_comp: Test.dropdownMenu, // Test.dropdownMenu.
    },
    // {
    //     title: "context menu",
    //     loc: ["ui", "selections", "rightclick"],
    //     get_comp: () => {
    //         let cm = ContextMenuTest.contextMenu();
    //         cm.getElement();
    //         return cm.comp;
    //     },
    // },
    // {
    //     title: "crud",
    //     loc: ["ui", "selections", "lister"],
    //     get_comp: () => {
    //         let cm = ContextMenuTest.listWithCrud();

    //         return cm.comp;
    //     },
    // },
];
