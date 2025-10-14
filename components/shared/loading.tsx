import { ReactNode } from 'react';
import { Spinner } from '../ui/spinner';

type LoadingProps = {
  children?: ReactNode;
};

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

export function LoadingBox({ children }: LoadingProps) {
  return (
    <div className="flex flex-col items-center p-6 border border-gray-200 rounded-lg">
      <Spinner />
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
