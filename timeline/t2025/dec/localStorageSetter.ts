import { Tools } from "../april/tools";
import { GComponent } from "../april/GComponent";
import { LocalStorageJSONModel } from "../april/LocalStorage";


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



  const clearAllBtn = Tools.comp("button", {
    type: "button",
    class:
      "inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700",
    textContent: "Clear ALL localStorage",
  });



  return Tools.comp("div", {
    class:
      "w-full bg-white shadow-sm rounded-xl p-6 border border-gray-200",
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

          clearAllBtn,
        ],
      }),
    ],
  }, {}, {
    rows,
    addRowBtn,
    saveBtn,

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
    class: "flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
      value, removeBtn
    ],
  }, {}, {
    key,
    value,
    removeBtn,
  });
}

const LocalStorageSetterCtrl = () => {
  const setter = LocalStorageSetter();
  const model = new LocalStorageJSONModel();
  let s: { [key: string]: any } = { children: {}, index: 0 };

  const createRow = (key: string, value: string) => {
    const row = OneRow();
    row.s.index = s.index;
    row.s.key.update({ value: key });
    row.s.value.update({ value: value });

    row.s.removeBtn.update({}, {
      click: () => {
        model.deleteEntry([key]);
        row.getElement().remove();
        s.children[row.s.index] = null;
      }
    });
    s.children[s.index] = row;
    s.index++;
    setter.s.rows.update({ child: row });
  }

  const get_value = (comp: GComponent) => {
    const inputElement = comp.getElement() as HTMLInputElement;
    return inputElement.value;
  }

  const saveAll = () => {
    
    for (const index in s.children) {
      if (s.children[index] === null) continue;
      const row = s.children[index];
      const key = get_value(row.s.key);
      const value = get_value(row.s.value);
      if (model.exists([key])) {
        model.updateEntry([key], value);
      } else {
        model.addEntry([key], value);
      }
    }
  }

  const loadExisting = () => {
    setter.s.rows.update({ innerHTML: "" });
    const keys = model.get_keys([]);
    for (const key of keys) {
      const value = model.readEntry([key]);
      createRow(key, value);
    }
  }
  const clearAll = () => {
    if (confirm("Are you sure you want to clear ALL localStorage keys for this site?")) {
      model.deleteEntry([]);
      s.children = {};
      s.index = 0;
      loadExisting();
    }
  }
  const setup = (modelKey: string) => {
    model.setLocalStorageKey(modelKey);
    setter.s.addRowBtn.update({}, { click: () => createRow("", "") });
    setter.s.saveBtn.update({}, { click: saveAll });
    loadExisting();
    setter.s.clearAllBtn.update({}, { click: clearAll });
  }
  return {
    setter,
    createRow,
    setup,
    saveAll,
    loadExisting,
    clearAll,
    model,
    s
  }
}

export default LocalStorageSetterCtrl;
