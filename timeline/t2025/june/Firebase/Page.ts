import { Settings } from "lucide";
import { Tools } from "../../april/tools";
import { GenericModal } from "../../may/FileSearch/Modal";
import { FirebaseInst } from "./firebaseConfig";
import { GComponent } from "../../april/GComponent";
import {
    collection,
    addDoc,
    onSnapshot,
    deleteDoc,
    doc,
    query,
    orderBy,
    serverTimestamp,
} from "firebase/firestore";

const LOCAL_SESSION_KEY = "firebaseConfig";
const fbinst = FirebaseInst.getInstance();
interface Info {
    id: string;
    text: string;
    createdAt: Date;
}
const renderInfos = (infos: Info[]): GComponent[] => {
    let res: GComponent[] = [];
    infos.forEach((info) => {
        const infoElement = Tools.div({
            class: "flex justify-between items-center p-3 bg-gray-50 rounded-lg shadow-sm",
            children: [
                Tools.comp("span", {
                    textContent: info.text,
                    class: "text-gray-800",
                }),
                Tools.comp(
                    "button",
                    {
                        textContent: "Delete",
                        class: "bg-red-500 text-white text-sm py-1 px-3 rounded-md hover:bg-red-600 transition-colors",
                    },
                    {
                        click: async (e: any, ls: any) => {
                            const docId = ls.s.id;
                            const docRef = doc(fbinst.getDB(), "infos", docId);

                            try {
                                await deleteDoc(docRef);
                            } catch (error) {
                                console.error(
                                    "Error deleting document: ",
                                    error
                                );
                                alert(
                                    "Failed to delete info. Please try again."
                                );
                            }
                        },
                    },
                    { id: info.id }
                ),
            ],
        });

        res.push(infoElement);
    });
    return res;
};
export const Page = () => {
    const infoInput = Tools.comp("input", {
        type: "text",
        placeholder: "Add new information...",
        class: "flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
        required: "",
    });
    const modal = GenericModal("Firebase Configs");
    let infosCollectionRef: any = null;
    const var_info_form = Tools.comp(
        "form",
        {
            class: "flex gap-4 mb-6",
            children: [
                infoInput,
                Tools.comp("button", {
                    type: "submit",
                    class: "bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors",
                    textContent: "Add",
                }),
            ],
        },
        {
            submit: async (e: any, ls: any) => {
                e.preventDefault();
                const newInfoText = infoInput.getElement().value.trim();

                if (newInfoText) {
                    try {
                        await addDoc(infosCollectionRef, {
                            text: newInfoText,
                            createdAt: serverTimestamp(), // Use server time for consistency
                        });
                        infoInput.getElement().value = ""; // Clear the input
                    } catch (error) {
                        console.error("Error adding document: ", error);
                        alert("Failed to add info. Please try again.");
                    }
                }
            },
        }
    );
    let fbinst = FirebaseInst.getInstance();

    const var_info_list = Tools.comp("div", {
        class: "space-y-3",
        children: [
            Tools.comp("p", {
                class: "text-gray-500",
                textContent: "Loading your list...",
            }),
        ],
    });
    const configComp = Tools.comp("textarea", {
        placeholder: "firebase configs...",
        class: "flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-60",
        required: "",
    });

    const form = Tools.comp(
        "form",
        {
            class: "flex gap-4 mb-6 flex-col w-full",
            children: [
                configComp,
                Tools.comp("button", {
                    type: "submit",
                    class: "bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors",
                    textContent: "Add",
                }),
            ],
        },
        {
            submit: (e: any, ls: any) => {
                e.preventDefault();
                let val = JSON.parse(configComp.getElement().value);
                fbinst.set_config(val);
                sessionStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(val));
                modal.s.handlers.hide();
            },
        }
    );
    modal.s.handlers.display(form);
    const init = () => {
        let val = sessionStorage.getItem(LOCAL_SESSION_KEY);
        if (val) {
            fbinst.set_config(JSON.parse(val));
            let db = fbinst.getDB();
            infosCollectionRef = collection(db, "infos");
            const q = query(
                collection(fbinst.getDB(), "infos"),
                orderBy("createdAt", "desc")
            );
            onSnapshot(q, (snapshot) => {
                const infos: Info[] = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    text: doc.data().text,
                    createdAt: doc.data().createdAt.toDate(),
                }));
                var_info_list.update({
                    innerHTML: "",
                    children: renderInfos(infos),
                });
            });
            configComp.getElement().value = JSON.stringify(
                fbinst.getConfig(),
                null,
                4
            );
        }
    };
    try {
        init();
    } catch (e) {
        console.log(e);
    }

    return Tools.comp("div", {
        class: "container mx-auto max-w-2xl p-8",
        children: [
            modal,
            Tools.comp("div", {
                class: "bg-white rounded-lg shadow-lg p-6",
                children: [
                    Tools.div({
                        class: "flex justify-between ",
                        children: [
                            Tools.comp("h1", {
                                class: "text-3xl font-bold text-gray-800 mb-6",
                                textContent: "My Info List",
                            }),
                            Tools.icon(
                                Settings,
                                {
                                    class: "text-gray-500 cursor-pointer hover:text-green-600 transition-colors hover:scale-120",
                                },
                                {
                                    click: (e: any, ls: any) => {
                                        modal.s.handlers.show();
                                    },
                                }
                            ),
                        ],
                    }),
                    var_info_form,
                    var_info_list,
                ],
            }),
        ],
    });
};
