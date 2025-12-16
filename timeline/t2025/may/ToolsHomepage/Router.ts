export class Router {
    private static routes: { [path: string]: any } = {};
    private static instance: Router | null = null;
    private constructor() {}
    static getInstance() {
        Router.instance ??= new Router();
        window.addEventListener(
            "hashchange",
            Router.instance.route.bind(Router.instance)
        );
        return Router.instance;
    }
    addRoute(path: string, func: any) {
        Router.routes[path] = func;
    }
    addRoutes(routes: { [path: string]: any }) {
        for (const path in routes) {
            this.addRoute(path, routes[path]);
        }
    }
    route() {
        const hash = window.location.hash.slice(1) || "/";
        const routeFunc = Router.routes[hash];
        if (routeFunc) {
            routeFunc();
        } else {
            Router.routes["*"]();
        }
    }
    navigate(path: string) {
        window.location.hash = path;
    }

}
