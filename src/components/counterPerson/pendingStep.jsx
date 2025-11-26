"use client";

import { useGetPendingCounterPersonsQuery } from "@/utils/redux/api/adminExecutiveApi";

export default function PendingStep() {
  const { data, isLoading } = useGetPendingCounterPersonsQuery();

  return <h1>Pending Comimission</h1>;
}
