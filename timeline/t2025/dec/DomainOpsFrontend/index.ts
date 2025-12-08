import { MainCtrl as RouteWebPageMainCtrl } from "./route/controller";
import { DomainOpsPage, DomainOpsCRUDModel } from "./pages/dom_op_page";

const domOps = DomainOpsPage();
export const Page = () => {
    const menus = [{label: "Domain", href: "/domain"}, {label: "Operation", href: "/operation"}];
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
    }]);
    return routeWebPageCtrl.comp;
};