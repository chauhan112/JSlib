import React, {
    useState,
    useEffect,
    useRef,
    forwardRef,
    useImperativeHandle,
} from "react";
import { MoreVertical, Edit, Trash, Eye } from "lucide-react";
import { Repeater } from "./Repeater";
import { CITTools } from "../rag/Helper";

export const ContextMenuComponent = forwardRef(({ name, description }, ref) => {
    return (
        <div>
            <h3 className="font-medium text-gray-800">{name}</h3>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
    );
});

export const ContextMenu = forwardRef(({ items = [], parent }, ref) => {
    return (
        <div className="absolute right-0 mt-2 w-fit bg-white rounded-md shadow-lg z-10 border border-gray-200">
            <Repeater
                data={items}
                Component="button"
                container={{ className: "py-1" }}
                callParams={parent}
            />
        </div>
    );
});

export const OpsComponent = forwardRef(
    ({ item, openMenuId, toggleMenu, moreOptions, menuOptions = [] }, ref) => {
        return (
            <div className="relative">
                <div className="flex">
                    {moreOptions && (
                        <Repeater
                            data={moreOptions}
                            Component="button"
                            items={{
                                className:
                                    "p-1 rounded-full hover:bg-gray-200 focus:outline-none",
                            }}
                            container={{ className: "flex" }}
                            callParams={item}
                        />
                    )}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleMenu(item.key);
                        }}
                        className="p-1 rounded-full hover:bg-gray-200 focus:outline-none"
                    >
                        <MoreVertical className="h-5 w-5 text-gray-500" />
                    </button>
                </div>
                {openMenuId === item.key && (
                    <ContextMenu items={menuOptions} parent={item} />
                )}
            </div>
        );
    }
);

export const defaultvalues = (lfuncs) => {
    return {
        defItems: [
            {
                key: 1,
                name: "Item 1",
                description: "Description for item 1",
            },
            {
                key: 2,
                name: "Item 2",
                description: "Description for item 2",
            },
            {
                key: 3,
                name: "Item 3",
                description: "Description for item 3",
            },
            {
                key: 4,
                name: "Item 4",
                description: "Description for item 4",
            },
        ],
        defMenus: [
            {
                key: "view",
                onClick: (e, val) => lfuncs.onView(e, val),
                children: (
                    <div className="flex items-center gap-2">
                        <Eye className="h-5 w-5" /> View
                    </div>
                ),
                className:
                    "flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left",
            },
            {
                key: "edit",
                onClick: (e, val) => lfuncs.onEdit(e, val),
                children: (
                    <div className="flex items-center gap-2">
                        <Edit className="h-5 w-5" /> Edit
                    </div>
                ),
                className:
                    "flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left",
            },
            {
                key: "delete",
                onClick: (e, val) => lfuncs.onDelete(e, val),
                children: (
                    <div className="flex items-center gap-2">
                        <Trash className="h-5 w-5" /> Delete
                    </div>
                ),
                className:
                    "flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left",
            },
        ],
    };
};
export const ListWithContextMenu = forwardRef(
    (
        {
            CtxMenuComponent = ContextMenuComponent,
            items,
            funcs = {},
            ...props
        },
        ref
    ) => {
        const [openMenuId, setOpenMenuId] = useState(null);

        const toggleMenu = (id) => {
            setOpenMenuId(openMenuId === id ? null : id);
        };
        const onEdit = (e, val) => {
            e.stopPropagation();
            setOpenMenuId(null);
        };
        const onDelete = (e, val) => {
            e.stopPropagation();

            setOpenMenuId(null);
            setArr((eles) => eles.filter((ele) => ele.key !== val.key));
        };
        const onView = (e, val) => {
            e.stopPropagation();
            setOpenMenuId(null);
        };
        const defaultFuncs = {
            onEdit,
            onDelete,
            onView,
        };

        const lfuncs = CITTools.updateObject(defaultFuncs, funcs);
        const { defItems, defMenus } = defaultvalues(lfuncs);
        const [arr, setArr] = useState(items || defItems);
        const [st, setSt] = useState(
            CITTools.updateObject(
                {
                    menuOptions: defMenus,
                    li: { className: "p-4 hover:bg-gray-50" },
                    compProps: {},
                },
                props
            )
        );

        React.useEffect(() => {
            const handleClickOutside = () => {
                setOpenMenuId(null);
            };

            document.addEventListener("click", handleClickOutside);
            return () => {
                document.removeEventListener("click", handleClickOutside);
            };
        }, []);
        useImperativeHandle(ref, () => ({
            st,
            setSt,
            arr,
            setArr,
            openMenuId,
            setOpenMenuId,
            toggleMenu,
            onEdit,
            onDelete,
            onView,
            lfuncs,
        }));

        return (
            <ul className="divide-y divide-gray-200">
                {arr.map((item) => (
                    <li key={item.key} {...st.li}>
                        <div className="flex items-center justify-between">
                            <CtxMenuComponent
                                {...CITTools.removeKeys(item, ["key"])}
                                {...st.compProps}
                            />
                            <OpsComponent
                                item={item}
                                openMenuId={openMenuId}
                                toggleMenu={toggleMenu}
                                menuOptions={st.menuOptions}
                                moreOptions={props.moreOptions}
                            />
                        </div>
                    </li>
                ))}
            </ul>
        );
    }
);
