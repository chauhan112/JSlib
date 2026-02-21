import { GroupComponent } from "./components/group_comp";
import { Pill } from "./components/pills";
import { WebpageComp } from "./pages/generic-webpage";
import { WebpageComp as WebNav } from "../WebPageWithRoutes/webpage_with_nav";
import { Home, Info, Server } from "lucide";
import { WebPageWithBreadcrumb } from "../WebPageWithRoutes/webpages";
import { SearchComponent } from "../view_crud_list/searchComp";

export const apps = [
    {
        title: "pills",
        loc: ["ui", "label"],
        get_comp: () => Pill("pills"),
    },
    {
        title: "group component",
        loc: ["ui", "big comp", "lister", "group comp"],
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
        loc: ["ui", "big comp", "webpage"],
        get_comp: () => {
            let gc = new WebpageComp();
            let comps = gc.get_subcomponents();
            comps.header_tool.set_title("Web Page Demo");
            return gc.get_comp();
        },
    },
    {
        title: "with nav",
        loc: ["ui", "big comp", "webpage"],
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
        loc: ["ui", "big comp", "webpage"],
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
        loc: ["ui", "input", "search"],
        get_comp: () => {
            let sc = new SearchComponent();
            // sc.searchComp.inp_comp_ctrl.set_value("hello world");
            sc.setup();
            return sc.get_component();
        },
    },
];
