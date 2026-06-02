import { Navbar } from "@/components/navbar";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Grid maps exact boundaries so children cannot overflow the page layout context
    <div className="relative grid grid-rows-[auto_1fr] h-screen w-screen overflow-hidden bg-background">
      <Navbar />
      {/* Container yields to internal elements and leaves full content-height flow */}
      <main className="w-full h-full min-h-0 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
