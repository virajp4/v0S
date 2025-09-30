import { useEditor, useEditorState, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/database";
import { Bold, Italic, Strikethrough, List, ListOrdered } from "lucide-react";
import { useEffect, useRef } from "react";

const DOCUMENT_ID = "notepad-content";

export default function TextEditorApp() {
  const savedDocument = useLiveQuery(() => db.notepad.get(DOCUMENT_ID), []);
  const hasLoadedContent = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        code: false,
        codeBlock: false,
        horizontalRule: false,
        blockquote: false,
      }),
      TextAlign.configure({
        types: ["paragraph"],
      }),
      TextStyle,
    ],
    editorProps: {
      attributes: {
        class: "focus:outline-none text-white/95",
      },
    },
    onUpdate: async ({ editor }) => {
      const content = editor.getHTML();
      await db.notepad.put({
        id: DOCUMENT_ID,
        content,
        lastModified: Date.now(),
      });
    },
  });

  useEffect(() => {
    if (!hasLoadedContent.current && editor && savedDocument?.content && editor.isEmpty) {
      editor.commands.setContent(savedDocument.content);
      hasLoadedContent.current = true;
    }
  }, [editor, savedDocument]);

  const editorState = useEditorState({
    editor,
    selector: (ctx) => ({
      isBold: ctx.editor.isActive("bold"),
      isItalic: ctx.editor.isActive("italic"),
      isStrike: ctx.editor.isActive("strike"),
      isBulletList: ctx.editor.isActive("bulletList"),
      isOrderedList: ctx.editor.isActive("orderedList"),
    }),
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="h-full w-full flex flex-col px-2">
      <div className="flex items-center gap-1 pb-2 border-b border-white/25">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editorState.isBold}
          title="Bold"
        >
          <Bold size={14} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editorState.isItalic}
          title="Italic"
        >
          <Italic size={14} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editorState.isStrike}
          title="Strikethrough"
        >
          <Strikethrough size={14} />
        </ToolbarButton>
        <div className="w-px h-4 bg-white/25 mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editorState.isBulletList}
          title="Bullet List"
        >
          <List size={14} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editorState.isOrderedList}
          title="Numbered List"
        >
          <ListOrdered size={14} />
        </ToolbarButton>
      </div>
      <div className="overflow-y-auto my-2 px-1 py-1 text-[15px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

const ToolbarButton = ({
  onClick,
  isActive = false,
  children,
  title,
}: {
  onClick: () => void;
  isActive?: boolean;
  children: React.ReactNode;
  title: string;
}) => (
  <button
    onClick={onClick}
    title={title}
    className={`p-1 rounded transition-colors ${
      isActive ? "text-white" : "text-white/35 hover:text-white/80"
    }`}
  >
    {children}
  </button>
);
