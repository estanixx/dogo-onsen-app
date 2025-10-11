"use client"

import * as React from "react"
import { useRouter, usePathname } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface ServiceSearchProps {
  initialQuery?: string
}

export default function ServiceSearch({ initialQuery }: ServiceSearchProps) {
  const [value, setValue] = React.useState(initialQuery ?? "")
  const router = useRouter()
  const pathname = usePathname() || "/"

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = value.trim()
    const params = new URLSearchParams()
    if (q) params.set("q", q)
    const search = params.toString()
    const url = search ? `${pathname}?${search}` : pathname
    router.push(url)
  }


  return (
    <form onSubmit={onSubmit} className="flex gap-2" role="search" aria-label="Search services">
      <Input
        name="q"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Busca servicios..."
      />

      <Button type="submit">Buscar</Button>
    </form>
  )
}
