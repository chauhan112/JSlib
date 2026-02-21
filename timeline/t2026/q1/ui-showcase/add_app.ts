import { WebPageWithBreadcrumb } from "../WebPageWithRoutes/webpages";
import { GroupComponent } from "./components/group_comp";
import { Pill } from "./components/pills";
import { WebpageComp } from "./pages/generic-webpage";

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
        title: "web page",
        loc: ["ui", "big comp", "webpage", "sidebar"],
        get_comp: () => {
            let gc = new WebpageComp();
            let comps = gc.get_subcomponents();
            comps.header_tool.set_title("Web Page Demo");
            return gc.get_comp();
        },
    },
    // {
    //     title: "web page",
    //     loc: ["ui", "big comp", "webpage", "sidebar"],
    //     get_comp: () => {
    //         let gc = new WebPageWithBreadcrumb();
    //         let comps = gc.get_subcomponents();
    //         comps.header_tool.set_title("Web Page Demo");
    //         return gc.get_comp();
    //     },
    // },
];
