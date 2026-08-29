"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Image as ImageIcon,
  Link as LinkIcon,
  Loader2,
  Upload,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { prepareImageForUpload, uploadImageWithProgress } from "@/lib/client/image-upload";

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function TiptapEditor({
  content,
  onChange,
  placeholder = "Escribe tu historia aquí...",
}: TiptapEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");

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
        class:
          "story-editor-content prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[350px] p-4 text-gray-900 dark:text-gray-100",
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || "");
    }
  }, [content, editor]);

  if (!editor) return null;

  const handleImageFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    setIsUploading(true);
    setUploadProgress("Optimizando WebP...");

    try {
      const webpFile = await prepareImageForUpload(file, (progress, label) => {
        setUploadProgress(`${label} (${progress}%)`);
      });

      const data = await uploadImageWithProgress(webpFile, (progress, label) => {
        setUploadProgress(`${label} (${progress}%)`);
      });

      if (data?.url) {
        editor.chain().focus().setImage({ src: data.url }).run();
      }
    } catch (err: any) {
      alert(err.message || "Error al subir la imagen al servidor.");
    } finally {
      setIsUploading(false);
      setUploadProgress("");
      e.target.value = "";
    }
  };

  const addImageFromUrl = () => {
    const url = window.prompt("URL de la imagen (o usa el botón de subir imagen para guardarla en Cloudflare R2):");
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
    <div className="border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 shadow-sm relative">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        onChange={handleImageFileSelect}
        className="hidden"
      />

      {/* Sticky Toolbar */}
      <div className="sticky top-16 z-20 flex flex-wrap items-center gap-1 p-2.5 bg-gray-50/95 dark:bg-gray-800/95 backdrop-blur-md rounded-t-xl border-b border-gray-200 dark:border-gray-700 shadow-xs transition-all">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
            editor.isActive("heading", { level: 1 }) ? "bg-gray-200 dark:bg-gray-700 font-bold" : ""
          }`}
          title="Título H1"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
            editor.isActive("heading", { level: 2 }) ? "bg-gray-200 dark:bg-gray-700 font-bold" : ""
          }`}
          title="Subtítulo H2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
            editor.isActive("bold") ? "bg-gray-200 dark:bg-gray-700 text-blue-600" : ""
          }`}
          title="Negrita"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
            editor.isActive("italic") ? "bg-gray-200 dark:bg-gray-700 text-blue-600" : ""
          }`}
          title="Cursiva"
        >
          <Italic className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
            editor.isActive("bulletList") ? "bg-gray-200 dark:bg-gray-700 text-blue-600" : ""
          }`}
          title="Lista con viñetas"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
            editor.isActive("orderedList") ? "bg-gray-200 dark:bg-gray-700 text-blue-600" : ""
          }`}
          title="Lista numerada"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
            editor.isActive("blockquote") ? "bg-gray-200 dark:bg-gray-700 text-blue-600" : ""
          }`}
          title="Cita"
        >
          <Quote className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
        <button
          type="button"
          onClick={addLink}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
            editor.isActive("link") ? "bg-gray-200 dark:bg-gray-700 text-blue-600" : ""
          }`}
          title="Añadir Enlace"
        >
          <LinkIcon className="w-4 h-4" />
        </button>

        {/* Upload File to R2 Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-brand-600 dark:text-brand-400 flex items-center space-x-1"
          title="Subir imagen desde equipo (Cloudflare R2)"
        >
          {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
        </button>

        {/* URL Image fallback button */}
        <button
          type="button"
          onClick={addImageFromUrl}
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Insertar imagen por URL"
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        {isUploading && (
          <span className="text-xs text-brand-600 dark:text-brand-400 font-semibold px-2">
            {uploadProgress}
          </span>
        )}
      </div>

      {/* Editor Content Area */}
      <EditorContent editor={editor} />
    </div>
  );
}
