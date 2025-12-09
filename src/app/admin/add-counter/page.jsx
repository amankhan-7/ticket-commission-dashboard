"use client";

import { useAuth } from "@/hooks/useAuth";
import { useParams, useSearchParams } from "next/navigation";
import CreateCounterPerson from "@/components/executive/createCounterPerson";

export default function AddCounterPage() {

  const searchParams = useSearchParams();
  const ticketExecutiveId = searchParams.get("executiveId");




  return (
    <main>
      <CreateCounterPerson ticketExecutiveId={ticketExecutiveId} />
    </main>
  );
}
