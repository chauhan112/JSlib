import { EllipsisVertical } from "lucide";
import { Tools } from "../../../april/tools";
import { GlobalStates } from "../../../june/domain-ops/GlobalStates";

export const InputComp = () => {
    return Tools.comp("input", {
        type: "text",
        class: "w-full px-4 py-3 text-slate-700 placeholder-slate-400 outline-none",
        placeholder: "Type to search...",
    });
}

export class InputCompCtrl {
    comp: any;
    set_comp(comp: any) {
        this.comp = comp;
    }
    get_value() {
        return this.comp.getElement().value;
    }
    set_value(value: string) {
        this.comp.getElement().value = value;
    }
    clear_value() {
        this.comp.getElement().value = "";
    }
}

export const Dropdown = (options: { value: string; label: string }[]) => {
    return Tools.comp("select", {
        class: "px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
        children: options.map((o: any) =>
            Tools.comp("option", { value: o.value, textContent: o.label })
        ),
    });
}

export class DropdownCtrl {
    comp: any;
    set_comp(comp: any) {
        this.comp = comp;
    }
    set_options(options: { value: string; label: string }[]) {
        this.comp.update({ innerHTML: "", children: options.map((o: any) => Tools.comp("option", { value: o.value, textContent: o.label })) });
    }
    get_value() {
        return this.comp.getElement().value;
    }
    set_value(value: string) {
        this.comp.getElement().value = value;
    }
    clear_value() {
        this.comp.getElement().value = "";
    }
}

export const CardComp = () => {
    const title = Tools.comp("span", {
        class: "text-slate-700 font-medium text-sm",
        textContent: "Review Quarter Results",
    });
    const ops = Tools.icon(
        EllipsisVertical,
        {
            key: "edit",
            class: "w-6 h-6 text-gray-500 hover:scale-110 transform cursor-pointer",
        },

    )
    return Tools.comp("li", {
        class:
          "flex w-full items-center justify-between p-3 bg-white border border-slate-200 rounded-lg shadow-sm border-l-4 border-l-indigo-500 hover:shadow-md transition-all",
        children: [
          Tools.comp("div", {
            class: "flex items-center gap-3",
            children: [title],
          }),
          ops,
        ],
      }, {}, { title, ops });
}

export class CardCompCtrl {
    comp: any;
    options: { label: string; }[] = [{label: "Edit"}, {label: "Delete"}, {label: "View"}];
    onOpsMenuClicked: (data: any, label: string) => void = (data:any, label:string) => {
        console.log(data, label);
    };
    onCardClicked: (data:any) => void = (data:any) => {
        console.log(data);
    };
    set_options(options: { label: string; }[]) {
        this.options = options;
        if (options.length > 0) {
            this.comp.s.ops.getElement().classList.remove("hidden");
        } else {
            this.comp.s.ops.getElement().classList.add("hidden");
        }
    }
    private on_ops_clicked: (e: any, ls: any) => void = (e:any, ls:any) => {
        e.stopPropagation();
        let cm = GlobalStates.getInstance().getState("contextMenu");
        let options = this.options.map((o: any) => ({ label: o.label, info: this.data, onClick: () => this.onOpsMenuClicked(this.data, o.label)}));
        cm.s.setOptions(options);
        cm.s.displayMenu(e, ls);
    };
    data: any;
    title_getter: (info: any) => string = (info: any) => info.title;
    set_comp(comp: any) {
        this.comp = comp;
    }
    set_data(data: any) {
        this.comp.s.title.update({ textContent: this.title_getter(data) });
        this.data = data;
    }
    setup() {
        this.comp.s.ops.update({}, { click: (e: any, ls: any) => this.on_ops_clicked(e, ls) });
        this.comp.update({}, { click: () => this.onCardClicked(this.data) });
    }
}

export class MainCtrl {
    static cardComp(data: any, title_getter?: (info: any) => string) {
        const cardCompCtrl = new CardCompCtrl();
        cardCompCtrl.set_comp(CardComp());
        if (title_getter) {
            cardCompCtrl.title_getter = title_getter;
        }
        cardCompCtrl.set_data(data);
        cardCompCtrl.setup();
        return cardCompCtrl;
    }
    static dropdown(options: { value: string; label: string }[]) {
        const dropdownCtrl = new DropdownCtrl();
        dropdownCtrl.set_comp(Dropdown(options));
        return dropdownCtrl;
    }
}