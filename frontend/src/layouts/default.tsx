import { Navbar } from "@/components/navbar";
import { Toast } from "@heroui/react";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // The outer layout fills the screen perfectly without spilling over
    <div className="relative grid grid-rows-[auto_1fr] h-screen w-screen overflow-hidden bg-background">
      <Toast.Provider />
      <Navbar />

      {/* FIX: Changed 'overflow-hidden' to 'overflow-y-auto' 
        This isolated main content area can now scroll continuously on touch devices, 
        while keeping your main layout boundaries and Navbar beautifully locked in place.
      */}
      <main className="w-full h-full min-h-0 overflow-y-auto scrolling-touch">
        {children}
      </main>
    </div>
  );
}
