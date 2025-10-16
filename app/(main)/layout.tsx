import AuthContext from "@/components/context/AuthContext";
import { Navbar } from "@/components/navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthContext>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="flex flex-col items-center justify-start pt-8 px-4">
          {children}
        </main>
      </div>
    </AuthContext>
  );
}
