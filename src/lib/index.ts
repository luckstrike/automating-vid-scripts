// place files you want to import through the `$lib` alias in this folder.
import type {
  DocumentData,
  DocumentReference,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  Timestamp,
} from "firebase/firestore";

// Interfaces
export interface Script {
  name: string;
  lastUpdatedString: string;
  lastUpdatedDate: Date | null;
  content: string | null | unknown; // a reference to the actual content (so less data is used each call)
  metaDocId: string | null | unknown; // id of this entry (contains a script's metadata)
}

export interface TextContent {
  content: string;
  uid: string;
}

// POTENTIAL TODO: Combine Script and ScriptMetaData
export interface ScriptMetaData {
  content: DocumentReference<TextContent>;
  created: Timestamp;
  doc_name: string;
  uid: string;
  updated: Timestamp;
}

export interface UserPrompt {
  prompt?: string;
}

export interface UserProvidedURL {
  url?: string;
}

export interface UserSelection {
  userSelection?: string;
}

export interface Env {
  OPENAI_API_KEY: string;
  PUBLIC_BASE_URL: string;
}

// Converters
export const textContentConverter: FirestoreDataConverter<TextContent> = {
  toFirestore(textContent: TextContent): DocumentData {
    return { ...textContent };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions,
  ): TextContent {
    const data = snapshot.data(options)!;
    return {
      content: data.content,
      uid: data.uid,
    };
  },
};

export const scriptMetaDataConverter: FirestoreDataConverter<ScriptMetaData> = {
  toFirestore(scriptMetaData: ScriptMetaData): DocumentData {
    return { ...scriptMetaData };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions,
  ): ScriptMetaData {
    const data = snapshot.data(options)!;
    return {
      content: data.content,
      created: data.created,
      doc_name: data.doc_name,
      uid: data.uid,
      updated: data.updated,
    };
  },
};
