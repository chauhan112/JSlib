import { PlayCircle, Search } from "lucide";
import { Tools } from "../../april/tools";

export const SearchComp = () => {
    return Tools.comp("form", {
        class: "w-full flex items-center justify-around",
        children: [
            Tools.comp("input", {
                class: "bg-gray-200 rounded-full py-1 px-2 focus:outline-none",
                name: "search",
                placeholder: "Search...",
            }),
            // Tools.icon(Search, {
            //     class: "w-6 h-6 text-gray-500 absolute left-8",
            // }),
            SearchSettingBtn(),
        ],
    });
};

export const SearchSettingBtn = () => {
    return Tools.comp("button", {
        class: "hover:scale-110 hover:cursor-pointer",
        innerHTML: `<svg width="24" height="24" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="18" height="17" stroke="0"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M6.6583 4.51815C6.6583 5.84037 5.50414 6.91207 4.07915 6.91207C2.65499 6.91207 1.5 5.84037 1.5 4.51815C1.5 3.1967 2.65499 2.125 4.07915 2.125C5.50414 2.125 6.6583 3.1967 6.6583 4.51815ZM15.37 3.46965C15.9933 3.46965 16.5 3.93977 16.5 4.51815C16.5 5.0973 15.9933 5.56742 15.37 5.56742H10.4384C9.8142 5.56742 9.30754 5.0973 9.30754 4.51815C9.30754 3.93977 9.8142 3.46965 10.4384 3.46965H15.37ZM2.63083 11.3035H7.56247C8.18663 11.3035 8.69329 11.7737 8.69329 12.3528C8.69329 12.9312 8.18663 13.4021 7.56247 13.4021H2.63083C2.00666 13.4021 1.5 12.9312 1.5 12.3528C1.5 11.7737 2.00666 11.3035 2.63083 11.3035ZM13.9208 14.7176C15.3458 14.7176 16.5 13.6459 16.5 12.3244C16.5 11.0022 15.3458 9.93053 13.9208 9.93053C12.4967 9.93053 11.3417 11.0022 11.3417 12.3244C11.3417 13.6459 12.4967 14.7176 13.9208 14.7176Z" fill="black"/>
</svg>`,
    });
};
