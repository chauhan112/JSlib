import { Tools } from "../../../globalComps/tools";
import "./style.css";

export const Pill = (label: string) => {
    let unselected = {
        class: "px-3 py-1.5 rounded-full text-xs font-medium border border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--fg)] transition-all bg-[var(--card)] text-[var(--muted)]",
    };
    return Tools.comp(
        "button",
        {
            ...unselected,
            textContent: label,
        },
        {},
        {
            selected: {
                class: "px-3 py-1.5 rounded-full text-xs font-medium transition-all active bg-[var(--accent)] text-[var(--bg)]",
            },
            unselected,
        },
    );
};
