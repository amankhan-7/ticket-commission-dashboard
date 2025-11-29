"use client";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth"; // adjust path as needed

import CreateStep from "@/components/counterPerson/createStep";
import DocumentStep from "@/components/counterPerson/documentStep";


export default function Page() {
  const { user } = useAuth();
  const userType = user?.userType; 

  const [step, setStep] = useState(0);
  const [done, setDone ] = useState(false);
  const [counterPersonId, setCounterPersonId] = useState(null);
  const [createdData, setCreatedData] = useState(null);

  // Role-based rules
  const canCreate = ["admin", "superAdmin"].includes(userType);
  const canUpload = ["counterPerson", "admin", "superAdmin"].includes(userType);


  const next = () => setStep((s) => s + 1);
  const prev = () => setStep((s) => Math.max(0, s - 1));

  // Safety check: block unauthorized users immediately
  if (!user) return <p>Unauthorized — Login required.</p>;

  return (
    <main>
      {/* STEP 0 — CREATE */}
      {step === 0 && canCreate && (
        <CreateStep
          onCreated={(id, data) => {
            setCounterPersonId(id);
            setCreatedData(data);
            next();
          }}
        />
      )}

      {/* STEP 1 — UPLOAD DOCUMENTS */}
      {step === 1 && canUpload && (
        <DocumentStep
          counterPersonId={counterPersonId}
          onAllDocsUploaded={() => setDone(true)}
          onBack={prev}
        />
      )}
      {done ? <h1>The Owner is Created now you can verify it </h1>: null}
      {/* CATCH: user hits a step they shouldn't access */}
      {((step === 0 && !canCreate) ||
        (step === 1 && !canUpload)) && (
        <p>You are not allowed to access this step.</p>
      )}
    </main>
  );
}
