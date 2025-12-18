import { MainCtrl as RouteWebPageMainCtrl } from "./route/controller";
import { DomOpsPageCtrl } from "./pages/dom_op_page";
import { ActivityPage } from "./pages/activity";

const domOps = new DomOpsPageCtrl();

export const Page = () => {
    const menus = [{label: "Domain", href: "/domain"}, {label: "Operation", href: "/operation"}, {label: "Activity", href: "/activity"}];
    const routeWebPageCtrl = RouteWebPageMainCtrl.routeWebPage(menus, [{ href: "/domain", page : () => domOps.get_domain_page()},{
        href: "/operation", page : () => domOps.get_operation_page()
    }])
    
    routeWebPageCtrl.add_route_page("/activity", ActivityPage);
    routeWebPageCtrl.add_404_page();
    return routeWebPageCtrl.comp;
};