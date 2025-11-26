"use client";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/wrapper/AuthGuard";
import DocumentsStep from "@/components/counterPerson/documentStep";

export default function Page() {
  const router = useRouter();
  const { user, userType, isAuthenticated, loading } = useAuth();

  const counterPersonId = user?.id;

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) return <div>Loading...</div>;

 

  return (
    <AuthGuard redirectTo="/login" requireAuth>
      <main>
        
          <DocumentsStep counterPersonId={counterPersonId} />
       
      </main>
    </AuthGuard>
  );
}
