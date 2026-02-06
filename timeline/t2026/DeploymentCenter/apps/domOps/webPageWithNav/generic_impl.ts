import type { GComponent } from "../../../../../globalComps/GComponent";
import { GlobalStates } from "../../../../../globalComps/GlobalStates";
import { Tools } from "../../../../../globalComps/tools";
import type { RouteWebPageController } from "../../../../../t2025/dec/DomainOpsFrontend/route/controller";
import type { ISidebar, IView, IInfoShow, SideBarItem } from "./interface";

export class GenericSidebar implements ISidebar{
    get_items(): SideBarItem[] {
        return [{label: "Domains", relative_route_path: "/domains"}, 
            {label: "Applications", relative_route_path: "/applications"}, 
            {label: "Servers", relative_route_path: "/servers"}, 
            {label: "Users", relative_route_path: "/users"},
            {label: "Roles", relative_route_path: "/roles"},
            {label: "Permissions", relative_route_path: "/permissions"},
            {label: "Settings", relative_route_path: "/settings"},
            {label: "Logs", relative_route_path: "/logs"},
            {label: "About", relative_route_path: "/about"}];
    }
}

export class GenericInfoShow implements IInfoShow{
    info(msg: string): void {
        GlobalStates.getInstance().states.notification.addToast(msg, "", "info");
    }
    error(msg: string): void {
        GlobalStates.getInstance().states.notification.addToast(msg, "", "error");
    }
    warning(msg: string): void {
        GlobalStates.getInstance().states.notification.addToast(msg, "", "warning");
    }
    success(msg: string): void {
        GlobalStates.getInstance().states.notification.addToast(msg, "", "success");
    }
}

export class GenericView implements IView{
    display_on_body(comps: GComponent[]): void {
        console.log(comps);
    }
    show_on_modal(comp: GComponent): void {
        GlobalStates.getInstance().states.modal.show(comp);
    }
    get_footer_text(): string {
        return "Domain Ops Deployment Center";
    }
    get_title(): string {
        return "Domain Ops";
    }
    get_header(title: string): GComponent {
        return Tools.comp("div", {textContent: title});
    }
    on_title_clicked(title: string): void {
        console.log(title);
    }

}

export class GenericModel {
    show: IInfoShow = new GenericInfoShow();
    sidebar: ISidebar = new GenericSidebar();
    view: IView = new GenericView();
    parent_ctrl: RouteWebPageController;

    components: { [key: string]: GComponent } = {};
    constructor(parent_ctrl: RouteWebPageController) {
        this.parent_ctrl = parent_ctrl
    }
    setup() {
        this.set_menu_items();
        this.set_header_footer();
    }
    private set_header_footer(){
        let app_name = this.view.get_title();
        let footer_text = `© ${new Date().getFullYear()} ${this.view.get_footer_text()}`;
        this.parent_ctrl.comp.s.header.s.title.update({textContent: app_name});
        this.parent_ctrl.sidebar_ctrl.comp.s.header.s.title.update({textContent: app_name});
        this.parent_ctrl.sidebar_ctrl.comp.s.footer.s.footer_text.update({textContent: footer_text});
    }
    private get_menu_item(info: SideBarItem) {
        return Tools.comp("button", {
            class: "flex items-center px-4 py-3 rounded-md transition-colors duration-200 hover:bg-gray-700 cursor-pointer w-full",
            children: [
                Tools.comp("span", {
                    textContent: info.label,
                }),
            ],
        },  { click: () => this.on_click_menu_item(info) });
    }

    private on_click_menu_item(info: SideBarItem) {
        this.show.success(`Clicked on ${info.label}`);
        this.select_menu_item(info);
    }
    select_menu_item(info: SideBarItem) {
        for (const key in this.components) {
            this.components[key].getElement().classList.remove('bg-gray-900', 'border-l-4', 'border-blue-500');
            this.components[key].getElement().classList.add('hover:bg-gray-700');

        }
        if (this.components[info.relative_route_path]) {
            const link = this.components[info.relative_route_path].getElement();
            link.classList.add('bg-gray-900', 'border-l-4', 'border-blue-500');
            link.classList.remove('hover:bg-gray-700');
        }
    }
    set_menu_items() {
        this.sidebar.get_items().forEach((info: SideBarItem) => {
            const menu_item = this.get_menu_item(info);
            this.parent_ctrl.sidebar_ctrl.comp.s.menu_items.update({ child: menu_item });
            this.components[info.relative_route_path] = menu_item;
        });
    }
}