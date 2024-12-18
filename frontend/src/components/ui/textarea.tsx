// components/ui/textarea.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

interface TextareaProps extends React.ComponentProps<"textarea"> {
  minRows?: number
  maxRows?: number
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, minRows = 1, maxRows = 5, ...props }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null)

    // Combine forwarded ref with internal ref
    React.useEffect(() => {
      if (ref) {
        if (typeof ref === "function") {
          ref(textareaRef.current)
        } else {
          (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = textareaRef.current
        }
      }
    }, [ref])

    const handleInput = () => {
      const textarea = textareaRef.current
      if (textarea) {
        // Reset height to auto to correctly calculate scrollHeight
        textarea.style.height = "auto"
        const lineHeight = parseInt(getComputedStyle(textarea).lineHeight, 10)
        const padding =
          parseInt(getComputedStyle(textarea).paddingTop, 10) +
          parseInt(getComputedStyle(textarea).paddingBottom, 10)
        const border =
          parseInt(getComputedStyle(textarea).borderTopWidth, 10) +
          parseInt(getComputedStyle(textarea).borderBottomWidth, 10)

        const minHeight = lineHeight * minRows + padding + border
        const maxHeight = lineHeight * maxRows + padding + border

        // Calculate the new height
        const newHeight = Math.min(textarea.scrollHeight, maxHeight)
        textarea.style.height = `${newHeight}px`

        // Optionally, disable further resizing if maxHeight is reached
        textarea.style.overflowY = textarea.scrollHeight > maxHeight ? "auto" : "hidden"
      }
    }

    React.useEffect(() => {
      handleInput()
    }, [props.value])

    return (
      <textarea
        className={cn(
          "flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={textareaRef}
        rows={minRows}
        onInput={handleInput}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
