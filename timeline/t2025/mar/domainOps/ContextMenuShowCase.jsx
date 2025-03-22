import React, { useState, useEffect, useRef } from "react";
import { MoreVertical } from "lucide-react";

// Base Component (Variation 1 - Minimalist)
const ListWithContextMenu1 = ({ items }) => {
    const [activeMenu, setActiveMenu] = useState(null);
    const menuRef = useRef(null);

    const toggleMenu = (e, index) => {
        e.stopPropagation();
        setActiveMenu(activeMenu === index ? null : index);
    };

    const handleAction = (e, action, item) => {
        e.stopPropagation();
        console.log(`${action}: ${item}`);
        setActiveMenu(null);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setActiveMenu(null);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    return (
        <ul className="bg-white rounded-lg shadow-lg divide-y divide-gray-200 border border-gray-100">
            {items.map((item, index) => (
                <li
                    key={index}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                    <span className="text-gray-800 font-medium">{item}</span>
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={(e) => toggleMenu(e, index)}
                            className="p-1 text-gray-500 hover:text-gray-800"
                        >
                            <MoreVertical className="h-5 w-5" />
                        </button>
                        {activeMenu === index && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl border border-gray-100">
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
                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                </li>
            ))}
        </ul>
    );
};

// Variation 2 - Gradient Card
const ListWithContextMenu2 = ({ items }) => {
    const [activeMenu, setActiveMenu] = useState(null);
    const menuRef = useRef(null);

    const toggleMenu = (e, index) => {
        e.stopPropagation();
        setActiveMenu(activeMenu === index ? null : index);
    };

    const handleAction = (e, action, item) => {
        e.stopPropagation();
        console.log(`${action}: ${item}`);
        setActiveMenu(null);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setActiveMenu(null);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    return (
        <ul className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl shadow-md divide-y divide-purple-200/50">
            {items.map((item, index) => (
                <li
                    key={index}
                    className="flex items-center justify-between p-4 hover:bg-white/30 transition-all duration-200"
                >
                    <span className="text-indigo-900 font-semibold">
                        {item}
                    </span>
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={(e) => toggleMenu(e, index)}
                            className="p-1 text-indigo-600 hover:text-indigo-800 transition-colors"
                        >
                            <MoreVertical className="h-5 w-5" />
                        </button>
                        {activeMenu === index && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-2xl border border-purple-100">
                                <button
                                    onClick={(e) =>
                                        handleAction(e, "open", item)
                                    }
                                    className="block w-full text-left px-4 py-2 text-sm text-indigo-700 hover:bg-indigo-50"
                                >
                                    Open
                                </button>
                                <button
                                    onClick={(e) =>
                                        handleAction(e, "edit", item)
                                    }
                                    className="block w-full text-left px-4 py-2 text-sm text-indigo-700 hover:bg-indigo-50"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={(e) =>
                                        handleAction(e, "delete", item)
                                    }
                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                </li>
            ))}
        </ul>
    );
};

// Variation 3 - Retro Style
const ListWithContextMenu3 = ({ items }) => {
    const [activeMenu, setActiveMenu] = useState(null);
    const menuRef = useRef(null);

    const toggleMenu = (e, index) => {
        e.stopPropagation();
        setActiveMenu(activeMenu === index ? null : index);
    };

    const handleAction = (e, action, item) => {
        e.stopPropagation();
        console.log(`${action}: ${item}`);
        setActiveMenu(null);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setActiveMenu(null);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    return (
        <ul className="bg-yellow-50 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black">
            {items.map((item, index) => (
                <li
                    key={index}
                    className="flex items-center justify-between p-4 border-b-2 border-black last:border-b-0 hover:bg-yellow-100"
                >
                    <span className="text-black font-mono">{item}</span>
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={(e) => toggleMenu(e, index)}
                            className="p-1 text-black hover:text-gray-700"
                        >
                            <MoreVertical className="h-5 w-5" />
                        </button>
                        {activeMenu === index && (
                            <div className="absolute right-0 mt-2 w-48 bg-yellow-50 rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border-2 border-black">
                                <button
                                    onClick={(e) =>
                                        handleAction(e, "open", item)
                                    }
                                    className="block w-full text-left px-4 py-2 text-sm text-black hover:bg-yellow-200"
                                >
                                    Open
                                </button>
                                <button
                                    onClick={(e) =>
                                        handleAction(e, "edit", item)
                                    }
                                    className="block w-full text-left px-4 py-2 text-sm text-black hover:bg-yellow-200"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={(e) =>
                                        handleAction(e, "delete", item)
                                    }
                                    className="block w-full text-left px-4 py-2 text-sm text-red-800 hover:bg-red-200"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                </li>
            ))}
        </ul>
    );
};

// Variation 4 - Neumorphic
const ListWithContextMenu4 = ({ items }) => {
    const [activeMenu, setActiveMenu] = useState(null);
    const menuRef = useRef(null);

    const toggleMenu = (e, index) => {
        e.stopPropagation();
        setActiveMenu(activeMenu === index ? null : index);
    };

    const handleAction = (e, action, item) => {
        e.stopPropagation();
        console.log(`${action}: ${item}`);
        setActiveMenu(null);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setActiveMenu(null);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    return (
        <ul className="bg-gray-100 rounded-xl shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.7)]">
            {items.map((item, index) => (
                <li
                    key={index}
                    className="flex items-center justify-between p-4 hover:bg-gray-200/50 transition-colors"
                >
                    <span className="text-gray-800 font-medium">{item}</span>
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={(e) => toggleMenu(e, index)}
                            className="p-1 text-gray-600 hover:text-gray-800"
                        >
                            <MoreVertical className="h-5 w-5" />
                        </button>
                        {activeMenu === index && (
                            <div className="absolute right-0 mt-2 w-48 bg-gray-100 rounded-lg shadow-[4px_4px_8px_rgba(0,0,0,0.1),-4px_-4px_8px_rgba(255,255,255,0.7)]">
                                <button
                                    onClick={(e) =>
                                        handleAction(e, "open", item)
                                    }
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                                >
                                    Open
                                </button>
                                <button
                                    onClick={(e) =>
                                        handleAction(e, "edit", item)
                                    }
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={(e) =>
                                        handleAction(e, "delete", item)
                                    }
                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-200"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                </li>
            ))}
        </ul>
    );
};

// Variation 5 - Glassmorphism
const ListWithContextMenu5 = ({ items }) => {
    const [activeMenu, setActiveMenu] = useState(null);
    const menuRef = useRef(null);

    const toggleMenu = (e, index) => {
        e.stopPropagation();
        setActiveMenu(activeMenu === index ? null : index);
    };

    const handleAction = (e, action, item) => {
        e.stopPropagation();
        console.log(`${action}: ${item}`);
        setActiveMenu(null);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setActiveMenu(null);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    return (
        <ul className="bg-white/20 backdrop-blur-md rounded-xl border border-white/30 shadow-lg">
            {items.map((item, index) => (
                <li
                    key={index}
                    className="flex items-center justify-between p-4 hover:bg-white/10 transition-colors"
                >
                    <span className="text-white font-medium drop-shadow">
                        {item}
                    </span>
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={(e) => toggleMenu(e, index)}
                            className="p-1 text-white hover:text-gray-200"
                        >
                            <MoreVertical className="h-5 w-5" />
                        </button>
                        {activeMenu === index && (
                            <div className="absolute right-0 mt-2 w-48 bg-white/20 backdrop-blur-md rounded-lg border border-white/30 shadow-xl">
                                <button
                                    onClick={(e) =>
                                        handleAction(e, "open", item)
                                    }
                                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10"
                                >
                                    Open
                                </button>
                                <button
                                    onClick={(e) =>
                                        handleAction(e, "edit", item)
                                    }
                                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={(e) =>
                                        handleAction(e, "delete", item)
                                    }
                                    className="block w-full text-left px-4 py-2 text-sm text-red-300 hover:bg-red-500/20"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                </li>
            ))}
        </ul>
    );
};

// Showcase Component
export const ContextMenuShowcase = () => {
    const sampleItems = ["Item 1", "Item 2", "Item 3", "Item 4"];

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-3xl font-bold text-center mb-12 text-gray-800">
                Artistic List Components
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-gray-700">
                        1. Minimalist
                    </h2>
                    <ListWithContextMenu1 items={sampleItems} />
                </div>

                <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-gray-700">
                        2. Gradient Card
                    </h2>
                    <ListWithContextMenu2 items={sampleItems} />
                </div>

                <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-gray-700">
                        3. Retro Style
                    </h2>
                    <ListWithContextMenu3 items={sampleItems} />
                </div>

                <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-gray-700">
                        4. Neumorphic
                    </h2>
                    <ListWithContextMenu4 items={sampleItems} />
                </div>

                <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-gray-700">
                        5. Glassmorphism
                    </h2>
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-xl">
                        <ListWithContextMenu5 items={sampleItems} />
                    </div>
                </div>
            </div>
        </div>
    );
};
