import Navbar from "@/components/layout/navbar";

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="mt-5 px-3">{children}</div>
    </>
  );
}
