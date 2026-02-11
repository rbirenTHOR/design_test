"use client"

import React from "react"
import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface FilterGroupProps {
  id: string
  label: string
  defaultOpen?: boolean
  children: React.ReactNode
  className?: string
}

export function FilterGroup({
  id,
  label,
  defaultOpen = true,
  children,
  className,
}: FilterGroupProps) {
  return (
    <Accordion
      type="multiple"
      defaultValue={defaultOpen ? [id] : []}
      className={cn("border-b border-light-grey", className)}
    >
      <AccordionItem value={id} className="border-none">
        <AccordionTrigger
          className={cn(
            "px-0 py-3 font-heading text-xs font-bold uppercase tracking-wider text-dark-grey",
            "hover:text-darkest-grey hover:no-underline",
            "[&[data-state=open]>svg]:rotate-180",
          )}
        >
          {label}
        </AccordionTrigger>
        <AccordionContent className="pb-4 pt-0">
          {children}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

interface FilterGroupContainerProps {
  groups: {
    id: string
    label: string
    defaultOpen?: boolean
    content: React.ReactNode
  }[]
  className?: string
}

export function FilterGroupContainer({
  groups,
  className,
}: FilterGroupContainerProps) {
  const defaultOpenIds = groups
    .filter((g) => g.defaultOpen !== false)
    .map((g) => g.id)

  return (
    <Accordion
      type="multiple"
      defaultValue={defaultOpenIds}
      className={cn("space-y-0", className)}
    >
      {groups.map((group) => (
        <AccordionItem
          key={group.id}
          value={group.id}
          className="border-b border-light-grey last:border-none"
        >
          <AccordionTrigger
            className={cn(
              "px-0 py-3 font-heading text-xs font-bold uppercase tracking-wider text-dark-grey",
              "hover:text-darkest-grey hover:no-underline",
            )}
          >
            {group.label}
          </AccordionTrigger>
          <AccordionContent className="pb-4 pt-0">
            {group.content}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
