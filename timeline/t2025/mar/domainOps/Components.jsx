import React, {
    useState,
    useImperativeHandle,
    forwardRef,
    useEffect,
} from "react";

import { CITTools } from "../rag/Helper";
import { DownArrow } from "./Icons";

export const Components = () => {
    return <div>Components</div>;
};

export const GComponent = forwardRef(({ typ, ...props }, ref) => {
    let Type = typ;
    const [st, setSt] = useState({});
    useImperativeHandle(ref, () => ({ st, setSt }));
    return <Type {...props} />;
});

export const Button = forwardRef(({ children, ...props }, ref) => {
    const [st, setSt] = useState(
        CITTools.updateObject(
            {
                className:
                    "bg-purple-800 text-white p-3 rounded-lg hover:bg-purple-700",
            },
            props
        )
    );
    useImperativeHandle(ref, () => ({ st, setSt }));
    return (
        <GComponent typ={"button"} {...st}>
            {children}
        </GComponent>
    );
});

export const LinkButton = forwardRef((props, ref) => {
    const [st, setSt] = useState(
        CITTools.updateObject(
            {
                className:
                    "bg-purple-800 text-white px-6 py-3 rounded-lg hover:bg-purple-700 mouse-pointer select-none block w-fit",
            },
            props
        )
    );

    useImperativeHandle(ref, () => ({ st, setSt }));
    return <GComponent typ={"a"} {...st} />;
});

export const Accordion = forwardRef(({ ...props }, ref) => {
    const [st, setSt] = useState(
        CITTools.updateObject(
            {
                items: [],
                container: {
                    className:
                        "bg-green-100 p-6 rounded-xl shadow-md border-2 border-green-200",
                },
                button: {
                    className:
                        "w-full text-left p-2 bg-green-500 text-white hover:bg-green-600 transition-all duration-300 rounded-t-lg flex justify-between items-center",
                },
                content: {
                    className:
                        "p-4 bg-green-50 text-green-800 border-t border-green-200",
                },
            },
            props
        )
    );
    let openClose = {
        true: {
            className: "w-5 h-5 text-white transition-transform duration-300",
        },
        false: {
            className:
                "w-5 h-5 text-white transition-transform duration-300 rotate-180",
        },
    };
    useImperativeHandle(ref, () => ({ st, setSt }));
    const toggle = (item) => {
        item.open = !item.open;
        setSt({ ...st });
    };

    return (
        <>
            {st.items.map((item) => (
                <div key={item.key} className="mb-2">
                    <button onClick={() => toggle(item)} {...st.button}>
                        <span>{item.title}</span>
                        <DownArrow {...openClose[item.open]} />
                    </button>
                    {item.open && (
                        <div className={st.content}>{item.content}</div>
                    )}
                </div>
            ))}
        </>
    );
});
