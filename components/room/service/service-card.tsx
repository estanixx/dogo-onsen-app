"use client"

import { Service } from "@/lib/types";
import * as React from "react";
import Image from "next/image";

interface ServiceCardProps  {
    service: Service;
    onSelect?: (service: Service) => void;
}

export function ServiceCard({ service, onSelect }: ServiceCardProps) {
    const handleClick = () => onSelect?.(service);

    const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect?.(service);
        }
    };

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            className="w-full max-w-xs rounded-md border overflow-hidden shadow-md cursor-pointer focus:outline-none"
            style={{
                background: "linear-gradient(180deg, var(--card), var(--dark))",
                borderColor: "var(--border)",
                color: "var(--card-foreground)",
                boxShadow: "var(--shadow)",
            }}
        >
            {/* Image */}
                    <div className="relative h-40 w-full bg-[color]" style={{ background: 'var(--dark-light)' }}>
                        {service.image ? (
                            <Image
                                src={service.image}
                                alt={service.name}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-sm" style={{ color: 'var(--muted-foreground)' }}>
                                No image
                            </div>
                        )}
                    </div>

            {/* Content */}
            <div className="p-3">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h3 className="text-base font-semibold" style={{ color: 'var(--gold)' }}>
                            {service.name}
                        </h3>
                        <p className="text-sm mt-1" style={{ color: 'var(--gold-light)' }}>
                            {service.eiltRate} EILT
                        </p>
                    </div>

                    <div className="flex items-center">
                        <span
                            className="text-xs px-2 py-1 rounded"
                            style={{
                                background: 'var(--primary)',
                                color: 'var(--primary-foreground)',
                                fontWeight: 600,
                            }}
                        >
                            View
                        </span>
                    </div>
                </div>

                {/* Optional description / actions could go here */}
            </div>
        </div>
    );
}