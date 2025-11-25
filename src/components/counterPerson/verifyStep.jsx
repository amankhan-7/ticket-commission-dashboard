"use client";

import { useAuth } from "@/hooks/useAuth";
import {
  useGetCounterPersonForVerificationQuery,
  useDeleteDocumentMutation,
} from "@/utils/redux/api/adminExecutiveApi";

export default function VerifyPage({ counterPersonId }) {
  const {userType} = useAuth();

  const { data, isLoading } =
    useGetCounterPersonForVerificationQuery(counterPersonId);

  const [deleteDocument] = useDeleteDocumentMutation();

  if (isLoading)
    return <div className="text-center py-10 text-gray-500">Loading...</div>;

  if (!data?.data?.counterPerson) return <div>Not found</div>;

  const person = data.data.counterPerson;
  const documents = data.data.documents || [];

  const canDelete = ["counterPerson", "admin", "superAdmin"].includes(userType);

  const handleDelete = async (documentId) => {
    try {
      await deleteDocument({ counterPersonId, documentId }).unwrap();
      alert("Deleted successfully");
    } catch (e) {
      alert("Error deleting document");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-20">
      <main className="flex-1 px-4 sm:px-6 md:px-8 pb-24 md:pb-6 lg:ml-18">
        <h1 className="text-4xl pb-3 font-extrabold text-center mb-8 bg-gradient-to-r from-[#013881] via-[#004aad] to-blue-300 bg-clip-text text-transparent">
          Verify Counter Person
        </h1>

        {/* PERSON DETAILS */}
        <div
          className="bg-white rounded-xl shadow-lg p-8 border-t-4 mb-8"
          style={{ borderTopColor: "#004AAD" }}
        >
          <h2 className="text-2xl font-bold text-[#004AAD] mb-6">
            Personal Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Detail label="First Name" value={person.firstName} />
            <Detail label="Last Name" value={person.lastName} />
            <Detail label="Phone" value={person.phone} />
            <Detail label="Status" value={person.status} />
          </div>
        </div>

        {/* DOCUMENTS */}
        <div
          className="bg-white shadow-lg"
          style={{ borderTopColor: "#004AAD" }}
        >
          <div className="px-6 py-4 bg-[#004AAD] rounded-t-2xl">
            <h2 className="text-2xl font-bold text-white">Documents</h2>
          </div>

          {!documents.length ? (
            <div className="px-6 py-12 text-center text-gray-500">
              No documents uploaded.
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {documents.map((doc) => (
                <div
                  key={doc._id}
                  className="px-6 py-4 hover:bg-gray-50 transition"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-lg font-semibold capitalize">
                        {doc.type}
                      </p>
                      <p className="text-sm text-gray-600">
                        Status: {doc.status}
                      </p>
                    </div>

                    <div className="flex gap-4 items-center">
                      {doc.documentUrl && (
                        <a
                          href={doc.documentUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#004AAD] font-semibold underline text-sm"
                        >
                          View
                        </a>
                      )}

                      {canDelete && (
                        <button
                          onClick={() => handleDelete(doc._id)}
                          className="text-red-600 font-semibold text-sm hover:underline"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-sm font-semibold text-gray-600">{label}</p>
      <p className="text-lg font-bold text-black mt-1">{value || "—"}</p>
    </div>
  );
}
