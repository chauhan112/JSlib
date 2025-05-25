import { Tools } from "../../april/tools";
import { InputWithLabel } from "./LabeledInput";
export const DivWrap = (child: any, props: any = {}) => {
    return Tools.div({
        class: "flex flex-col gap-4 w-full ",
        children: [child],
        ...props,
    });
};
export const RepoInput = () => {
    let password = InputWithLabel(
        "Auth Token (Optional):",
        {
            type: "password",
            placeholder: "Personal Access Token (if private)",
        },
        "password"
    );
    password.update({
        child: Tools.comp("p", {
            class: "text-xs text-gray-500 mt-1",
            textContent: "Needed for private repos. Use PAT as password/token.",
        }),
    });
    let wid = Tools.div({
        class: "grid grid-cols-1 md:grid-cols-2 gap-4",
        children: [
            InputWithLabel("Repository HTTPS URL:", {
                placeholder: "https://github.com/user/repo.git",
            }),
            password,
        ],
    });

    return wid;
};
