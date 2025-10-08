import Navbar from "@/components/layout/navbar";
import { DogoPage } from "@/components/shared/dogo-ui";

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div>
        <Navbar />
      </div>
      <DogoPage> 
        <div className="mt-5 px-3">{children}</div>
      </DogoPage>
    </>
  );
}
