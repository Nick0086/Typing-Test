import * as React from "react"
import { clsx } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

const twMerge = extendTailwindMerge({
    prefix: 'tw-',
})

export function cn(...inputs) {
    return twMerge(clsx(inputs))
}

export function getValidChildren(children) {
    return React.Children.toArray(children).filter((child) =>
        React.isValidElement(child)
    )
}

export async function copyToClipboard(value) {
    navigator.clipboard.writeText(value);
  }