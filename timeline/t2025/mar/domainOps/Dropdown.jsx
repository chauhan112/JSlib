import { useState } from "react";

export const Dropdown = ({ label, options, id }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState("");

    const toggleDropdown = () => setIsOpen(!isOpen);
    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setIsOpen(false);
    };

    return (
        <div className="relative w-64 mb-4">
            <label
                htmlFor={id}
                className="block text-sm font-medium text-gray-700 mb-1"
            >
                {label}
            </label>
            <div className="relative">
                <button
                    type="button"
                    onClick={toggleDropdown}
                    className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    {selectedOption || "Select an option"}
                    <span className="absolute right-2 top-1/2 -translate-y-1/2">
                        <svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </span>
                </button>

                {isOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                        {options.map((option, index) => (
                            <div
                                key={index}
                                onClick={() => handleOptionClick(option)}
                                className="px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 cursor-pointer"
                            >
                                {option}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const customStyles = `
  .neon-glow {
    box-shadow: 0 0 10px rgba(236, 72, 153, 0.7), 0 0 20px rgba(236, 72, 153, 0.5);
  }
  .watercolor-edge {
    border: 1px solid rgba(0, 0, 0, 0.1);
    position: relative;
  }
  .metallic-shine {
    background: linear-gradient(45deg, #4b5563, #9ca3af, #4b5563);
    background-size: 200% 200%;
    animation: shine 3s infinite;
  }
  .sketch-text {
    font-family: 'Comic Sans MS', cursive;
  }
  .shadow-sketch {
    box-shadow: 5px 5px 0px rgba(0, 0, 0, 0.1);
  }
  .crystal-effect {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.4));
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  }
  .shadow-crystal {
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  }
  @keyframes shine {
    0% { background-position: 0% 0%; }
    50% { background-position: 100% 100%; }
    100% { background-position: 0% 0%; }
  }
`;
// Style 1: Neon Glow Dropdown
const NeonDropdown = ({ options }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState("");

    return (
        <div className="relative w-64 mb-8">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-2 text-white bg-gray-900 rounded-lg border-2 border-pink-500 neon-glow"
            >
                {selected || "Neon Glow"}
            </button>
            {isOpen && (
                <div className="absolute w-full mt-2 bg-gray-900 rounded-lg shadow-lg shadow-pink-500/50">
                    {options.map((option, i) => (
                        <div
                            key={i}
                            onClick={() => {
                                setSelected(option);
                                setIsOpen(false);
                            }}
                            className="px-4 py-2 text-white hover:bg-pink-600 transition-all duration-200"
                        >
                            {option}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// Style 2: Watercolor Dropdown
const WatercolorDropdown = ({ options }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState("");

    return (
        <div className="relative w-64 mb-8">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-2 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 rounded-full text-gray-800 watercolor-edge"
            >
                {selected || "Watercolor"}
            </button>
            {isOpen && (
                <div className="absolute w-full mt-2 bg-white rounded-lg shadow-md overflow-hidden">
                    {options.map((option, i) => (
                        <div
                            key={i}
                            onClick={() => {
                                setSelected(option);
                                setIsOpen(false);
                            }}
                            className="px-4 py-2 hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100"
                        >
                            {option}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// Style 3: Metallic Dropdown
const MetallicDropdown = ({ options }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState("");

    return (
        <div className="relative w-64 mb-8">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-2 bg-gradient-to-b from-gray-600 to-gray-800 text-white rounded-md metallic-shine"
            >
                {selected || "Metallic"}
            </button>
            {isOpen && (
                <div className="absolute w-full mt-2 bg-gray-700 rounded-md shadow-lg">
                    {options.map((option, i) => (
                        <div
                            key={i}
                            onClick={() => {
                                setSelected(option);
                                setIsOpen(false);
                            }}
                            className="px-4 py-2 text-white hover:bg-gray-600 transition-colors"
                        >
                            {option}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// Style 4: Sketchbook Dropdown
const SketchbookDropdown = ({ options }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState("");

    return (
        <div className="relative w-64 mb-8">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-2 bg-white border-2 border-gray-800 border-dashed rounded-lg sketch-text"
            >
                {selected || "Sketchbook"}
            </button>
            {isOpen && (
                <div className="absolute w-full mt-2 bg-white border-2 border-gray-800 border-dashed rounded-lg shadow-sketch">
                    {options.map((option, i) => (
                        <div
                            key={i}
                            onClick={() => {
                                setSelected(option);
                                setIsOpen(false);
                            }}
                            className="px-4 py-2 hover:bg-gray-100 sketch-text"
                        >
                            {option}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// Style 5: Crystal Dropdown
const CrystalDropdown = ({ options }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState("");

    return (
        <div className="relative w-64 mb-8">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-2 bg-white/80 backdrop-blur-md border border-white/50 rounded-xl crystal-effect"
            >
                {selected || "Crystal"}
            </button>
            {isOpen && (
                <div className="absolute w-full mt-2 bg-white/80 backdrop-blur-md border border-white/50 rounded-xl shadow-crystal">
                    {options.map((option, i) => (
                        <div
                            key={i}
                            onClick={() => {
                                setSelected(option);
                                setIsOpen(false);
                            }}
                            className="px-4 py-2 hover:bg-white/50 transition-all"
                        >
                            {option}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export const DropdownShowCase = () => {
    const options = ["Choice A", "Choice B", "Choice C", "Choice D"];
    return (
        <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-center">
                Artistic Dropdowns
            </h1>
            <div className="flex items-center">
                <NeonDropdown options={options} />
                <WatercolorDropdown options={options} />
                <MetallicDropdown options={options} />
                <SketchbookDropdown options={options} />
                <CrystalDropdown options={options} />
            </div>
        </div>
    );
};
