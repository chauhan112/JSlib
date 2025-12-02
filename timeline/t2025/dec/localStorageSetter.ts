import { LocalStorageJSONModel } from "../april/LocalStorage";
import { Tools } from "../april/tools";
import { GComponent } from "../april/GComponent";
const LocalStorageSetter = () => {
    const rows = Tools.comp("div", { class: "space-y-3" });

    const addRowBtn = Tools.comp("button", {
      type: "button",
      class:
        "inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700",
      textContent: "＋ Add field",
    });
    
    const saveBtn = Tools.comp("button", {
      type: "button",
      class:
        "inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-emerald-600 text-white hover:bg-emerald-700",
      textContent: "Save all to localStorage",
    });
    
    const loadExistingBtn = Tools.comp("button", {
      type: "button",
      class:
        "inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-slate-600 text-white hover:bg-slate-700",
      textContent: "Load existing keys",
    });
    
    const clearAllBtn = Tools.comp("button", {
      type: "button",
      class:
        "inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700",
      textContent: "Clear ALL localStorage",
    });
    
    
    
    return Tools.comp("div", {
        class:
          "w-full max-w-3xl bg-white shadow-sm rounded-xl p-6 border border-gray-200",
        children: [
          Tools.comp("h2", {
            class: "text-2xl font-semibold text-gray-800 mb-6",
            textContent: "localStorage Setter",
          }),
          rows,
          Tools.comp("div", {
            class: "flex flex-wrap gap-2 mt-6",
            children: [
              addRowBtn,
              saveBtn,
              loadExistingBtn,
              clearAllBtn,
            ],
          }),
        ],
      }, {}, {
        rows,
        addRowBtn,
        saveBtn,
        loadExistingBtn,
        clearAllBtn,
        
      });
}

const OneRow = () => {
    const key = Tools.comp("input", {
        type: "text",
        placeholder: "Key",
        class: "flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    });
    const value = Tools.comp("input", {
        type: "text",
        placeholder: "Value",
        class:"flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    });
    const removeBtn = Tools.comp("button", {
        type: "button",
        class: "px-2 py-1.5 text-sm font-medium rounded-md bg-red-100 text-red-700 hover:bg-red-200",
        textContent: "✕",
        title: "Remove this field",
    });
    return Tools.comp("div", {
        class: "flex gap-2",
        children: [
            key,
            value,
        ],
    },{},{
        key,
        value,
        removeBtn,
    });
}

const LocalStorageSetterCtrl = () => {
    const setter = LocalStorageSetter();
    const children: GComponent[] = [];
    const createRow = ( key: string, value: string ) => {
        const row = OneRow();
        row.s.key.update({ value: key });
        row.s.value.update({ value: value });

        row.s.removeBtn.update({}, { click: () => {
            row.getElement().remove();
            // children.splice(children.indexOf(row), 1);
        }});
        setter.s.rows.update({ child: row });
        children.push(row);
    }

    const saveAll = () => {
        for (const row of children) {
            const key = row.s.key.s.handlers.get();
            const value = row.s.value.s.handlers.get();
            localStorage.setItem(key, value);
        }
    }

    const loadExisting = () => {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem( key! ) || "";
            createRow(key!, value);
          }    
    }
    const clearAll = () => {
        if (confirm("Are you sure you want to clear ALL localStorage keys for this site?")) {
            localStorage.clear();
            setter.s.rows.update({ innerHTML: "" });
            children.splice(0, children.length);
            createRow("", "");
        }
    }
    const setup = () => {
        setter.s.addRowBtn.update({}, { click: () => createRow("", "") });
        setter.s.saveBtn.update({}, { click: saveAll });
        setter.s.loadExistingBtn.update({}, { click: loadExisting });
        setter.s.clearAllBtn.update({}, { click: clearAll });
    }
    return {
        setter,
        createRow,
        setup,
        saveAll,
        loadExisting,
        clearAll,
    }
}

export default LocalStorageSetterCtrl;
