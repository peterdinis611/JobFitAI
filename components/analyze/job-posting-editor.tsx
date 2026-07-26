"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Undo2,
  Redo2,
  Eraser,
} from "lucide-react"
import { useEffect } from "react"
import { cn } from "@/lib/utils"

type JobPostingEditorProps = {
  value: string
  onChange: (plainText: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

function ToolbarButton({
  onClick,
  active,
  disabled,
  label,
  children,
}: {
  onClick: () => void
  active?: boolean
  disabled?: boolean
  label: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onMouseDown={(e) => {
        e.preventDefault()
        onClick()
      }}
      className={cn(
        "inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors",
        "hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-40",
        active && "bg-accent text-foreground",
      )}
    >
      {children}
    </button>
  )
}

export function JobPostingEditor({
  value,
  onChange,
  placeholder = "Paste the full job description…",
  className,
  disabled,
}: JobPostingEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        codeBlock: false,
        blockquote: false,
        horizontalRule: false,
      }),
    ],
    editorProps: {
      attributes: {
        class: cn(
          "job-posting-editor min-h-[168px] max-h-[240px] overflow-y-auto px-3 py-2.5 text-[13px] leading-relaxed outline-none",
          "prose prose-sm dark:prose-invert max-w-none",
          "[&_p]:my-1 [&_ul]:my-1.5 [&_ol]:my-1.5 [&_li]:my-0.5",
          "[&_h2]:mb-1 [&_h2]:mt-2 [&_h2]:text-[15px] [&_h2]:font-semibold",
          "[&_h3]:mb-1 [&_h3]:mt-2 [&_h3]:text-[14px] [&_h3]:font-semibold",
        ),
      },
    },
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getText({ blockSeparator: "\n\n" }))
    },
  })

  useEffect(() => {
    if (!editor) return
    const current = editor.getText({ blockSeparator: "\n\n" })
    if (value === "" && current !== "") {
      editor.commands.clearContent()
    }
  }, [editor, value])

  useEffect(() => {
    if (!editor) return
    editor.setEditable(!disabled)
  }, [editor, disabled])

  const empty = !value.trim()

  return (
    <div
      className={cn(
        "mac-field overflow-hidden focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50",
        disabled && "opacity-60",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-muted/40 px-1.5 py-1">
        <ToolbarButton
          label="Bold"
          active={editor?.isActive("bold")}
          disabled={!editor || disabled}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          <Bold className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          label="Italic"
          active={editor?.isActive("italic")}
          disabled={!editor || disabled}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          <Italic className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          label="Heading"
          active={editor?.isActive("heading", { level: 2 })}
          disabled={!editor || disabled}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 className="size-3.5" />
        </ToolbarButton>
        <span className="mx-1 h-4 w-px bg-border" aria-hidden />
        <ToolbarButton
          label="Bullet list"
          active={editor?.isActive("bulletList")}
          disabled={!editor || disabled}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          <List className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          label="Numbered list"
          active={editor?.isActive("orderedList")}
          disabled={!editor || disabled}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="size-3.5" />
        </ToolbarButton>
        <span className="mx-1 h-4 w-px bg-border" aria-hidden />
        <ToolbarButton
          label="Undo"
          disabled={!editor || disabled || !editor.can().undo()}
          onClick={() => editor?.chain().focus().undo().run()}
        >
          <Undo2 className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          label="Redo"
          disabled={!editor || disabled || !editor.can().redo()}
          onClick={() => editor?.chain().focus().redo().run()}
        >
          <Redo2 className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          label="Clear"
          disabled={!editor || disabled || empty}
          onClick={() => {
            editor?.chain().focus().clearContent().run()
            onChange("")
          }}
        >
          <Eraser className="size-3.5" />
        </ToolbarButton>
      </div>

      <div className="relative">
        {empty && !editor?.isFocused ? (
          <p className="pointer-events-none absolute left-3 top-2.5 text-[13px] text-muted-foreground">
            {placeholder}
          </p>
        ) : null}
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
