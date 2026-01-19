import { Tools } from "../../globalComps/tools";
import { GComponent } from "../../globalComps/GComponent";
import { LocalStorageJSONModel } from "../april/LocalStorage";


const LocalStorageSetter = () => {
  const rows = Tools.comp("div", { class: "space-y-3" });

  const addRowBtn = Tools.comp("button", {
    type: "button",
    class:
      "inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 cursor-pointer",
    textContent: "＋ Add field",
  });

  const saveBtn = Tools.comp("button", {
    type: "button",
    class:
      "inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer",
    textContent: "Save all to localStorage",
  });



  const clearAllBtn = Tools.comp("button", {
    type: "button",
    class:
      "inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700 cursor-pointer",
    textContent: "Clear ALL localStorage",
  });



  return Tools.comp("div", {
    class:
      "w-full bg-white shadow-sm rounded-xl p-6 border border-gray-200",
    children: [
      Tools.comp("h2", {
        class: "text-2xl font-semibold text-gray-800 mb-6",
        textContent: "localStorage Setter",
        key: "title",
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

export const LocalStorageSetterCtrl = () => {
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
export class OneRowCtrl {
  comp: any; // expecting a OneRow component
  index: number = 0;
  on_remove: (index: number) => void = (index: number) => {
    console.log("on_remove", index);
  };
  set_comp(comp: GComponent) {
    this.comp = comp;
  }
  set_up() {
    this.comp.s.removeBtn.update({}, { click: () => this.on_remove(this.index) });
  }
  set_values(key: string, value: string) {
    this.comp.s.key.update({ value: key });
    this.comp.s.value.update({ value: value });
  }
  private get_value(comp: GComponent) {
    return (comp.getElement() as HTMLInputElement).value;
  }
  get_values() {
    return {
      key: this.get_value(this.comp.s.key),
      value: this.get_value(this.comp.s.value),
    };
  }
}

export class LocalStorageConfigurer {
  comp: any; // expecting a LocalStorageSetter component
  model: LocalStorageJSONModel = new LocalStorageJSONModel();
  rows: { [index: number]: OneRowCtrl } = {};
  counter: number = 0;
  model_location: string[] = [];
  on_remove: (index: number) => void = (index: number) => {
    this.rows[index].comp.getElement().remove();
    delete this.rows[index];
  };
  set_comp(comp: GComponent) {
    this.comp = comp;
  }
  setup(modelKey: string) {
    this.model.setLocalStorageKey(modelKey);
    this.comp.s.addRowBtn.update({}, { click: () => this.createRow("", "") });
    this.comp.s.saveBtn.update({}, { click: () => this.saveAll() });
    this.comp.s.clearAllBtn.update({}, { click: () => this.clearAll() });
    this.loadExisting();
  }
  loadExisting() {
    this.reset_ui();
    if (!this.model.exists([...this.model_location])) return;
    const keys = this.model.get_keys([...this.model_location]);
    for (const key of keys) {
      const value = this.model.readEntry([...this.model_location, key]);
      this.createRow(key, value);
    }
  }

  load_keys(keys: string[]) {
    this.reset_ui();
    for (const key of keys) {
      let value = "not set";
      if (this.model.exists([...this.model_location, key])) {
        value = this.model.readEntry([...this.model_location, key]);
      }
      this.createRow(key, value);
    }
  }

  createRow(key: string, value: string) {
    const row = MainCtrl.oneRow(this.counter);
    row.on_remove = (index: number) => this.on_remove(index);
    this.rows[this.counter] = row;
    this.counter++;
    row.set_values(key, value);
    this.comp.s.rows.update({ child: row.comp });
    return row;
  }
  saveAll() {
    const data: { [key: string]: any } = {};
    for (const index in this.rows) {
      const row = this.rows[index];
      const values = row.get_values();
      data[values.key] = values.value;
    }
    if (this.model.exists([...this.model_location])) {
      if (this.model_location.length == 0) {
        this.model.updateEntryAtRoot(data);
      } else {
        this.model.updateEntry([...this.model_location], data);
      }
    } else {
      this.model.addEntry([...this.model_location], data);
    }
  }
  clearAll() {
    if (confirm("Are you sure you want to clear ALL localStorage keys for this site?")) {
      this.model.deleteEntry([...this.model_location]);
      this.reset_ui();
    }
  }
  set_title(title: string) {
    this.comp.s.title.update({ textContent: title });
  }
  reset_ui() {
    this.comp.s.rows.update({ innerHTML: "" });
    this.rows = {};
    this.counter = 0;
  }
}

export class MainCtrl {
  static localStorageConfigurer(modelKey: string, model_location?: string[], title?: string) {
    const ctrl = new LocalStorageConfigurer();
    const comp = LocalStorageSetter();
    ctrl.set_comp(comp);
    ctrl.model_location = model_location || [];
    ctrl.setup(modelKey);
    if (title) {
      ctrl.set_title(title);
    }
    return ctrl;
  }
  static oneRow(index: number) {
    const ctrl = new OneRowCtrl();
    ctrl.index = index;
    const comp = OneRow();
    ctrl.set_comp(comp);
    ctrl.set_up();
    return ctrl;
  }
}

export default LocalStorageSetterCtrl;
