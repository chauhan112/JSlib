import { Tools } from "../../../globalComps/tools";
const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

export const createNS = (name: string, props?: { [key: string]: any }) => {
    let component = document.createElementNS(SVG_NAMESPACE, name);
    if (props) {
        for (let key in props) {
            component.setAttribute(key, props[key]);
        }
    }
    return component;
};

export const SVGCreator = (props?: { [key: string]: any }) => {
    let component = createNS("svg");
    const updateProp = (key: string, value: any) => {
        if (key === "child") {
            component.appendChild(value);
            return;
        }
        if (key === "children") {
            for (let child of value) {
                component.appendChild(child);
            }
            return;
        }
        component.setAttribute(key, value);
    };
    for (let key in props) {
        updateProp(key, props[key]);
    }

    let ele = Tools.div(
        {},
        {},
        {
            comp: component,
            updateProp: updateProp,
        }
    );
    ele.getElement().appendChild(component);

    return ele;
};
