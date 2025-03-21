import React, { useState, useImperativeHandle, forwardRef } from "react";
import { CITTools } from "../rag/Helper";

export const DownArrow = forwardRef((props, ref) => {
    const [st, setSt] = useState(
        CITTools.updateObject(
            {
                className:
                    "w-5 h-5 text-white transition-transform duration-300",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
            },
            props
        )
    );

    useImperativeHandle(ref, () => ({ st, setSt }));
    return (
        <svg {...st}>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
            />
        </svg>
    );
});
