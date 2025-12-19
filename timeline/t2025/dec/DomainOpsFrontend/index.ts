import { MainCtrl as RouteWebPageMainCtrl } from "./route/controller";
import { DomOpsPageCtrl } from "./pages/dom_op_page";
import { ActivityPageCtrl } from "./pages/activity";

const domOps = new DomOpsPageCtrl();
const activityPageCtrl = new ActivityPageCtrl();

    

export const Page = () => {
    const menus = [{label: "Domain", href: "/domain"}, {label: "Operation", href: "/operation"}, {label: "Activity", href: "/activity"}];
    const routeWebPageCtrl = RouteWebPageMainCtrl.routeWebPage(menus, [{ href: "/domain", page : () => domOps.get_domain_page()},{
        href: "/operation", page : () => domOps.get_operation_page()
    }])
    
    routeWebPageCtrl.router.addRoute("/activity/", activityPageCtrl.router);
    routeWebPageCtrl.add_404_page();
    activityPageCtrl.set_display_comp(routeWebPageCtrl.display_page.bind(routeWebPageCtrl));
    return routeWebPageCtrl.comp;
};