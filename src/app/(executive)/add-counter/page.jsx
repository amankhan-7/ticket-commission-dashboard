"use client";
import { useAuth } from "@/hooks/useAuth";
import AuthGuard  from "@/components/wrapper/AuthGuard";

import CreateStep from "@/components/counterPerson/createStep";

export default function Page() {
  const { user } = useAuth();
  const counterPersonId = user?.id;

  return (
    <AuthGuard redirectTo="/login" requireAuth>
      <main>
        <CreateStep ticketExecutiveId={counterPersonId} />
      </main>
    </AuthGuard>
  );
}
