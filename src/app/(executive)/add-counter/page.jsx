"use client";
import { useAuth } from "@/hooks/useAuth";
import AuthGuard  from "@/components/wrapper/AuthGuard";

import CreateCounter from "@/components/executive/createCounterPerson";

export default function Page() {
  const { user } = useAuth();
  const ticketExecutiveId = user?.id;

   if (!user?.id) {
    return <p>Loading...</p>; 
  }

  return (
    // <AuthGuard redirectTo="/login" requireAuth>
      <main>
        <CreateCounter ticketExecutiveId={ticketExecutiveId} />
      </main>
    // </AuthGuard>
  );
}
