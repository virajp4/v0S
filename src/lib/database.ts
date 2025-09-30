import Dexie from "dexie";
import type { EntityTable } from "dexie";

interface NotepadDocument {
  id: string;
  content: string;
  lastModified: number;
}

const db = new Dexie("v0SDatabase") as Dexie & {
  notepad: EntityTable<NotepadDocument, "id">;
};

db.version(1).stores({
  notepad: "id, lastModified",
});

export type { NotepadDocument };
export { db };
