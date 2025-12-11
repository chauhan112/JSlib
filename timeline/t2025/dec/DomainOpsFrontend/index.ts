import { MainCtrl as RouteWebPageMainCtrl } from "./route/controller";
import { DomainOpsPage, DomainOpsCRUDModel } from "./pages/dom_op_page";
import { ActivityPage } from "./pages/activity";
const domOps = DomainOpsPage();
export const Page = () => {
    const menus = [{label: "Domain", href: "/domain"}, {label: "Operation", href: "/operation"}, {label: "Activity", href: "/activity"}];
    const routeWebPageCtrl = RouteWebPageMainCtrl.routeWebPage(menus, [{ href: "/domain", page : () => {
        (domOps.s.singleCrudCtrl.model as DomainOpsCRUDModel).type = "Domain";
        domOps.s.singleCrudCtrl.update();
        return domOps;
    }},{
        href: "/operation", page : () => {
            (domOps.s.singleCrudCtrl.model as DomainOpsCRUDModel).type = "Operation";
            domOps.s.singleCrudCtrl.update();
            return domOps;
        }
    }])

    routeWebPageCtrl.add_route_page("/activity", ActivityPage);
    return routeWebPageCtrl.comp;
};