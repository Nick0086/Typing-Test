import * as React from "react"
import { DashIcon } from "@radix-ui/react-icons"
import { OTPInput, OTPInputContext } from "input-otp"

import { cn } from "@/lib/utils"

const InputOTP = React.forwardRef(({ className, containerClassName, ...props }, ref) => (
  <OTPInput
    ref={ref}
    containerClassName={cn("flex items-center gap-2 has-[:disabled]:opacity-50", containerClassName)}
    className={cn("disabled:tw-cursor-not-allowed", className)}
    {...props} />
))
InputOTP.displayName = "InputOTP"

const InputOTPGroup = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("tw-flex tw-items-center", className)} {...props} />
))
InputOTPGroup.displayName = "InputOTPGroup"

const InputOTPSlot = React.forwardRef(({ index, className, ...props }, ref) => {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index]

  return (
    (<div
      ref={ref}
      className={cn(
        "tw-relative tw-flex tw-h-9 tw-w-9 tw-items-center tw-justify-center tw-border-y tw-border-r tw-border-input tw-text-sm tw-shadow-sm tw-transition-all first:tw-rounded-l-md first:tw-border-l last:tw-rounded-r-md",
        isActive && "tw-z-10 tw-ring-1 tw-ring-ring",
        className
      )}
      {...props}>
      {char}
      {hasFakeCaret && (
        <div
          className="tw-pointer-events-none tw-absolute tw-inset-0 tw-flex tw-items-center tw-justify-center">
          <div
            className="tw-h-4 tw-w-px tw-animate-caret-blink tw-bg-foreground tw-duration-1000" />
        </div>
      )}
    </div>)
  );
})
InputOTPSlot.displayName = "InputOTPSlot"

const InputOTPSeparator = React.forwardRef(({ ...props }, ref) => (
  <div ref={ref} role="separator" {...props}>
    <DashIcon />
  </div>
))
InputOTPSeparator.displayName = "InputOTPSeparator"

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
