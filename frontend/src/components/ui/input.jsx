import * as React from "react";
import { cn } from "@/lib/utils"
import { cva } from "class-variance-authority";

const inputVariants = cva(
  "tw-flex  tw-w-full tw-border tw-border-input tw-px-3 tw-py-2 tw-text-sm file:tw-border-0 file:tw-bg-transparent file:tw-text-sm file:tw-font-medium placeholder:tw-text-muted-foreground disabled:!tw-bg-[#e9ecef] disabled:pl  focus:tw-outline-0 focus:tw-outline-offset-0 disabled:tw-cursor-not-allowed tw-bg-indigo-100/10 tw-border-solid tw-text-gray-900 sm:tw-text-sm tw-p-2.5 placeholder:tw-opacity-90 placeholder:tw-font-[400] tw-rounded",
  {
    variants: {
      variant: {
        ringShadow: "hover:tw-border-indigo-400 focus-visible:tw-border-indigo-500 focus-visible:tw-ring-2 focus-visible:tw-ring-indigo-200/80 focus-visible:dark:tw-ring-indigo-700/30 ",
        normal: "tw-border-indigo-200 !tw-bg-[#fdfdff] focus:!tw-border-indigo-500 tw-rounded-md tw-duration-200 ",
        serch: "tw-bg-[#f0f3ff] tw-duration-200 tw-h-[46px] tw-pl-5 tw-py-[10px] tw-pr-0 ",
      },
    },
    defaultVariants: {
      variant: "ringShadow",
    },
  }
);

const Input = React.forwardRef(({ className, type, variant, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(inputVariants({ variant, className }))}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
