

import { ScrollArea } from "@/components/ui/scroll-area"

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`
)

export function ScrollAreaSpace() {
  return (
    <ScrollArea className="h-72 w-full max-w-none rounded-md border">
      <div className="p-4 w-full">
        <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
        {tags.map((tag) => (
          <>
            <div key={tag} className="text-sm">
              {tag}
            </div>
            
          </>
        ))}
      </div>
    </ScrollArea>
  )
}
