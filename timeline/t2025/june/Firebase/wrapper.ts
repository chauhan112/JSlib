// src/FirebaseModel.ts

import {
    collection,
    doc,
    addDoc,
    deleteDoc,
    updateDoc,
    getDoc,
    getDocs,
    DocumentReference,
    CollectionReference,
    DocumentData,
} from "firebase/firestore";

/**
 * A generic model for interacting with Firestore using a path-based approach.
 * A "location" is an array of strings representing the path to a document or collection.
 * - An ODD number of segments points to a COLLECTION (e.g., ['users', 'user123', 'posts']).
 * - An EVEN number of segments points to a DOCUMENT (e.g., ['users', 'user123']).
 */
export class FirebaseModel {
    private readonly db: any;
    constructor(db: any) {
        this.db = db;
    }
    /**
     * Gets a Firestore DocumentReference from a location array.
     * @private
     */
    private _getDocRef(location: string[]): DocumentReference<DocumentData> {
        if (location.length === 0 || location.length % 2 !== 0) {
            throw new Error(
                "Invalid location for a document. Path must have an even number of segments."
            );
        }
        return doc(this.db, location[0], ...location.slice(1));
    }

    /**
     * Gets a Firestore CollectionReference from a location array.
     * @private
     */
    private _getCollectionRef(
        location: string[]
    ): CollectionReference<DocumentData> {
        if (location.length % 2 === 0) {
            throw new Error(
                "Invalid location for a collection. Path must have an odd number of segments."
            );
        }
        return collection(this.db, location[0], ...location.slice(1));
    }

    /**
     * Adds a new document to a collection.
     * @param location - Path to the collection (must have an odd number of segments).
     * @param value - The data object for the new document.
     * @returns The ID of the newly created document.
     */
    async addEntry(location: string[], value: object): Promise<string> {
        try {
            const collectionRef = this._getCollectionRef(location);
            const docRef = await addDoc(collectionRef, value);
            return docRef.id;
        } catch (error) {
            console.error(
                `Error adding entry at [${location.join("/")}]:`,
                error
            );
            throw error;
        }
    }

    /**
     * Deletes a document from Firestore.
     * @param location - Path to the document (must have an even number of segments).
     */
    async deleteEntry(location: string[]): Promise<void> {
        try {
            const docRef = this._getDocRef(location);
            await deleteDoc(docRef);
        } catch (error) {
            console.error(
                `Error deleting entry at [${location.join("/")}]:`,
                error
            );
            throw error;
        }
    }

    /**
     * Updates data in an existing document.
     * This performs a shallow merge. It does not overwrite the entire document.
     * @param location - Path to the document (must have an even number of segments).
     * @param value - An object containing the fields to update.
     */
    async updateEntry(location: string[], value: object): Promise<void> {
        try {
            const docRef = this._getDocRef(location);
            await updateDoc(docRef, value);
        } catch (error) {
            console.error(
                `Error updating entry at [${location.join("/")}]:`,
                error
            );
            throw error;
        }
    }

    /**
     * Reads a single document's data from Firestore.
     * @param location - Path to the document (must have an even number of segments).
     * @returns The document's data, or null if it doesn't exist.
     */
    async readEntry(location: string[]): Promise<DocumentData | null> {
        try {
            const docRef = this._getDocRef(location);
            const docSnap = await getDoc(docRef);
            return docSnap.exists() ? docSnap.data() : null;
        } catch (error) {
            console.error(
                `Error reading entry at [${location.join("/")}]:`,
                error
            );
            throw error;
        }
    }

    /**
     * Retrieves all document IDs (keys) from a collection.
     * @param location - Path to the collection (must have an odd number of segments).
     * @returns An array of document ID strings.
     */
    async get_keys(location: string[]): Promise<string[]> {
        try {
            const collectionRef = this._getCollectionRef(location);
            const snapshot = await getDocs(collectionRef);
            return snapshot.docs.map((doc) => doc.id);
        } catch (error) {
            console.error(
                `Error getting keys at [${location.join("/")}]:`,
                error
            );
            throw error;
        }
    }

    /**
     * Checks if a document exists.
     * @param location - Path to the document (must have an even number of segments).
     * @returns A boolean indicating whether the document exists.
     */
    async exists(location: string[]): Promise<boolean> {
        try {
            const docRef = this._getDocRef(location);
            const docSnap = await getDoc(docRef);
            return docSnap.exists();
        } catch (error) {
            console.error(
                `Error checking existence at [${location.join("/")}]:`,
                error
            );
            // In case of error, it's safer to assume it doesn't exist or handle appropriately.
            return false;
        }
    }
}
