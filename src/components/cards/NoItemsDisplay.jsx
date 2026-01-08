import { Frown } from "lucide-react";

export default function NoItemsDisplay() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center justify-center text-center gap-3 text-muted-foreground">
        <Frown className="w-12 h-12" />
        <p className="text-base font-medium">No items to display</p>
      </div>
    </div>
  );
}
