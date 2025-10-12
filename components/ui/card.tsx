import * as React from "react";

import { cn } from "@/lib/utils";

function Card(props: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={
        cn("bg-[#1c2129] text-white flex flex-row items-center gap-3 rounded-md border border-[#2e3544] py-2 px-4 shadow-sm")
      }
      {...props}
    />
  );
}

function CardHeader(props: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={
        cn("flex items-center gap-3")
      }
      {...props}
    />
  );
}

function CardTitle(props: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("text-[#d1cab8] font-medium")}
      {...props}
    />
  );
}

function CardDescription(props: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-[#a89f8a] text-sm")}
      {...props}
    />
  );
}

function CardAction(props: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end")}
      {...props}
    />
  );
}

function CardContent(props: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6")}
      {...props}
    />
  );
}

function CardFooter(props: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6")}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
