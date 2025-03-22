import React, {
    useState,
    useImperativeHandle,
    forwardRef,
    useEffect,
} from "react";

import { CITTools } from "../rag/Helper";

export const GComponent = forwardRef(({ typ, ...props }, ref) => {
    let Type = typ;
    const [st, setSt] = useState(props);
    useImperativeHandle(ref, () => ({ st, setSt }));
    return <Type {...st} />;
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
