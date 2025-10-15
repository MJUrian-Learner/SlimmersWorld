import { SlimmersLogo } from "@/components/slimmers-logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <SlimmersLogo className="mb-8" />
        {children}
      </div>
    </div>
  );
}
