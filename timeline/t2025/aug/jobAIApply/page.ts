import { Brain, Calendar, Cog, List, Plus, Search, Trash } from "lucide";
import { Tools } from "../../april/tools";
import "./style.css";

export const Header = () => {
    const logo = Tools.icon(Brain, { class: "w-8 h-8" });
    const title = Tools.comp("h1", {
        class: "text-xl font-bold md:text-2xl lg:text-4xl",
        textContent: "CV Generator",
    });

    const options = [
        { icon: List, label: "Processes" },
        { icon: Cog, label: "Settings" },
    ];
    const rightOps = Tools.comp("div", {
        class: "flex items-center space-x-4",
        children: options.map((x: any) => {
            return Tools.comp("button", {
                class: "hover:text-purple-200 transition cursor-pointer flex gap-1 items-center",
                children: [
                    Tools.icon(x.icon, {
                        class: "w-6 h-6",
                    }),
                    Tools.comp("span", {
                        textContent: x.label,
                        class: "hidden md:inline",
                    }),
                ],
            });
        }),
    });
    return Tools.comp("header", {
        class: "gradient-bg text-white shadow-lg sticky top-0 z-50",
        children: [
            Tools.comp("div", {
                class: "flex py-4 w-full",
                children: [
                    Tools.comp("div", {
                        class: "flex items-center justify-between w-full px-4",
                        children: [
                            Tools.div({
                                class: "flex items-center space-x-3",
                                children: [logo, title],
                            }),
                            rightOps,
                        ],
                    }),
                ],
            }),
        ],
    });
};
export const SimpleSearchComp = () => {
    const inp = Tools.comp("input", {
        key: "inp",
        type: "text",
        placeholder: "Search jobs...",
        class: "w-full sm:w-64 pr-4 focus:outline-none focus:none ",
    });
    const icon = Tools.icon(Search, {
        key: "icon",
        class: "w-6 h-6 text-gray-400",
    });
    return Tools.comp("div", {
        class: "flex items-center gap-2 border border-gray-400 rounded-lg py-2 pl-2",
        children: [icon, inp],
    });
};
export const SearchSortTools = () => {
    const searchComp = SimpleSearchComp();

    const sortDropdown = Tools.comp("select", {
        class: "px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600",
        children: [
            Tools.comp("option", { textContent: "Newest First" }),
            Tools.comp("option", { textContent: "Oldest First" }),
            Tools.comp("option", { textContent: "Title (A-Z)" }),
            Tools.comp("option", { textContent: "Title (Z-A)" }),
        ],
    });

    const addBtn = Tools.comp("button", {
        class: "bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition hover-lift whitespace-nowrap flex items-center gap-2",
        children: [
            Tools.icon(Plus, { class: "w-6 h-6" }),
            Tools.comp("span", { textContent: "Add Job" }),
        ],
    });

    return Tools.comp(
        "div",
        {
            class: "flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4",
            children: [
                Tools.comp("h2", {
                    key: "title",
                    class: "text-xl font-bold text-gray-800 md:text-2xl lg:text-3xl",
                    textContent: "Job Listings",
                }),
                Tools.comp("div", {
                    class: "flex flex-col sm:flex-row gap-3 w-full md:w-auto",
                    children: [searchComp, sortDropdown, addBtn],
                }),
            ],
        },
        {},
        { searchComp, sortDropdown, addBtn }
    );
};
export const JobAddForm = () => {
    const titleInp = Tools.comp("input", {
        type: "text",
        required: "",
        class: "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600",
    });
    const desInp = Tools.comp("textarea", {
        required: "",
        class: "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600",
    });

    const linkInp = Tools.comp("input", {
        type: "url",
        class: "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600",
    });

    const submitBtn = Tools.comp("button", {
        type: "submit",
        class: "px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition",
        textContent: "Save Job",
    });

    const get_values = () => {
        return {
            title: (titleInp.getElement() as HTMLInputElement).value,
            description: (desInp.getElement() as HTMLTextAreaElement).value,
            link: (linkInp.getElement() as HTMLInputElement).value,
        };
    };
    const set_values = (
        title: string,
        description: string,
        link: string = ""
    ) => {
        (titleInp.getElement() as HTMLInputElement).value = title;
        (desInp.getElement() as HTMLTextAreaElement).value = description;
        (linkInp.getElement() as HTMLInputElement).value = link;
    };

    return Tools.comp(
        "form",
        {
            class: "flex flex-col w-full",
            children: [
                Tools.comp("div", {
                    class: "mb-4",
                    children: [
                        Tools.comp("label", {
                            class: "block text-gray-700 font-semibold mb-2",
                            textContent: "Job Title",
                        }),
                        titleInp,
                    ],
                }),
                Tools.comp("div", {
                    class: "mb-4",
                    children: [
                        Tools.comp("label", {
                            class: "block text-gray-700 font-semibold mb-2",
                            textContent: "Description",
                        }),
                        desInp,
                    ],
                }),
                Tools.comp("div", {
                    class: "mb-6",
                    children: [
                        Tools.comp("label", {
                            class: "block text-gray-700 font-semibold mb-2",
                            textContent: "Job Link (Optional)",
                        }),
                        linkInp,
                    ],
                }),
                Tools.comp("div", {
                    class: "flex justify-end space-x-3",
                    children: [submitBtn],
                }),
            ],
        },
        {},
        { submitBtn, get_values, set_values }
    );
};
export const ShowJobDetails = () => {
    const details = Tools.comp("div", {
        class: "mb-6",
    });

    const setJob = (job: {
        title: string;
        description: string;
        created_on: number;
        link?: string;
    }) => {
        let children = [
            Tools.comp("div", {
                children: [
                    Tools.comp("h4", {
                        class: "font-semibold text-gray-700 mb-2",
                        textContent: "Description",
                    }),
                    Tools.comp("p", {
                        class: "text-gray-600",
                        textContent: job.description,
                    }),
                ],
            }),
        ];
        if (job.link) {
            children.push(
                Tools.comp("div", {
                    children: [
                        Tools.comp("h4", {
                            class: "font-semibold text-gray-700 mb-2",
                            textContent: "Job Link",
                        }),
                        Tools.comp("a", {
                            href: job.link,
                            class: "text-purple-600 hover:underline",
                            textContent: "View Job",
                            children: [
                                Tools.comp("i", {
                                    class: "fas fa-external-link-alt mr-2",
                                }),
                            ],
                        }),
                    ],
                })
            );
        }
        children.push(
            Tools.comp("div", {
                children: [
                    Tools.comp("h4", {
                        class: "font-semibold text-gray-700 mb-2",
                        textContent: "Created",
                    }),
                    Tools.comp("p", {
                        class: "text-gray-600",
                        textContent: new Date(job.created_on).toLocaleString(),
                    }),
                ],
            })
        );
        details.update({
            innerHTML: "",
            child: Tools.comp("div", {
                class: "space-y-4",
                children,
            }),
        });
    };
    return Tools.comp(
        "div",
        {
            class: "bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto slide-in",
            children: [
                details,
                Tools.comp("div", {
                    class: "flex flex-wrap gap-3",
                    children: [
                        Tools.comp("button", {
                            class: "flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition hover-lift",
                            textContent: "Generate CV",
                        }),
                        Tools.comp("button", {
                            class: "flex-1 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition hover-lift",
                            textContent: "Generate Motivation",
                        }),
                        Tools.comp("button", {
                            class: "flex-1 bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition hover-lift",
                            textContent: "Generate Summary",
                        }),
                    ],
                }),
            ],
        },
        {},
        { setJob, details }
    );
};
export const GenerateModal = () => {
    const var_generate_title = Tools.comp("h3", {
        class: "text-2xl font-bold mb-6",
    });

    const var_depth_17 = Tools.comp("label", {
        class: "block text-gray-700 font-semibold mb-2",
        textContent: "AI Model",
    });

    const var_ai_model = Tools.comp("select", {
        class: "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600",
        children: [
            Tools.comp("option", { textContent: "GPT-4" }),
            Tools.comp("option", { textContent: "GPT-3.5" }),
            Tools.comp("option", { textContent: "Claude" }),
            Tools.comp("option", { textContent: "Gemini" }),
        ],
    });

    const var_depth_18 = Tools.comp("label", {
        class: "block text-gray-700 font-semibold mb-2",
        textContent: "Temperature",
    });

    const var_temperature = Tools.comp("input", {
        type: "range",
        class: "w-full",
    });

    const var_temp_value = Tools.comp("span", { textContent: "0.7" });

    const var_depth_19 = Tools.comp("div", {
        class: "flex justify-between text-sm text-gray-600",
        children: [
            Tools.comp("span", { textContent: "0 (Conservative)" }),
            var_temp_value,
            Tools.comp("span", { textContent: "1 (Creative)" }),
        ],
    });

    const var_depth_20 = Tools.comp("label", {
        class: "block text-gray-700 font-semibold mb-2",
        textContent: "Custom Prompt",
    });

    const var_custom_prompt = Tools.comp("textarea", {
        class: "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600",
        placeholder: "Enter your custom prompt...",
    });

    const var_depth_21 = Tools.comp("button", {
        type: "button",
        class: "px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition",
        textContent: "Cancel",
    });

    const var_depth_22 = Tools.comp("button", {
        type: "submit",
        class: "px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition",
        textContent: "Start Generation",
    });

    return Tools.comp("div", {
        class: "fixed inset-0 bg-black bg-opacity-50 hidden flex items-center justify-center z-50",
        children: [
            Tools.comp("div", {
                class: "bg-white rounded-xl p-8 max-w-lg w-full mx-4 slide-in",
                children: [
                    var_generate_title,
                    Tools.comp("form", {
                        children: [
                            Tools.comp("div", {
                                class: "mb-4",
                                children: [var_depth_17, var_ai_model],
                            }),
                            Tools.comp("div", {
                                class: "mb-4",
                                children: [
                                    var_depth_18,
                                    var_temperature,
                                    var_depth_19,
                                ],
                            }),
                            Tools.comp("div", {
                                class: "mb-6",
                                children: [var_depth_20, var_custom_prompt],
                            }),
                            Tools.comp("div", {
                                class: "flex justify-end space-x-3",
                                children: [var_depth_21, var_depth_22],
                            }),
                        ],
                    }),
                ],
            }),
        ],
    });
};
export const ShowResult = () => {
    const var_result_title = Tools.comp("h3", { class: "text-2xl font-bold" });

    const var_depth_23 = Tools.comp("i", { class: "fas fa-times text-xl" });

    const var_result_content = Tools.comp("div", { class: "prose max-w-none" });

    const var_depth_24 = Tools.comp("i", { class: "fas fa-copy mr-2" });

    const var_depth_25 = Tools.comp("i", { class: "fas fa-download mr-2" });
    return Tools.comp("div", {
        class: "fixed inset-0 bg-black bg-opacity-50 hidden flex items-center justify-center z-50",
        children: [
            Tools.comp("div", {
                class: "bg-white rounded-xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto slide-in",
                children: [
                    Tools.comp("div", {
                        class: "flex justify-between items-start mb-6",
                        children: [
                            var_result_title,
                            Tools.comp("button", {
                                class: "text-gray-500 hover:text-gray-700",
                                children: [var_depth_23],
                            }),
                        ],
                    }),
                    var_result_content,
                    Tools.comp("div", {
                        class: "mt-6 flex justify-end space-x-3",
                        children: [
                            Tools.comp("button", {
                                class: "px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition",
                                textContent: "Copy",
                                children: [var_depth_24],
                            }),
                            Tools.comp("button", {
                                class: "px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition",
                                textContent: "Download",
                                children: [var_depth_25],
                            }),
                        ],
                    }),
                ],
            }),
        ],
    });
};
export const Page = () => {
    const jobList = Tools.comp("div", {
        class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
    });
    const searchTools = SearchSortTools();
    const jobs_section = Tools.comp("section", {
        class: "fade-in",
        children: [searchTools, jobList],
    });

    return Tools.comp(
        "div",
        {
            class: "flex flex-col min-h-screen w-full",
            children: [
                Header(),
                Tools.comp("main", {
                    key: "main",
                    class: "flex flex-col flex-1 overflow-y-auto px-4 ",
                    child: jobs_section,
                }),
            ],
        },
        {},
        { jobs_section, jobList, searchTools }
    );
};
export const JobCard = (job: {
    title: string;
    description: string;
    created_on: number;
}) => {
    const deleteIcon = Tools.icon(Trash, {
        class: "w-6 h-6 text-red-500 hover:text-red-700 top-2 right-2 absolute",
    });
    return Tools.comp(
        "div",
        {
            children: [
                Tools.comp("div", {
                    class: "bg-white rounded-xl shadow-md p-6 hover-lift cursor-pointer relative",
                    children: [
                        Tools.comp("div", {
                            class: "flex justify-between items-start mb-3",
                            children: [
                                Tools.comp("h3", {
                                    class: "text-xl font-semibold text-gray-800",
                                    textContent: job.title,
                                }),
                                deleteIcon,
                            ],
                        }),
                        Tools.comp("p", {
                            class: "text-gray-600 mb-4 line-clamp-3",
                            textContent: job.description,
                        }),
                        Tools.comp("div", {
                            class: "flex items-center text-sm text-gray-500",
                            children: [
                                Tools.icon(Calendar, { class: "w-4 h-4 mr-2" }),
                                Tools.comp("span", {
                                    textContent: new Date(
                                        job.created_on
                                    ).toLocaleDateString(),
                                }),
                            ],
                        }),
                    ],
                }),
            ],
        },
        {},
        { deleteIcon }
    );
};

// const var_process_list = Tools.comp("div", { class: "space-y-4" });

// const var_processes_section = Tools.comp("section", {
//     class: "hidden fade-in",
//     children: [
//         Tools.comp("h2", {
//             class: "text-3xl font-bold text-gray-800 mb-6",
//             textContent: "Running Processes",
//         }),
//         var_process_list,
//     ],
// });

// const var_results_list = Tools.comp("div", { class: "space-y-6" });

// const var_results_section = Tools.comp("section", {
//     class: "hidden fade-in",
//     children: [
//         Tools.comp("h2", {
//             class: "text-3xl font-bold text-gray-800 mb-6",
//             textContent: "Generated Results",
//         }),
//         var_results_list,
//     ],
// });

// const var_context_menu = Tools.comp("div", { class: "context-menu" });
// const var_add_job_modal = JobAddForm();
// const var_job_details_modal = ShowJobDetails();
// const var_generate_modal = GenerateModal();
// const var_result_modal = ShowResult();
