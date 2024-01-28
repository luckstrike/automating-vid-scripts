// place files you want to import through the `$lib` alias in this folder.

// Typescript Interface to Define the Script Object
export interface Script {
    name: string;
    lastUpdatedString: string;
    lastUpdatedDate: Date | null;
    content: string | null | unknown; // a reference to the actual content (so less data is used each call)
}