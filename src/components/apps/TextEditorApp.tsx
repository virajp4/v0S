import { useEditor, useEditorState, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/database";
import {
  Bold,
  Italic,
  Strikethrough,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  ChevronDown,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const DOCUMENT_ID = "notepad-content";

export default function TextEditorApp() {
  const savedDocument = useLiveQuery(() => db.notepad.get(DOCUMENT_ID), []);
  const hasLoadedContent = useRef(false);
  const [isHeadingOpen, setIsHeadingOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        code: false,
        codeBlock: false,
        horizontalRule: false,
        blockquote: false,
        heading: {
          levels: [1, 2, 3],
        },
      }),
      TextAlign.configure({
        types: ["paragraph", "heading"],
      }),
      TextStyle,
      Underline,
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
      isUnderline: ctx.editor.isActive("underline"),
      isBulletList: ctx.editor.isActive("bulletList"),
      isOrderedList: ctx.editor.isActive("orderedList"),
      isH1: ctx.editor.isActive("heading", { level: 1 }),
      isH2: ctx.editor.isActive("heading", { level: 2 }),
      isH3: ctx.editor.isActive("heading", { level: 3 }),
    }),
  });

  const getCurrentTextStyle = () => {
    if (editorState.isH1) return "Heading 1";
    if (editorState.isH2) return "Heading 2";
    if (editorState.isH3) return "Heading 3";
    return "Text";
  };

  function handleChangeTextStyle(level: 0 | 1 | 2 | 3) {
    if (!editor) return;
    if (level === 0) {
      editor.chain().focus().setParagraph().run();
    } else {
      editor.chain().focus().setHeading({ level }).run();
    }
    setIsHeadingOpen(false);
  }

  function handleChangeTextFormat(
    format: "bold" | "italic" | "underline" | "strike" | "bulletList" | "orderedList"
  ) {
    if (!editor) return;
    switch (format) {
      case "bold":
        editor.chain().focus().toggleBold().run();
        break;
      case "italic":
        editor.chain().focus().toggleItalic().run();
        break;
      case "underline":
        editor.chain().focus().toggleUnderline().run();
        break;
      case "strike":
        editor.chain().focus().toggleStrike().run();
        break;
      case "bulletList":
        editor.chain().focus().toggleBulletList().run();
        break;
      case "orderedList":
        editor.chain().focus().toggleOrderedList().run();
        break;
    }
  }

  if (!editor) {
    return null;
  }

  return (
    <div className="h-full w-full flex flex-col px-2">
      <div className="flex items-center gap-1 pb-2 border-b border-white/25">
        <Popover open={isHeadingOpen} onOpenChange={setIsHeadingOpen}>
          <PopoverTrigger className="w-[100px] flex items-center justify-between gap-1 px-2 text-sm text-white/80 hover:text-white">
            {getCurrentTextStyle()}
            <ChevronDown size={14} />
          </PopoverTrigger>
          <PopoverContent
            className="w-36 p-1 z-[9999] flex flex-col gap-1 bg-neutral-900/80 backdrop-blur-lg border-neutral-800/80"
            align="start"
          >
            <HeadingOption
              label="Text"
              onClick={() => {
                handleChangeTextStyle(0);
              }}
            />
            <HeadingOption
              label="Heading 1"
              onClick={() => {
                handleChangeTextStyle(1);
              }}
            />
            <HeadingOption
              label="Heading 2"
              onClick={() => {
                handleChangeTextStyle(2);
              }}
            />
            <HeadingOption
              label="Heading 3"
              onClick={() => {
                handleChangeTextStyle(3);
              }}
            />
          </PopoverContent>
        </Popover>
        <div className="w-px h-4 bg-white/25 mx-1" />
        <ToolbarButton
          onClick={() => handleChangeTextFormat("bold")}
          isActive={editorState.isBold}
          title="Bold"
        >
          <Bold size={14} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => handleChangeTextFormat("italic")}
          isActive={editorState.isItalic}
          title="Italic"
        >
          <Italic size={14} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => handleChangeTextFormat("underline")}
          isActive={editorState.isUnderline}
          title="Underline"
        >
          <UnderlineIcon size={14} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => handleChangeTextFormat("strike")}
          isActive={editorState.isStrike}
          title="Strikethrough"
        >
          <Strikethrough size={14} />
        </ToolbarButton>
        <div className="w-px h-4 bg-white/25 mx-1" />
        <ToolbarButton
          onClick={() => handleChangeTextFormat("bulletList")}
          isActive={editorState.isBulletList}
          title="Bullet List"
        >
          <List size={14} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => handleChangeTextFormat("orderedList")}
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

const HeadingOption = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`px-2 py-1 text-left text-white/90 hover:bg-white/10 rounded`}
  >
    {label}
  </button>
);

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
    className={`p-1 rounded cursor-pointer transition-colors ${
      isActive ? "text-white" : "text-white/35 hover:text-white/80"
    }`}
  >
    {children}
  </button>
);
