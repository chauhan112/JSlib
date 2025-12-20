import { MainCtrl as RouteWebPageMainCtrl } from "./route/controller";
import { DomainCtrl, OperationCtrl } from "./pages/dom_op_page";
import { ActivityPageCtrl } from "./pages/activity";
import { GComponent } from "../../april/GComponent";

export const Page = () => {
    const domainCtrl = new DomainCtrl();
    const operationCtrl = new OperationCtrl();
    const activityPageCtrl = new ActivityPageCtrl();
    const menus = [{label: "Domain", href: "/domain"}, {label: "Operation", href: "/operation"}, {label: "Activity", href: "/activity"}];
    const routeWebPageCtrl = RouteWebPageMainCtrl.routeWebPage(menus)

    routeWebPageCtrl.router.addRoute("/domain/", domainCtrl.singleCrudCtrl.router);
    routeWebPageCtrl.router.addRoute("/operation/", operationCtrl.singleCrudCtrl.router);
    routeWebPageCtrl.router.addRoute("/activity/", activityPageCtrl.router);
    routeWebPageCtrl.add_404_page();


    activityPageCtrl.set_display_comp(routeWebPageCtrl.display_page.bind(routeWebPageCtrl));
    domainCtrl.singleCrudCtrl.display_on_body = (comps: GComponent[]) => routeWebPageCtrl.comp.s.mainBody.update({ innerHTML: "", children: comps });
    operationCtrl.singleCrudCtrl.display_on_body = (comps: GComponent[]) => routeWebPageCtrl.comp.s.mainBody.update({ innerHTML: "", children: comps });
    domainCtrl.set_nav_selector((href: string) => routeWebPageCtrl.select_menu_item(href));
    operationCtrl.set_nav_selector((href: string) => routeWebPageCtrl.select_menu_item(href));
    activityPageCtrl.singleCrudCtrl.display_on_body = (comps: GComponent[]) => routeWebPageCtrl.comp.s.mainBody.update({ innerHTML: "", children: comps });
    activityPageCtrl.set_nav_selector((href: string) => routeWebPageCtrl.select_menu_item(href));

    
    routeWebPageCtrl.router.route();
    return routeWebPageCtrl.comp;
};