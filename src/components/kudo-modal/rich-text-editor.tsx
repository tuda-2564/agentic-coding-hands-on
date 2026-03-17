"use client";

import { useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Mention from "@tiptap/extension-mention";
import CharacterCount from "@tiptap/extension-character-count";
import type { SuggestionProps } from "@tiptap/suggestion";
import type { Colleague } from "@/types/kudos";

const CHAR_LIMIT = 500;

type RichTextEditorProps = {
  content: string;
  onChange: (html: string) => void;
  error?: string;
};

async function fetchMentionItems(query: string): Promise<Colleague[]> {
  if (!query || query.length < 2) return [];
  try {
    const res = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) return [];
    return (await res.json()) as Colleague[];
  } catch {
    return [];
  }
}

// Simple suggestion popup rendered as a div portal
function createSuggestionRenderer() {
  let container: HTMLDivElement | null = null;
  let currentProps: SuggestionProps<Colleague> | null = null;

  const render = () => {
    if (!container || !currentProps) return;
    const { items, command } = currentProps;

    container.innerHTML = "";
    if (items.length === 0) {
      container.innerHTML =
        '<div class="px-3 py-2 text-sm text-[#6B8A9A]">Không tìm thấy đồng nghiệp</div>';
      return;
    }

    items.forEach((item: Colleague) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className =
        "w-full flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-gold/10 transition-colors text-left";
      btn.textContent = item.full_name;
      btn.addEventListener("mousedown", (e) => {
        e.preventDefault();
        command({ id: item.id, label: item.full_name });
      });
      container!.appendChild(btn);
    });
  };

  return {
    onStart: (props: SuggestionProps<Colleague>) => {
      currentProps = props;
      container = document.createElement("div");
      container.className =
        "absolute z-30 bg-surface-dark border border-gold rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.4)] min-w-[180px] max-h-[200px] overflow-y-auto";

      const { clientRect } = props;
      if (clientRect) {
        const rect = clientRect();
        if (rect) {
          container.style.top = `${rect.bottom + window.scrollY + 4}px`;
          container.style.left = `${rect.left + window.scrollX}px`;
          container.style.position = "fixed";
          container.style.top = `${rect.bottom + 4}px`;
          container.style.left = `${rect.left}px`;
        }
      }

      document.body.appendChild(container);
      render();
    },

    onUpdate: (props: SuggestionProps<Colleague>) => {
      currentProps = props;
      const { clientRect } = props;
      if (container && clientRect) {
        const rect = clientRect();
        if (rect) {
          container.style.top = `${rect.bottom + 4}px`;
          container.style.left = `${rect.left}px`;
        }
      }
      render();
    },

    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      return event.key === "Escape";
    },

    onExit: () => {
      if (container) {
        container.remove();
        container = null;
      }
      currentProps = null;
    },
  };
}

export default function RichTextEditor({
  content,
  onChange,
  error,
}: RichTextEditorProps) {
  const rendererRef = useRef(createSuggestionRenderer());

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Mention.configure({
        HTMLAttributes: {
          class: "mention text-gold font-medium",
        },
        suggestion: {
          items: async ({ query }: { query: string }) => fetchMentionItems(query),
          render: () => rendererRef.current,
        },
      }),
      CharacterCount.configure({ limit: CHAR_LIMIT }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "prose-sm text-white text-[14px] leading-[22px] min-h-[84px] p-[10px_12px] outline-none",
      },
    },
    onUpdate: ({ editor: e }) => {
      onChange(e.getHTML());
    },
    immediatelyRender: false,
  });

  // Sync external content reset (e.g. form reset)
  useEffect(() => {
    if (editor && content === "" && editor.getText() !== "") {
      editor.commands.clearContent();
    }
  }, [content, editor]);

  const charCount = editor?.storage.characterCount?.characters?.() ?? 0;
  const atLimit = charCount >= CHAR_LIMIT;

  const ToolbarButton = ({
    action,
    label,
    isActive,
  }: {
    action: () => void;
    label: string;
    isActive?: boolean;
  }) => (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        action();
      }}
      title={label}
      className={`w-7 h-7 rounded text-[13px] font-bold transition-colors ${
        isActive
          ? "bg-gold/20 text-gold"
          : "bg-transparent text-[#B0BEC5] hover:bg-white/10 hover:text-white"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-col gap-1">
      <div
        className={`w-full bg-surface-dark border rounded-lg overflow-hidden transition-all duration-150 ${
          error
            ? "border-[#EF4444]"
            : "border-[#1E3448] focus-within:border-gold focus-within:shadow-[0_0_0_3px_rgba(200,169,110,0.2)]"
        }`}
      >
        {/* Toolbar */}
        <div className="flex items-center gap-1 h-9 px-2 bg-[#0F2333] border-b border-[#1E3448]">
          <ToolbarButton
            action={() => editor?.chain().focus().toggleBold().run()}
            label="B"
            isActive={editor?.isActive("bold")}
          />
          <ToolbarButton
            action={() => editor?.chain().focus().toggleItalic().run()}
            label="I"
            isActive={editor?.isActive("italic")}
          />
          <ToolbarButton
            action={() => editor?.chain().focus().toggleUnderline().run()}
            label="U"
            isActive={editor?.isActive("underline")}
          />
          <ToolbarButton
            action={() => editor?.chain().focus().toggleBulletList().run()}
            label="≡"
            isActive={editor?.isActive("bulletList")}
          />
        </div>

        {/* Editable area */}
        <EditorContent editor={editor} />
      </div>

      {/* Hint + char count row */}
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs text-[#6B8A9A] italic">
          Bạn có thể dùng &apos;@tên&apos; để nhắc tới đồng nghiệp của bạn
        </p>
        <span
          className={`text-xs flex-shrink-0 ${
            atLimit ? "text-[#EF4444] font-semibold" : "text-[#6B8A9A]"
          }`}
        >
          {charCount}/{CHAR_LIMIT}
        </span>
      </div>

      {error && (
        <p role="alert" className="text-xs text-[#EF4444]">
          {error}
        </p>
      )}
    </div>
  );
}
