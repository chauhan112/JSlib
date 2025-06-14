// npm instale firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

export class FirebaseInst {
    private app: any = null;
    private db: any = null;
    private config: any = null;
    static instance: FirebaseInst | null = null;
    static getInstance() {
        FirebaseInst.instance ??= new FirebaseInst();
        return FirebaseInst.instance;
    }
    set_config(config: any) {
        this.config = config;
    }
    getDB() {
        if (this.db === null) {
            this.db = getFirestore(this.getApp());
        }
        return this.db;
    }
    getApp() {
        if (this.app === null) {
            this.app = initializeApp(this.config);
        }
        return this.app;
    }
    getConfig() {
        if (this.config === null) {
            throw new Error("config not set");
        }
        return this.config;
    }
}
