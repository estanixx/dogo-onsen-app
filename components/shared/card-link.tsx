'use client';

import Link from 'next/link';
import { CardButton } from './card-button';
import * as React from 'react';

interface CardLinkProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

/**
 * A link button component used across the app for option selection with redirection.
 */
export function CardLink({ title, description, icon, href }: CardLinkProps) {
  return (
    <Link href={href}>
      <CardButton title={title} description={description} icon={icon} />
    </Link>
  );
}
