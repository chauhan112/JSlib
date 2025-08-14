import { Atool } from "../../april/Array";
import { Tools } from "../../april/tools";
import { Header } from "./page";
import { getCVCreatePrompt, getMotivationCreatePrompt } from "./prompts";
import { LocalStorageJSONModel } from "../../april/LocalStorage";
import { GlobalStates } from "../../june/domain-ops/GlobalStates";
export const Label = (text: string, args: any) => {
    return Tools.comp("label", {
        textContent: text,
        class: "block text-sm font-medium text-gray-700 mb-2",
        ...args,
    });
};
export const TextareaInput = (args: any) => {
    return Tools.comp("textarea", {
        class: "w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
        ...args,
    });
};
export const FormTextareaInput = (key: string) => {
    const label = Label("label", { for: key });
    const inp = TextareaInput({ id: key });
    return Tools.comp(
        "div",
        {
            class: "mb-6",
            children: [label, inp],
        },
        {},
        { label, inp }
    );
};
export const FormSelectComp = (
    key: string,
    options: { value: string; label: string }[]
) => {
    const label = Label("label", { for: key });
    const inp = Tools.comp("select", {
        class: "w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
        id: key,
        children: options.map((o: any) =>
            Tools.comp("option", { value: o.value, textContent: o.label })
        ),
    });
    return Tools.comp(
        "div",
        {
            class: "mb-6",
            children: [label, inp],
        },
        {},
        { label, inp }
    );
};

export const FormSelectCompCtrl = (key: string) => {
    let comp = FormSelectComp(key, []);
    const setLabel = (label: string) => {
        comp.s.label.update({ textContent: label });
    };
    const getValue = () => {
        return (comp.s.inp.getElement() as HTMLSelectElement).value;
    };
    const setValue = (value: string) => {
        (comp.s.inp.getElement() as HTMLSelectElement).value = value;
    };

    const setOptions = (options: { value: string; label: string }[]) => {
        comp.s.inp.update({
            innerHTML: "",
            children: options.map((o: any) => {
                return Tools.comp("option", {
                    value: o.value,
                    textContent: o.label,
                });
            }),
        });
    };
    return {
        comp,
        setLabel,
        getValue,
        setValue,
        setOptions,
    };
};

export const Spinner = () => {
    return Tools.comp("div", {
        class: "w-8 h-8 border-8 border-gray-200 border-t-blue-500 rounded-full animate-spin",
    });
};

export const FormTextareaCtrl = (
    key: string,
    label: string,
    placeholder: string
) => {
    let comp = FormTextareaInput(key);
    const setLabel = (label: string) => {
        comp.s.label.update({ textContent: label });
    };
    const getValue = () => {
        return (comp.s.inp.getElement() as HTMLTextAreaElement).value;
    };
    const setValue = (value: string) => {
        (comp.s.inp.getElement() as HTMLTextAreaElement).value = value;
    };
    setLabel(label);
    comp.s.inp.update({ placeholder });
    return {
        comp,
        setLabel,
        getValue,
        setValue,
    };
};

export const Page = () => {
    const output = Tools.comp("textarea", {
        placeholder: "content goes here",
        class: "h-128 w-full border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
        disabled: true,
    });

    const personalDetails = FormTextareaCtrl(
        "personalDetails",
        "Personal Details (Education, Experience, Skills,\n                            etc.)",
        "Enter your personal details including education, work experience, skills, achievements, etc."
    );
    const jobDetails = FormTextareaCtrl(
        "jobDetails",
        "Job Details (Description, Requirements, etc.)",
        "Enter the job description, requirements, and any other relevant details about the position"
    );
    const modelSelect = FormSelectCompCtrl("modelSelect");
    modelSelect.setLabel("Select Ollama Model");

    const cvBtn = Tools.comp("button", {
        class: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors",
        textContent: "CV",
    });

    const motBtn = Tools.comp("button", {
        class: "px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors",
        textContent: "Motivation",
    });
    const header = Header();
    header.s.rightOps.getElement().classList.add("hidden");

    return Tools.comp(
        "div",
        {
            children: [
                header,
                Tools.comp("div", {
                    class: "bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto mt-8",
                    children: [
                        personalDetails.comp,
                        jobDetails.comp,
                        modelSelect.comp,
                        Tools.comp("div", {
                            class: "flex flex-wrap gap-4",
                            children: [cvBtn, motBtn],
                        }),
                    ],
                }),
            ],
        },
        {},
        {
            personalDetails,
            jobDetails,
            modelSelect,
            cvBtn,
            motBtn,
            output,
            header,
        }
    );
};
const OLLAMA_BASE_URL = "http://localhost:8000/ollama";
export const PageCtrl = () => {
    let comp = Page();
    const model = new LocalStorageJSONModel("jobAIApplyModel");
    const runningProcesses = {};
    async function callOllamaAPI(prompt: string, model: string) {
        const response = await fetch(OLLAMA_BASE_URL + "/api/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: model,
                prompt: prompt,
                stream: false,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data.response;
    }
    const readableSize = (size: number) => {
        if (size == 0) return "0B";
        const size_name = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
        const i = Math.floor(Math.log(size) / Math.log(1000));
        const p = Math.pow(1024, i);
        const s = Math.round(size / p) / 100;
        return `${s} ${size_name[i]}`;
    };

    const gbCalc = (size: number) => {
        return `${Math.round(size / 1e9)} GB`;
    };
    const getModelList = async () => {
        let response = await fetch(OLLAMA_BASE_URL + "/api/tags");
        let data = await response.json();
        console.log(data);
        comp.s.modelSelect.setOptions(
            Atool.sortedBasedOnKey(data.models, (a: any) => a.size).map(
                (ele: any) => ({
                    value: ele.model,
                    label: ele.name + " (" + gbCalc(ele.size) + ")",
                })
            )
        );
    };

    const getPromptDigest = async (prompt: string) => {
        return await digestCalc(prompt);
    };

    const onGenericCall = async (title: string, promptFunc: any) => {
        let personalDetails = comp.s.personalDetails.getValue();
        let jobDetails = comp.s.jobDetails.getValue();
        let llm = comp.s.modelSelect.getValue();
        let prompt = promptFunc(personalDetails, jobDetails);
        let digestValue = await getPromptDigest(prompt + llm);
        let data;
        if (model.exists([digestValue])) {
            data = model.readEntry([digestValue]);
        } else {
            data = await callOllamaAPI(prompt, llm);
            model.addEntry([digestValue], data);
            model.updateEntry(["personalDetails"], personalDetails);
            model.updateEntry(["jobDetails"], jobDetails);
            model.updateEntry(["llm"], llm);
        }

        let modal = GlobalStates.getInstance().getState("modal");
        modal.s.handlers.display(comp.s.output);
        modal.s.handlers.show();
        (comp.s.output.getElement() as HTMLTextAreaElement).value = data;
        modal.s.modalTitle.update({ textContent: title });
    };

    const onCVClicked = async (e: any) => {
        runFuncAndDisable(
            comp.s.cvBtn,
            onGenericCall,
            ["CV Output", getCVCreatePrompt],
            "CV"
        );
    };
    const runFuncAndDisable = async (
        btn: any,
        func: any,
        params: any[],
        prevText: string
    ) => {
        btn.getElement().disabled = true;
        btn.update({ innerHTML: "", child: Spinner() });
        await func(...params);
        btn.update({ innerHTML: "", textContent: prevText });
        btn.getElement().disabled = false;
    };
    const onMotivationClicked = async (e: any) => {
        runFuncAndDisable(
            comp.s.motBtn,
            onGenericCall,
            ["Motivation Output", getMotivationCreatePrompt],
            "Motivation"
        );
    };

    const digestCalc = async (message: string) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(message);
        const hash = await window.crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hash));
        const hashHex = hashArray
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
        return hashHex;
    };
    const fill = (key: string, ctrl: any) => {
        if (model.exists([key])) {
            ctrl.setValue(model.readEntry([key]));
        }
    };
    const setup = () => {
        getModelList().then(() => {
            comp.s.cvBtn.update({}, { click: onCVClicked });
            comp.s.motBtn.update({}, { click: onMotivationClicked });

            fill("personalDetails", comp.s.personalDetails);
            fill("jobDetails", comp.s.jobDetails);
            fill("llm", comp.s.modelSelect);
        });
    };
    setup();
    return {
        comp,
        model,
        readableSize,
        gbCalc,
        getModelList,
        setup,
        digestCalc,
        getPromptDigest,
        onGenericCall,
        onCVClicked,
        onMotivationClicked,
    };
};
