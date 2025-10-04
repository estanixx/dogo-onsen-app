import { ReactNode } from "react";
import { SpiritInfo } from "@/components/room/shared/spirit-info";

interface RoomLayoutProps {
  children: ReactNode;
  params: {
    id: string;
  };
}

/**
 * Layout for room-specific pages
 * Includes a left sidebar with spirit information and account details
 */
export default function RoomLayout({ children, params }: RoomLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left sidebar with spirit info */}
      <aside className="w-72 bg-indigo-900 text-white p-6">
        <SpiritInfo spiritId={params.id} />
      </aside>

      {/* Main content area */}
      <main className="flex-1 overflow-y-auto p-6">
        {children}
      </main>
    </div>
  );
}
