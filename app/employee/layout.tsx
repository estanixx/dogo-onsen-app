import Navbar from "@/components/layout/navbar";
import { DogoPage } from "@/components/shared/dogo-ui";

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DogoPage> 
        <Navbar />
        <div className="mt-26 px-3">{children}</div>
      </DogoPage>
    </>
  );
}
