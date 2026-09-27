import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/utils/cn"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-[var(--bg-color-for-layer-on-body)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-first focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "first-style-button-bg text-[var(--text-color-svg-white)]",
        destructive:
          "bg-status-danger text-status-danger hover:bg-status-danger",
        outline:
          "border border-color-theme bg-color-for-body first-text-color hover:bg-color-for-layer-sec",
        secondary:
          "bg-color-for-layer-sec first-text-color-for-paragraph hover:bg-color-for-layer-three",
        ghost: "first-text-color hover:bg-color-for-layer-sec",
        link: "text-first underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  // Additional props can be added here
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

