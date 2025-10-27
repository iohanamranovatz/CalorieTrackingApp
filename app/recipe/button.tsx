import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export function TextareaWithButton() {
  return (
    <div className="grid w-full gap-2, display :">
        
      <Textarea placeholder="eg.500g potatoes..." />
      <Button variant="customWhite">Send message</Button>
    </div>
  )
}

export function TextareaDisabled() {
  return <Textarea placeholder="mlem." disabled />
}

