"use client";

import { useParams } from "next/navigation";
import {
  useGetCounterPersonForVerificationQuery,
  useVerifyDocumentMutation,
  useApproveCounterPersonMutation,
  useRejectCounterPersonMutation,
} from "@/utils/redux/api/adminExecutiveApi"; 

export default function VerifyCounterPersonPage() {
  const { id } = useParams();

  const { data, isLoading } = useGetCounterPersonForVerificationQuery(id);
  const [verifyDocument] = useVerifyDocumentMutation();
  const [approve] = useApproveCounterPersonMutation();
  const [reject] = useRejectCounterPersonMutation();

  if (isLoading) return <div>Loading...</div>;

  const person = data?.counterPerson;

  return (
    <div className="max-w-6xl mx-auto px-4 py-20">
      <h1 className="text-3xl font-bold mb-6">
        Verify Counter Person: {person.firstName} {person.lastName}
      </h1>

      {/* Documents */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <h2 className="text-xl font-bold mb-4">Documents</h2>

        {person.documents.map((doc) => (
          <div
            key={doc._id}
            className="p-4 border rounded mb-4 flex justify-between items-center"
          >
            <div>
              <p className="font-semibold capitalize">{doc.type}</p>
              <p className="text-sm text-gray-600">Status: {doc.status}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() =>
                  verifyDocument({
                    counterPersonId: id,
                    documentId: doc._id,
                    status: "verified",
                  })
                }
                className="px-3 py-1 bg-green-600 text-white rounded"
              >
                Verify
              </button>

              <button
                onClick={() => {
                  const reason = prompt("Enter rejection reason:");
                  if (!reason) return;
                  verifyDocument({
                    counterPersonId: id,
                    documentId: doc._id,
                    status: "rejected",
                    rejectionReason: reason,
                  });
                }}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* APPROVE / REJECT PERSON */}
      <div className="mt-10 flex gap-4">
        <button
          onClick={() => approve(id)}
          disabled={!allDocsVerified}
          className="px-6 py-3 bg-[#004aad] text-white rounded font-semibold"
        >
          Approve Counter Person
        </button>

        <button
          onClick={() => {
            const reason = prompt("Reason for rejection:");
            if (!reason) return;
            reject({ counterPersonId: id, reason });
          }}
          className="px-6 py-3 bg-red-700 text-white rounded font-semibold"
        >
          Reject Counter Person
        </button>
      </div>
    </div>
  );
}
