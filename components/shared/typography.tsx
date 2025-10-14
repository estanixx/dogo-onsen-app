import React, { JSX } from 'react';

type TypographyProps<T extends keyof JSX.IntrinsicElements> = React.ComponentPropsWithoutRef<T> & {
  children: React.ReactNode;
};

export function H1(props: TypographyProps<'h1'>) {
  const { children, className = '', ...rest } = props;
  return (
    <h1 className={`font-titles text-4xl font-bold leading-tight mb-4 ${className}`} {...rest}>
      {children}
    </h1>
  );
}

export function H2(props: TypographyProps<'h2'>) {
  const { children, className = '', ...rest } = props;
  return (
    <h2 className={`font-titles text-3xl font-semibold leading-snug mb-3 ${className}`} {...rest}>
      {children}
    </h2>
  );
}

export function H3(props: TypographyProps<'h3'>) {
  const { children, className = '', ...rest } = props;
  return (
    <h3 className={`font-titles text-2xl font-medium leading-snug mb-2 ${className}`} {...rest}>
      {children}
    </h3>
  );
}

export function H4(props: TypographyProps<'h4'>) {
  const { children, className = '', ...rest } = props;
  return (
    <h4 className={`font-titles text-xl font-medium leading-snug mb-1 ${className}`} {...rest}>
      {children}
    </h4>
  );
}

export function Em(props: TypographyProps<'em'>) {
  const { children, className = '', ...rest } = props;
  return (
    <em className={`font-base itali ${className}`} {...rest}>
      {children}
    </em>
  );
}

export function P(props: TypographyProps<'p'>) {
  const { children, className = '', ...rest } = props;
  return (
    <p className={`font-base text-base leading-relaxed mb-2 ${className}`} {...rest}>
      {children}
    </p>
  );
}
