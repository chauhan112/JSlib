import { useState } from "react";

export const HeaderShowcase = () => {
    const [activeHeader, setActiveHeader] = useState(0);

    const headers = [
        // Header 1: Minimal Modern
        <header className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Logo</h1>
                <nav className="space-x-8">
                    <a href="#" className="text-gray-600 hover:text-gray-900">
                        Home
                    </a>
                    <a href="#" className="text-gray-600 hover:text-gray-900">
                        About
                    </a>
                    <a href="#" className="text-gray-600 hover:text-gray-900">
                        Contact
                    </a>
                </nav>
            </div>
        </header>,

        // Header 2: Gradient Hero
        <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
                <h1 className="text-3xl font-extrabold">Brand</h1>
                <nav className="space-x-6">
                    <a href="#" className="hover:text-purple-200">
                        Features
                    </a>
                    <a href="#" className="hover:text-purple-200">
                        Pricing
                    </a>
                    <a
                        href="#"
                        className="bg-white text-purple-600 px-4 py-2 rounded-full hover:bg-purple-100"
                    >
                        Sign Up
                    </a>
                </nav>
            </div>
        </header>,

        // Header 3: Transparent Overlay
        <header className="absolute w-full bg-black bg-opacity-50 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Company</h1>
                <nav className="space-x-6">
                    <a href="#" className="hover:text-gray-300">
                        Portfolio
                    </a>
                    <a href="#" className="hover:text-gray-300">
                        Services
                    </a>
                    <a
                        href="#"
                        className="border border-white px-4 py-1 rounded hover:bg-white hover:text-black"
                    >
                        Contact
                    </a>
                </nav>
            </div>
        </header>,

        // Header 4: Bold Corporate
        <header className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">CorpX</h1>
                <nav className="flex space-x-8 items-center">
                    <a href="#" className="hover:text-gray-300">
                        Solutions
                    </a>
                    <a href="#" className="hover:text-gray-300">
                        Industries
                    </a>
                    <a
                        href="#"
                        className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Get Started
                    </a>
                </nav>
            </div>
        </header>,

        // Header 5: Creative Agency
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
        </header>,

        // Header 6: Tech Startup
        <header className="bg-gray-800 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex justify-between items-center">
                <h1 className="text-2xl font-bold">TechBit</h1>
                <nav className="space-x-6">
                    <a href="#" className="hover:text-blue-400">
                        Product
                    </a>
                    <a href="#" className="hover:text-blue-400">
                        Docs
                    </a>
                    <a
                        href="#"
                        className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Login
                    </a>
                </nav>
            </div>
        </header>,

        // Header 7: Luxury Brand
        <header className="bg-black text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
                <h1 className="text-2xl font-serif font-bold">Luxe</h1>
                <nav className="space-x-8">
                    <a href="#" className="hover:text-gray-300">
                        Collection
                    </a>
                    <a href="#" className="hover:text-gray-300">
                        Store
                    </a>
                    <a
                        href="#"
                        className="border border-white px-4 py-1 hover:bg-white hover:text-black"
                    >
                        Shop Now
                    </a>
                </nav>
            </div>
        </header>,

        // Header 8: Eco Friendly
        <header className="bg-green-600 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex justify-between items-center">
                <h1 className="text-2xl font-bold">EcoLife</h1>
                <nav className="space-x-6">
                    <a href="#" className="hover:text-green-200">
                        Mission
                    </a>
                    <a href="#" className="hover:text-green-200">
                        Products
                    </a>
                    <a
                        href="#"
                        className="bg-white text-green-600 px-4 py-2 rounded hover:bg-green-100"
                    >
                        Join Us
                    </a>
                </nav>
            </div>
        </header>,

        // Header 9: Fitness Brand
        <header className="bg-red-600 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex justify-between items-center">
                <h1 className="text-3xl font-extrabold">FitPro</h1>
                <nav className="space-x-6">
                    <a href="#" className="hover:text-red-200">
                        Workouts
                    </a>
                    <a href="#" className="hover:text-red-200">
                        Plans
                    </a>
                    <a
                        href="#"
                        className="bg-white text-red-600 px-4 py-2 rounded-full hover:bg-red-100"
                    >
                        Start Now
                    </a>
                </nav>
            </div>
        </header>,

        // Header 10: Gaming Theme
        <header className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-purple-400">GameOn</h1>
                <nav className="space-x-6">
                    <a href="#" className="hover:text-purple-400">
                        Games
                    </a>
                    <a href="#" className="hover:text-purple-400">
                        Community
                    </a>
                    <a
                        href="#"
                        className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700"
                    >
                        Play Now
                    </a>
                </nav>
            </div>
        </header>,
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Tab Navigation */}
            <div className="flex justify-center space-x-2 p-4 bg-white shadow">
                {headers.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveHeader(index)}
                        className={`px-4 py-2 rounded-lg ${
                            activeHeader === index
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                    >
                        Header {index + 1}
                    </button>
                ))}
            </div>

            {/* Header Display */}
            <div className="mt-4 sticky top-0 z-10">
                {headers[activeHeader]}
            </div>
        </div>
    );
};

export const DialogShowcase = () => {
    const [activeDialog, setActiveDialog] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    const dialogs = [
        // Dialog 1: Simple Clean
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-96">
                <h2 className="text-xl font-bold mb-4">Are you sure?</h2>
                <p className="text-gray-600 mb-6">
                    This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-4">
                    <button
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        onClick={() => setIsOpen(false)}
                    >
                        Cancel
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        Confirm
                    </button>
                </div>
            </div>
        </div>,

        // Dialog 2: Warning Style
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-96 border-l-4 border-yellow-500">
                <h2 className="text-xl font-bold text-yellow-700 mb-4">
                    Warning
                </h2>
                <p className="text-gray-600 mb-6">Proceed with caution!</p>
                <div className="flex justify-end space-x-4">
                    <button
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                        onClick={() => setIsOpen(false)}
                    >
                        No
                    </button>
                    <button className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                        Yes
                    </button>
                </div>
            </div>
        </div>,

        // Dialog 3: Minimal Modern
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-gray-900 text-white rounded-xl p-6 w-80">
                <h2 className="text-lg font-semibold mb-4">Confirm Action</h2>
                <div className="flex justify-between">
                    <button
                        className="px-6 py-2 hover:text-gray-300"
                        onClick={() => setIsOpen(false)}
                    >
                        Cancel
                    </button>
                    <button className="px-6 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-200">
                        OK
                    </button>
                </div>
            </div>
        </div>,

        // Dialog 4: Error Theme
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-red-50 rounded-lg p-6 w-96 border border-red-200">
                <h2 className="text-xl font-bold text-red-700 mb-4">
                    Delete Item?
                </h2>
                <p className="text-red-600 mb-6">
                    This will permanently remove the item.
                </p>
                <div className="flex justify-end space-x-4">
                    <button
                        className="px-4 py-2 text-red-600 hover:text-red-800"
                        onClick={() => setIsOpen(false)}
                    >
                        Cancel
                    </button>
                    <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                        Delete
                    </button>
                </div>
            </div>
        </div>,

        // Dialog 5: Success Theme
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-green-50 rounded-lg p-6 w-96">
                <h2 className="text-xl font-bold text-green-700 mb-4">
                    Ready to Save?
                </h2>
                <p className="text-green-600 mb-6">
                    Your changes will be saved.
                </p>
                <div className="flex justify-center space-x-4">
                    <button
                        className="px-6 py-2 bg-green-200 text-green-800 rounded hover:bg-green-300"
                        onClick={() => setIsOpen(false)}
                    >
                        No
                    </button>
                    <button className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                        Yes
                    </button>
                </div>
            </div>
        </div>,

        // Dialog 6: Gradient Style
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-lg p-6 w-96">
                <h2 className="text-xl font-bold mb-4">Confirm Changes</h2>
                <p className="mb-6">Apply these changes now?</p>
                <div className="flex justify-end space-x-4">
                    <button
                        className="px-4 py-2 hover:text-gray-200"
                        onClick={() => setIsOpen(false)}
                    >
                        Cancel
                    </button>
                    <button className="px-4 py-2 bg-white text-purple-600 rounded hover:bg-gray-100">
                        Apply
                    </button>
                </div>
            </div>
        </div>,

        // Dialog 7: Compact Design
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-4 w-72 shadow-xl">
                <h2 className="text-lg font-semibold mb-2">Confirm?</h2>
                <div className="flex justify-between">
                    <button
                        className="px-4 py-1 text-gray-600 hover:text-gray-800"
                        onClick={() => setIsOpen(false)}
                    >
                        No
                    </button>
                    <button className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Yes
                    </button>
                </div>
            </div>
        </div>,

        // Dialog 8: Elegant Style
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-gray-800 text-white rounded-lg p-6 w-96 border border-gray-700">
                <h2 className="text-xl font-serif font-bold mb-4">Proceed?</h2>
                <p className="text-gray-300 mb-6">Please confirm your action</p>
                <div className="flex justify-end space-x-4">
                    <button
                        className="px-4 py-2 border border-gray-600 rounded hover:bg-gray-700"
                        onClick={() => setIsOpen(false)}
                    >
                        Decline
                    </button>
                    <button className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500">
                        Accept
                    </button>
                </div>
            </div>
        </div>,

        // Dialog 9: Playful Design
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-6 w-96 border-4 border-pink-400">
                <h2 className="text-xl font-bold text-pink-600 mb-4">
                    You Sure?
                </h2>
                <p className="text-gray-600 mb-6">This is gonna be fun!</p>
                <div className="flex justify-center space-x-4">
                    <button
                        className="px-6 py-2 bg-gray-200 rounded-full hover:bg-gray-300"
                        onClick={() => setIsOpen(false)}
                    >
                        Nope
                    </button>
                    <button className="px-6 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600">
                        Yup!
                    </button>
                </div>
            </div>
        </div>,

        // Dialog 10: Futuristic Theme
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-gray-900 text-white rounded-lg p-6 w-96 border border-blue-500">
                <h2 className="text-xl font-bold text-blue-400 mb-4">
                    Execute Command?
                </h2>
                <p className="text-gray-300 mb-6">Confirm system operation</p>
                <div className="flex justify-end space-x-4">
                    <button
                        className="px-4 py-2 text-blue-400 hover:text-blue-300"
                        onClick={() => setIsOpen(false)}
                    >
                        Abort
                    </button>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Execute
                    </button>
                </div>
            </div>
        </div>,
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Tab Navigation */}
            <div className="flex justify-center space-x-2 p-4 bg-white shadow sticky top-0 z-20">
                {dialogs.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveDialog(index)}
                        className={`px-4 py-2 rounded-lg ${
                            activeDialog === index
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                    >
                        Dialog {index + 1}
                    </button>
                ))}
            </div>

            {/* Dialog Preview */}
            <div className="flex justify-center mt-8">
                <button
                    onClick={() => setIsOpen(true)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Show Dialog {activeDialog + 1}
                </button>
            </div>

            {/* Dialog Display */}
            {isOpen && <div className="z-10">{dialogs[activeDialog]}</div>}
        </div>
    );
};
