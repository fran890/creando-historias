"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, List, ListOrdered, Quote, Heading1, Heading2, Image as ImageIcon, Link as LinkIcon } from "lucide-react";
import { useEffect } from "react";

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function TiptapEditor({ content, onChange, placeholder = "Escribe tu historia aquí..." }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
      Link.configure({ openOnClick: false }),
      Image.configure({ inline: true }),
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[350px] p-4 text-gray-900 dark:text-gray-100",
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || "");
    }
  }, [content, editor]);

  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt("URL de la imagen:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL del enlace:", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="border border-gray-300 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${editor.isActive("heading", { level: 1 }) ? "bg-gray-200 dark:bg-gray-700 font-bold" : ""}`}
          title="Título H1"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${editor.isActive("heading", { level: 2 }) ? "bg-gray-200 dark:bg-gray-700 font-bold" : ""}`}
          title="Subtítulo H2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${editor.isActive("bold") ? "bg-gray-200 dark:bg-gray-700 text-blue-600" : ""}`}
          title="Negrita"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${editor.isActive("italic") ? "bg-gray-200 dark:bg-gray-700 text-blue-600" : ""}`}
          title="Cursiva"
        >
          <Italic className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${editor.isActive("bulletList") ? "bg-gray-200 dark:bg-gray-700 text-blue-600" : ""}`}
          title="Lista con viñetas"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${editor.isActive("orderedList") ? "bg-gray-200 dark:bg-gray-700 text-blue-600" : ""}`}
          title="Lista numerada"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${editor.isActive("blockquote") ? "bg-gray-200 dark:bg-gray-700 text-blue-600" : ""}`}
          title="Cita"
        >
          <Quote className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
        <button
          type="button"
          onClick={addLink}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${editor.isActive("link") ? "bg-gray-200 dark:bg-gray-700 text-blue-600" : ""}`}
          title="Añadir Enlace"
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={addImage}
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Insertar Imagen"
        >
          <ImageIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Editor Content Area */}
      <EditorContent editor={editor} />
    </div>
  );
}
