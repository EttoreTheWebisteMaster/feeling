"use client"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useTransition } from "react"
import {
  deleteCollection,
  toggleCollectionAvailability,
} from "../../_actions/collections"
import { useRouter } from "next/navigation"

export function ActiveToggleDropdownItem({
  id,
  isAvailable,
}: Readonly<{
  id: string
  isAvailable: boolean
}>) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  return (
    <DropdownMenuItem
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await toggleCollectionAvailability(id, !isAvailable)
          router.refresh()
        })
      }}
    >
      {isAvailable ? "Deactivate" : "Activate"}
    </DropdownMenuItem>
  )
}

export function DeleteDropdownItem({
  id,
  disabled,
}: Readonly<{
  id: string
  disabled: boolean
}>) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  return (
    <DropdownMenuItem
      variant="destructive"
      disabled={disabled || isPending}
      onClick={() => {
        startTransition(async () => {
          await deleteCollection(id)
          router.refresh()
        })
      }}
    >
      Delete
    </DropdownMenuItem>
  )
}
