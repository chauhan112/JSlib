import React, {
    useState,
    useImperativeHandle,
    forwardRef,
    useEffect,
} from "react";
import { CITTools } from "../rag/Helper";
import { DownArrow } from "./Icons";
import { MoreVertical } from "lucide-react";

const RepeaterWrapperComponent = forwardRef(
    ({ Component, callParams, ...props }, ref) => {
        let newProps = {};

        for (const [key, value] of Object.entries(props)) {
            if (typeof value === "function") {
                newProps[key] = (e) => {
                    return value(e, callParams);
                };
            } else {
                newProps[key] = value;
            }
        }

        return <Component {...newProps} />;
    }
);
export const Repeater = forwardRef(
    ({ data = [], Component = "div", callParams, ...props }, ref) => {
        const [st, setSt] = useState(
            CITTools.updateObject(
                {
                    container: {
                        className: "w-full flex flex-col",
                    },
                    keysInfo: {},
                    items: {
                        className: "text-lg font-bold",
                    },
                },
                props
            )
        );
        const refs = data.reduce((acc, item) => {
            acc[item.key] = React.createRef();
            return acc;
        }, {});

        const [ldata, setLdata] = useState(data);

        useImperativeHandle(ref, () => ({ st, setSt, refs, ldata, setLdata }));
        return (
            <div {...st.container}>
                {ldata.map((item) => (
                    <RepeaterWrapperComponent
                        Component={Component}
                        {...st.items}
                        {...item}
                        ref={refs[item.key]}
                        key={item.key}
                        callParams={callParams}
                    />
                ))}
            </div>
        );
    }
);

export const FormInput = forwardRef(
    ({ InputCom = "input", getter, data, setData, ...props }, ref) => {
        const [st, setSt] = useState(
            CITTools.updateObject(
                {
                    className: "w-full p-2 border rounded mb-2",
                },
                props
            )
        );
        useImperativeHandle(ref, () => ({ st, setSt }));
        const getterHandler = getter || ((e) => e.target.value);
        return (
            <InputCom
                onChange={(e) =>
                    setData({ ...data, [st.key]: getterHandler(e) })
                }
                className={st.className}
                {...st}
                key={st.key}
            />
        );
    }
);

export const GForm = forwardRef(
    (
        {
            formStruc,
            onSubmit,
            onCancel,
            initialData = {},
            InputCom = FormInput,
            ...props
        },
        ref
    ) => {
        const [st, setSt] = useState(
            CITTools.updateObject(
                {
                    form: { className: "mb-4" },
                    btns: {
                        className: "flex space-x-2",
                        children: [
                            {
                                key: "save",
                                type: "submit",
                                className:
                                    "bg-green-500 text-white px-4 py-2 rounded",
                                children: "Save",
                            },
                            {
                                key: "cancel",
                                type: "button",
                                className:
                                    "bg-gray-500 text-white px-4 py-2 rounded",
                                children: "Cancel",
                                onClick: onCancel || (() => {}),
                            },
                        ],
                    },
                },
                props
            )
        );
        const [data, setData] = useState(initialData);
        useImperativeHandle(ref, () => ({
            st,
            setSt,
            data,
            setData,
            formStruc,
        }));
        let strucRef = React.createRef();
        let btnsRef = React.createRef();
        const handleSubmit = (e) => {
            e.preventDefault();
            onSubmit && onSubmit(data);
        };

        return (
            <form onSubmit={handleSubmit} {...st.form}>
                <Repeater
                    data={formStruc}
                    Component={InputCom}
                    ref={strucRef}
                    {...{
                        items: {
                            data,
                            setData,
                        },
                    }}
                />
                {st.btns && (
                    <Repeater
                        data={st.btns.children}
                        Component="button"
                        ref={btnsRef}
                        {...{
                            container: { className: st.btns.className },
                        }}
                    />
                )}
            </form>
        );
    }
);

export const AccordionComponent = forwardRef(({ ...props }, ref) => {
    const [st, setSt] = useState(
        CITTools.updateObject(
            {
                container: {
                    className: "mb-2",
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
    let arrowRef = React.createRef();

    const toggle = () => {
        st.open = !st.open;
        setSt({ ...st });
        arrowRef.current.flip(st.open);
    };
    useImperativeHandle(ref, () => ({ st, setSt, toggle }));
    return (
        <div {...st.container}>
            <button onClick={toggle} {...st.button}>
                <span>{st.title}</span>
                <DownArrow {...{ down: st.open }} ref={arrowRef} />
            </button>
            {st.open && <div {...st.content} />}
        </div>
    );
});

export const Accordion = forwardRef(({ items }, ref) => {
    return <Repeater data={items} Component={AccordionComponent} />;
});

export const ContextMenuComponent = forwardRef((props, ref) => {
    const [st, setSt] = useState(
        CITTools.updateObject(
            {
                container: {
                    className:
                        "flex items-center justify-between border-b-2 border-black hover:bg-yellow-100",
                },
                title: {
                    className: "text-black block flex-1 font-mono p-4",
                },
                btns: [
                    {
                        key: "moreInfo",
                        className: "p-1 text-black hover:text-gray-700",
                        children: <MoreVertical className="h-5 w-5" />,
                    },
                ],
                opsContainer: {
                    container: {
                        className: "w-fit",
                    },
                },
            },
            props
        )
    );

    useImperativeHandle(ref, () => ({ st, setSt }));
    const btnsRef = React.createRef();
    return (
        <div {...st.container}>
            <div {...st.title} />
            {st.btns && (
                <Repeater
                    data={st.btns}
                    Component="button"
                    ref={btnsRef}
                    {...st.opsContainer}
                />
            )}
        </div>
    );
});

// still needs implementing. it is taking alot of time so i am going to take it slowly
// problem: how to resolve repeater inside another repeater
// how to know which element is clicked
// pass params as state or normal way
export const ContextMenu = forwardRef(
    ({ items, commonOps, moreOptions }, ref) => {
        const mainStruc = items.map((item) => {
            return {
                ...commonOps,
                ...item,
            };
        });

        return <Repeater data={mainStruc} Component={ContextMenuComponent} />;
    }
);
