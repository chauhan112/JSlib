import React, {
    useState,
    useImperativeHandle,
    forwardRef,
    useEffect,
} from "react";

export const GForm = forwardRef(
    (
        {
            formStruc,
            onSubmit,
            onCancel,
            initialData = {},
            InputCom = DefInput,
            ...props
        },
        ref
    ) => {
        const [st, setSt] = useState(
            CITTools.updateObject(
                {
                    form: { className: "mb-4" },
                    inp: { className: "w-full p-2 border rounded mb-2" },
                    btns: {
                        className: "flex space-x-2",
                        children: [
                            {
                                type: "submit",
                                className:
                                    "bg-green-500 text-white px-4 py-2 rounded",
                                label: "Save",
                            },
                            {
                                type: "button",
                                className:
                                    "bg-gray-500 text-white px-4 py-2 rounded",
                                label: "Cancel",
                                onClick: onCancel,
                            },
                        ],
                    },
                },
                props
            )
        );
        const [data, setData] = useState(initialData);
        const onChangeForInput = (e, inp) => {
            setData({
                ...data,
                [inp.key]: inp.getter ? inp.getter(e) : e.target.value,
            });
        };
        useImperativeHandle(ref, () => ({
            st,
            setSt,
            data,
            setData,
            onChangeForInput,
        }));
        const handleSubmit = (e) => {
            e.preventDefault();
            onSubmit(data);
        };

        return (
            <form onSubmit={handleSubmit} className={st.form.className}>
                {formStruc.map((inp) => (
                    <InputCom
                        onChange={(e) => onChangeForInput(e, inp)}
                        className={st.inp.className}
                        {...(!inp.getter && {
                            value: data[inp.key] ? data[inp.key] : "",
                        })}
                        {...CITTools.removeKeys(inp, ["getter"])}
                        key={inp.key}
                    />
                ))}
                <div className={st.btns.className}>
                    {st.btns.children.map((btn) => (
                        <button {...btn} key={btn.label}>
                            {btn.label}
                        </button>
                    ))}
                </div>
            </form>
        );
    }
);
