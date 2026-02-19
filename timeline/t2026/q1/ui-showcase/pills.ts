import { Tools } from "../../../globalComps/tools";

export const Pill = (label: string) => {
    let unselected = {
        class: "category-btn px-3 py-1.5 rounded-full text-xs font-medium border border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--fg)] transition-all bg-[var(--card)] text-[var(--muted)]",
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
                class: "category-btn px-3 py-1.5 rounded-full text-xs font-medium transition-all active bg-[var(--accent)] text-[var(--bg)]",
            },
            unselected,
        },
    );
};
