import React, { useState, useImperativeHandle, forwardRef } from "react";

const removeKeys = (obj, keys) => {
    // console.log(obj);
    let newObj = { ...obj };
    for (const key of keys) {
        delete newObj[key];
    }
    // console.log(newObj);
    return newObj;
};
function updateObject(obj1, obj2) {
    for (let key in obj2) {
        if (obj1.hasOwnProperty(key)) {
            if (
                typeof obj1[key] === "object" &&
                typeof obj2[key] === "object" &&
                obj1[key] !== null &&
                obj2[key] !== null &&
                !Array.isArray(obj1[key]) &&
                !Array.isArray(obj2[key])
            ) {
                updateObject(obj1[key], obj2[key]);
            } else {
                obj1[key] = obj2[key];
            }
        } else {
            obj1[key] = obj2[key];
        }
    }
    return { ...obj1 };
}
const DefInput = (props) => <input {...props} />;

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
        const [st, setSt] = useState({
            form: { className: "mb-4" },
            inp: { className: "w-full p-2 border rounded mb-2" },
            btns: {
                className: "flex space-x-2",
                children: [
                    {
                        type: "submit",
                        className: "bg-green-500 text-white px-4 py-2 rounded",
                        label: "Save",
                    },
                    {
                        type: "button",
                        className: "bg-gray-500 text-white px-4 py-2 rounded",
                        label: "Cancel",
                        onClick: onCancel,
                    },
                ],
            },

            ...props,
        });
        const [data, setData] = useState(initialData);
        useImperativeHandle(ref, () => ({ st, setSt, data, setData }));
        const handleSubmit = (e) => {
            e.preventDefault();
            onSubmit(data);
        };

        return (
            <form onSubmit={handleSubmit} className={st.form.className}>
                {formStruc.map((inp) => (
                    <InputCom
                        onChange={(e) =>
                            setData({
                                ...data,
                                [inp.key]: inp.getter
                                    ? inp.getter(e)
                                    : e.target.value,
                            })
                        }
                        className={st.inp.className}
                        {...(!inp.getter && {
                            value: data[inp.key] ? data[inp.key] : "",
                        })}
                        {...removeKeys(inp, ["getter"])}
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

export const Header = () => {
    return (
        <header className="bg-white border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-extrabold text-pink-600">
                    Creative
                </h1>
                <nav className="space-x-6">
                    <a href="#" className="text-gray-700 hover:text-pink-600">
                        Work
                    </a>
                    <a href="#" className="text-gray-700 hover:text-pink-600">
                        Team
                    </a>
                    <a
                        href="#"
                        className="bg-pink-600 text-white px-4 py-2 rounded-full hover:bg-pink-700"
                    >
                        Hire Us
                    </a>
                </nav>
            </div>
        </header>
    );
};

export const ConfirmationModal = ({ onCancel, onConfirm }) => {
    return (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-96">
                <h2 className="text-xl font-bold mb-4">Are you sure?</h2>
                <p className="text-gray-600 mb-6">
                    This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-4">
                    <button
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        onClick={onConfirm}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export const Sidebar = forwardRef((props, ref) => {
    const [st, setSt] = useState(
        updateObject(
            {
                title: "Collections",
                formStruc: [
                    {
                        key: "title",
                        type: "text",
                        placeholder: "Collection Name",
                    },
                ],
                onAdd: (collection) => {},
                onDelete: (id) => {},
                onEdit: (collection) => {},
            },
            removeKeys(props, ["collections"])
        )
    );
    const [collections, setCollections] = useState(props.collections);
    const [showForm, setShowForm] = useState(false);
    const [editCollection, setEditCollection] = useState(null);

    useEffect(() => {
        setCollections([
            { id: 1, title: "Research Papers" },
            { id: 2, title: "Books" },
        ]);
    }, []);
    useImperativeHandle(ref, () => ({
        st,
        setSt,
        collections,
        setCollections,
        editCollection,
        setEditCollection,
    }));

    const handleAddCollection = (collection) => {
        // API call: createCollection({ title })
        const newCollection = { ...collection, id: Date.now() };
        st.onAdd(newCollection);
        setCollections([...collections, newCollection]);
        setShowForm(false);
    };

    const handleEditCollection = (collection) => {
        // API call: updateCollection(collection.id, { title })
        setCollections(
            collections.map((c) => (c.id === collection.id ? collection : c))
        );
        st.onEdit(collection);
        setEditCollection(null);
    };

    const handleDeleteCollection = (id) => {
        // API call: deleteCollection(id)

        st.onDelete(id);
        setCollections(collections.filter((c) => c.id !== id));
    };

    return (
        <div className="w-64 bg-white shadow-md p-4">
            <div className="mb-4 flex justify-between items-center ">
                <h2 className="text-xl font-semibold ">{st.title}</h2>
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded "
                    onClick={() => setShowForm(true)}
                >
                    Add
                </button>
            </div>

            {showForm && (
                <GForm
                    formStruc={st.formStruc}
                    onSubmit={handleAddCollection}
                    onCancel={() => setShowForm(false)}
                />
            )}
            {editCollection && (
                <GForm
                    formStruc={st.formStruc}
                    initialData={editCollection}
                    onSubmit={handleEditCollection}
                    onCancel={() => setEditCollection(null)}
                />
            )}

            <ul>
                {collections.map((collection) => (
                    <li
                        key={collection.id}
                        className="flex justify-between items-center p-2 hover:bg-gray-100 cursor-pointer"
                    >
                        <div onClick={() => onSelectCollection(collection)}>
                            {collection.title}
                        </div>
                        <div>
                            <button
                                className="text-blue-500 mr-2 hover:bg-gray-300"
                                onClick={() => setEditCollection(collection)}
                            >
                                Edit
                            </button>
                            <button
                                className="text-red-500 hover:bg-gray-300"
                                onClick={() =>
                                    handleDeleteCollection(collection.id)
                                }
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
});
