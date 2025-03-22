import React, { useState, useEffect, useRef } from "react";
import { MoreVertical, Edit, Trash, Eye } from "lucide-react";

export const ListWithContextMenu = () => {
    // Sample data array - replace with your actual data
    const [items, setItems] = useState([
        { id: 1, name: "Item 1", description: "Description for item 1" },
        { id: 2, name: "Item 2", description: "Description for item 2" },
        { id: 3, name: "Item 3", description: "Description for item 3" },
        { id: 4, name: "Item 4", description: "Description for item 4" },
    ]);

    // To track which context menu is currently open
    const [openMenuId, setOpenMenuId] = useState(null);

    // Handler for toggling context menu
    const toggleMenu = (id) => {
        setOpenMenuId(openMenuId === id ? null : id);
    };

    // Handle menu actions
    const handleEdit = (item) => {
        console.log("Edit item:", item);
        setOpenMenuId(null);
        // Add your edit logic here
    };

    const handleDelete = (itemId) => {
        setItems(items.filter((item) => item.id !== itemId));
        setOpenMenuId(null);
        // Add additional delete logic if needed
    };

    const handleView = (item) => {
        console.log("View item:", item);
        setOpenMenuId(null);
        // Add your view logic here
    };

    // Close menu when clicking outside
    React.useEffect(() => {
        const handleClickOutside = () => {
            setOpenMenuId(null);
        };

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    return (
        <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow">
            <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-700">
                    Items List
                </h2>
            </div>
            <ul className="divide-y divide-gray-200">
                {items.map((item) => (
                    <li key={item.id} className="p-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-gray-800">
                                    {item.name}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {item.description}
                                </p>
                            </div>
                            <div className="relative">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleMenu(item.id);
                                    }}
                                    className="p-1 rounded-full hover:bg-gray-200 focus:outline-none"
                                >
                                    <MoreVertical className="h-5 w-5 text-gray-500" />
                                </button>

                                {openMenuId === item.id && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                                        <div className="py-1">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleView(item);
                                                }}
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                            >
                                                <Eye className="mr-2 h-4 w-4" />
                                                View
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEdit(item);
                                                }}
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                            >
                                                <Edit className="mr-2 h-4 w-4" />
                                                Edit
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(item.id);
                                                }}
                                                className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                                            >
                                                <Trash className="mr-2 h-4 w-4" />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export const ListWithContextMenu2 = ({ items }) => {
    const [activeMenu, setActiveMenu] = useState(null);
    const menuRef = useRef(null);

    // Toggle context menu for specific item
    const toggleMenu = (e, index) => {
        e.stopPropagation(); // Prevent event from bubbling up
        setActiveMenu(activeMenu === index ? null : index);
    };

    // Handle actions
    const handleAction = (e, action, item) => {
        e.stopPropagation(); // Prevent event from bubbling up
        switch (action) {
            case "edit":
                console.log("Edit:", item);
                break;
            case "delete":
                console.log("Delete:", item);
                break;
            case "open":
                console.log("Open:", item);
                break;
            default:
                break;
        }
        setActiveMenu(null);
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            setActiveMenu(null);
        };

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    return (
        <div className="w-full max-w-md mx-auto">
            <ul className="bg-white shadow-md rounded-lg divide-y divide-gray-200">
                {items.map((item, index) => (
                    <li
                        key={index}
                        className="flex items-center justify-between p-4 hover:bg-gray-50"
                    >
                        <span className="text-gray-800">{item}</span>
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={(e) => toggleMenu(e, index)}
                                className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                                <MoreVertical className="h-5 w-5" />
                            </button>

                            {/* Context Menu */}
                            {activeMenu === index && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                                    <div className="py-1">
                                        <button
                                            onClick={(e) =>
                                                handleAction(e, "open", item)
                                            }
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Open
                                        </button>
                                        <button
                                            onClick={(e) =>
                                                handleAction(e, "edit", item)
                                            }
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={(e) =>
                                                handleAction(e, "delete", item)
                                            }
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};
