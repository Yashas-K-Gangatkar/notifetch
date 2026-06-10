import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-md px-4">
        <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Button asChild className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </div>
  );
}
