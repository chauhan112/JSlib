import React, {
    useState,
    useImperativeHandle,
    forwardRef,
    useEffect,
} from "react";

import { CITTools } from "../rag/Helper";
import { GComponent, Accordion } from "./Components";
import { GForm } from "../rag/Components";

export const Header = forwardRef((props, ref) => {
    const [st, setSt] = useState({ ...props });
    useImperativeHandle(ref, () => ({ st, setSt }));

    return <div {...st}>{st.children}</div>;
});

export const Sidebar = forwardRef((props, ref) => {
    const [st, setSt] = useState(
        CITTools.updateObject(
            {
                title: {
                    className: "text-lg font-bold",
                    children: "DOMAIN LOGGER",
                },
                container: {
                    className: "w-64 bg-gray-700 text-white p-4",
                },
            },
            props
        )
    );
    const searchFormRef = React.createRef();
    const accordionRef = React.createRef();

    const onSubmit = (data) => {
        console.log(data, searchFormRef);
        searchFormRef.current.setData({ search: "" });
    };

    useImperativeHandle(ref, () => ({ st, setSt, searchFormRef }));
    return (
        <aside className={st.container.className}>
            <h1 className={st.title.className}>{st.title.children}</h1>
            <GForm
                {...{
                    btns: null,
                    formStruc: [
                        {
                            key: "search",
                            type: "text",
                            placeholder: "search",
                            className: "w-full p-2 mt-4 text-black rounded",
                        },
                    ],
                    onSubmit,
                }}
                ref={searchFormRef}
            />
            <Accordion
                {...{
                    items: [
                        {
                            title: "Domains",
                            content: (
                                <h1 className="text-lg font-bold">Domains</h1>
                            ),
                            key: "domains",
                            open: false,
                        },
                        // {
                        //     title: "Operations",
                        //     content: "Operations",
                        //     key: "operations",
                        //     open: false,
                        // },
                        // {
                        //     title: "Activities",
                        //     content: "activities",
                        //     key: "activities",
                        //     open: true,
                        // },
                    ],
                }}
                ref={accordionRef}
            />
        </aside>
    );
});
