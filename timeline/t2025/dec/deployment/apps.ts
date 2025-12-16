export interface IApp {
    name: string;
    configs: any[];
    description: string;
}

export class AppController {
    apps: {[name: string]: IApp} = {};
    get_apps() {
        return Object.values(this.apps);
    }
    get_app(name: string) {
        return this.apps[name];
    }
    add_app(app: IApp) {
        this.apps[app.name] = app;
        return app;
    }
    update_app(name: string, app: IApp) {
        this.apps[name] = app;
        return app;
    }
}