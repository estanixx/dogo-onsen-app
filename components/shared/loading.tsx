import { ReactNode } from 'react';
import { Spinner } from '../ui/spinner';
import clsx from 'clsx';

type LoadingProps = {
  children?: ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

export function LoadingBar({ children }: LoadingProps) {
  return (
    <div className="flex items-center gap-2">
      <Spinner />
      <div className="flex-1 h-1 bg-gray-200 rounded">
        {/* Simulated loading bar */}
        <div className="w-2/5 h-full bg-gray-500 rounded transition-all duration-500" />
      </div>
      {children}
    </div>
  );
}

export function LoadingBox({ children, ...rest }: LoadingProps) {
  return (
    <div
      {...rest}
      className={clsx(
        'flex flex-col items-center justify-center p-6 border border-gray-200 rounded-lg',
        rest.className,
      )}
    >
      <Spinner className="size-10" />
      <div className="mt-3">{children}</div>
    </div>
  );
}

export function SimpleLoading({ children }: LoadingProps) {
  return (
    <div className="flex items-center gap-2">
      <Spinner />
      <span>Loading...</span>
      {children}
    </div>
  );
}
