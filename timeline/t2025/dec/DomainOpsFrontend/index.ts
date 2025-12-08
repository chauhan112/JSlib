import { Tools } from "../../april/tools";
import { MainCtrl as SingleCrudMainCtrl } from "./SingleCrud";
import { backendCall } from "./api_calls";
import { type SingleCrudModelInterface } from "./SingleCrud";
import { InputType } from "../../june/domain-ops/Model";
import { MainCtrl as RouteWebPageMainCtrl } from "./route/controller";
export class DomainOpsCRUDModel implements SingleCrudModelInterface {
    type: string = "Domain";
    
    async read_all (){
        let data = await backendCall("read_all", {}, this.type);
        return data.data;
    }
    async read (id: string){
        let data = await backendCall("read", {id}, this.type);
        return data.data;
    }
    async create (data: any){
        let res = await backendCall("create", data, this.type);
        return res.data;
    }
    async update (id: string, data: any){
        await backendCall("update", {id, ...data}, this.type);
        return true;
    }
    async deleteIt (id: string){
        let data = await backendCall("delete", {id}, this.type);
        return data.data;
    }
}
export const DomainOpsPage = () => {
    const singleCrudCtrl = SingleCrudMainCtrl.singleCrud(4, new DomainOpsCRUDModel(), (data: any) => data.name,
        [{type: InputType.Input, key: "name", params: {placeholder: "Enter name"}}],
        [{type: InputType.Input, key: "name", params: {placeholder: "Enter name"}}]
    );
    
    return Tools.div({
        class: "w-full flex-col flex gap-2 p-2 ",
        children: [singleCrudCtrl.comp],
    }, {}, {
        singleCrudCtrl
    });
};

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