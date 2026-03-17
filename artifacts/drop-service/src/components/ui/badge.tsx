import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "bg-primary/10 text-primary border border-primary/20": variant === "default",
          "bg-secondary text-secondary-foreground": variant === "secondary",
          "bg-destructive/10 text-destructive border border-destructive/20": variant === "destructive",
          "bg-green-500/10 text-green-700 border border-green-500/20": variant === "success",
          "bg-amber-500/10 text-amber-700 border border-amber-500/20": variant === "warning",
          "bg-blue-500/10 text-blue-700 border border-blue-500/20": variant === "info",
          "text-foreground border border-input": variant === "outline",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
