import React, { useState, useImperativeHandle, forwardRef } from "react";
import { CITTools } from "../rag/Helper";

export const DownArrow = forwardRef(({ down, ...props }, ref) => {
    let openCloseCSS = {
        true: {
            className: "w-5 h-5 text-white transition-transform duration-300",
        },
        false: {
            className:
                "w-5 h-5 text-white transition-transform duration-300 rotate-180",
        },
    };
    const [st, setSt] = useState(
        CITTools.updateObject(
            {
                className: openCloseCSS[down].className,
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
            },
            props
        )
    );

    const flip = (down) => {
        setSt({ ...st, ...CITTools.updateObject(openCloseCSS[down]) });
    };

    useImperativeHandle(ref, () => ({ st, setSt, flip, openCloseCSS }));

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
