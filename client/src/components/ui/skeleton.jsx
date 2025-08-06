import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}) {
  return (
    <div
      className={cn("animate-pulse dark:bg-[#0A0A0A] rounded-md bg-primary/10", className)}
      {...props} />
  );
}

export { Skeleton }
