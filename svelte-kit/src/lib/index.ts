// place files you want to import through the `$lib` alias in this folder.
import type { DocumentReference, Timestamp } from "firebase/firestore";

// Interfaces
export interface Script {
    name: string;
    lastUpdatedString: string;
    lastUpdatedDate: Date | null;
    content: string | null | unknown; // a reference to the actual content (so less data is used each call)
    metaDocId: string | null | unknown; // id of this entry (contains a script's metadata)
}

export interface TextContent {
    content: string,
    uid: string
}

// POTENTIAL TODO: Combine Script and ScriptMetaData
export interface ScriptMetaData {
    content: DocumentReference<TextContent>,
    created: Timestamp,
    doc_name: string,
    uid: string,
    updated: Timestamp
}