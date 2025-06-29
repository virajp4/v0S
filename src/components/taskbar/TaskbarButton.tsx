import { Button } from "@/components/ui/button";

export function TaskbarButton({ children, ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="w-7 h-7 hover:bg-gray-400/40 active:bg-gray-400/80 rounded-sm"
      {...props}
    >
      {children}
    </Button>
  );
}
