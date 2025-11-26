"use client";

import { useParams } from "next/navigation";
import {
  useGetCounterPersonForVerificationQuery,
  useApproveCounterPersonMutation,
  useRejectCounterPersonMutation,
  useVerifyDocumentMutation
} from "@/utils/redux/api/adminExecutiveApi";
import { toast } from "sonner";

export default function VerifyCounterPersonPage() {
  const { id } = useParams();

  const { data, isLoading, refetch } = useGetCounterPersonForVerificationQuery(id);
  const [verifyDocument] = useVerifyDocumentMutation();
  const [approve, { isLoading: approving }] = useApproveCounterPersonMutation();
  const [reject, { isLoading: rejecting }] = useRejectCounterPersonMutation();

  if (isLoading) return <div>Loading...</div>;

  const person = data;
  if (!person) return <div>Counter Person not found.</div>;

  const allDocsVerified = person.documents.every(
    (doc) => doc.status === "verified"
  );

  // Document Verify / Reject Handler
  const handleVerify = async (docId) => {
    try {
      await verifyDocument({
        counterPersonId: id,
        documentId: docId,
        body: { status: "verified" },
      }).unwrap();

      toast.success("Document verified");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to verify document");
    }
  };

  const handleRejectDoc = async (docId) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;

    try {
      await verifyDocument({
        counterPersonId: id,
        documentId: docId,
        body: { status: "rejected", rejectionReason: reason },
      }).unwrap();

      toast.success("Document rejected");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to reject document");
    }
  };


  // Approve / Reject Counter Person Handler
  const handleApprove = async () => {
    try {
      await approve(id).unwrap();
      toast.success("Counter Person Approved");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to approve");
    }
  };

  const handleRejectPerson = async () => {
    const reason = prompt("Reason for rejection:");
    if (!reason) return;

    try {
      await reject({ counterPersonId: id, reason }).unwrap();
      toast.success("Counter Person Rejected");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to reject");
    }
  };

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

            {doc.status !== "verified" && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleVerify(doc._id)}
                  className="px-3 py-1 bg-green-600 text-white rounded"
                >
                  Verify
                </button>

                <button
                  onClick={() => handleRejectDoc(doc._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Approve / Reject Counter Person */}
      <div className="mt-10 flex gap-4">
        <button
          onClick={handleApprove}
          disabled={!allDocsVerified || approving}
          className={`px-6 py-3 rounded font-semibold text-white ${
            allDocsVerified ? "bg-[#004aad]" : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {approving ? "Approving..." : "Approve Counter Person"}
        </button>

        <button
          onClick={handleRejectPerson}
          disabled={rejecting}
          className="px-6 py-3 bg-red-700 text-white rounded font-semibold"
        >
          {rejecting ? "Rejecting..." : "Reject Counter Person"}
        </button>
      </div>
    </div>
  );
}
