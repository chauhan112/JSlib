import { MainCtrl as RouteWebPageMainCtrl } from "../DomainOpsFrontend/route/controller";
import { MainCtrl as ListDisplayerMainCtrl } from "../DomainOpsFrontend/components/ListDisplayer";
import { Router } from "../../may/ToolsHomepage/Router";
import { MainCtrl as LocalStorageConfigurerMainCtrl } from "../localStorageSetter";
export const get_app_list = async () => {
    return [
        {id: "1", title: "App 1"},
        {id: "2", title: "App 2"},
        {id: "3", title: "App 3"},
    ];
}
const get_config_component = (location: string[], title: string) => {
    const localStorageConfigurerCtrl = LocalStorageConfigurerMainCtrl.localStorageConfigurer("DeploymentModel", location, title);
    return localStorageConfigurerCtrl.comp;
}

export const Page = () => {
    
    const menus = [{label: "app-config", href: "/app-config"}, {label: "global-config", href: "/config"}];
    const routeWebPageCtrl = RouteWebPageMainCtrl.routeWebPage(menus, undefined, "Deployment")
    routeWebPageCtrl.add_route_page("/app-config", () => {
        const listerCrudCtrl = ListDisplayerMainCtrl.listDisplayer([], 10, (data: any) => {
            Router.getInstance().navigate(`/app-config/${data.id}`);
        }, undefined, [])
        get_app_list().then((data: any) => {
            listerCrudCtrl.set_data(data);
            listerCrudCtrl.update();
        });
        return listerCrudCtrl.comp
        
    });
    routeWebPageCtrl.add_route_page("/config", get_config_component(["global"], "Global Config"))
    return routeWebPageCtrl
};  