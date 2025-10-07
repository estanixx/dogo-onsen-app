'use client';

import * as React from 'react';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';

interface CardButtonProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick?: () => void;
}
/**
 * A card button component
 * Used along the app for option selection.
 */

export function CardButton({ title, description, icon, onClick = () => {} }: CardButtonProps) {
  return (
    <Card
      onClick={onClick}
      className={
        'cursor-pointer flex flex-col items-start gap-3 p-6 rounded-2xl shadow-md transition duration-300 hover:shadow-lg hover:scale-105 hover:bg-muted/40 active:scale-96'
      }
    >
      <span className="size-6 text-primary">{icon}</span>
      <div className="flex flex-col">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </div>
    </Card>
  );
}
