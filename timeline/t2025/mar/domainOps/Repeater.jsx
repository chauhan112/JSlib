import React, {
    useState,
    useImperativeHandle,
    forwardRef,
    useEffect,
} from "react";
import { CITTools } from "../rag/Helper";
import { DownArrow } from "./Icons";
export const Repeater = forwardRef(
    ({ data = [], Component = "div", ...props }, ref) => {
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
                    <Component
                        key={item.key}
                        {...st.items}
                        {...CITTools.removeKeys(item, ["key"])}
                        ref={refs[item.key]}
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
                                label: "Save",
                            },
                            {
                                key: "cancel",
                                type: "button",
                                className:
                                    "bg-gray-500 text-white px-4 py-2 rounded",
                                label: "Cancel",
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
                    <div className={st.btns.className}>
                        <Repeater
                            data={st.btns.children}
                            Component="button"
                            ref={btnsRef}
                        />
                    </div>
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
    useImperativeHandle(ref, () => ({ st, setSt, toggle, openCloseCSS }));
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
    const [st, setSt] = useState(items);
    useImperativeHandle(ref, () => ({ st, setSt }));

    return (
        <>
            {st.map((item) => (
                <AccordionComponent {...item} key={item.key} />
            ))}
        </>
    );
});
