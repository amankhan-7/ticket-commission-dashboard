"use client";
import { useState } from "react";
import {
  useGetCounterPersonDocumentsQuery,
  useUploadDocumentMutation,
  useDeleteDocumentMutation,
} from "@/utils/redux/api/adminExecutiveApi";
import BottomNav from "@/components/ui/BottomNav"
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import LoadingPage from "@/components/loading";
import { skipToken } from "@reduxjs/toolkit/query";

export default function DocumentsStep() {
  const { user } = useAuth();
  const id = user?.id;

  const { data, isLoading } = useGetCounterPersonDocumentsQuery(
    id ? id : skipToken
  );
  console.log(data?.data?.counterPerson.firstName);

  const [uploadDocument, { isLoading: uploading }] =
    useUploadDocumentMutation();
  const [deleteDocument] = useDeleteDocumentMutation();

  const [hasUploadError, setHasUploadError] = useState(false);
  const [file, setFile] = useState(null);
  const [type, setType] = useState("");

  const upload = async () => {
    if (!file || !type) return;

    try {
      setHasUploadError(false);

      await uploadDocument({
        counterPersonId: id,
        documentType: type,
        file,
      }).unwrap();
      toast.success("Documents uploded successfully")
      setFile(null);
      setType("");
    } catch (error) {
      setHasUploadError(true);
      toast.error("Document upload failed");
    }
  };

  const deleteDoc = async (documentId) => {
    await deleteDocument({
      counterPersonId: id,
      documentId,
    }).unwrap();
  };

  if (!id) return <LoadingPage />;
  if (isLoading) return <LoadingPage />;

  return (
   <div className="min-h-screen flex flex-col md:flex-row bg-[#f8f9fa]">
  <BottomNav /> {/* moved outside main */}
  <main className="flex-1 px-4 sm:px-6 md:px-8 pb-24 md:pb-6 lg:ml-18">
    {/* PAGE HEADING */}
    <h1 className="text-2xl md:text-4xl mt-25 font-extrabold text-center mb-8 bg-gradient-to-r from-[#013881] via-[#004aad] to-blue-300 bg-clip-text text-transparent">
      Documents for {data?.data?.counterPerson.firstName}
    </h1>

    <div className="md:w-5xl md:flex md:flex-col md:ml-48">

     {/* UPLOAD CARD */}
    <div
      className="bg-white  rounded-xl shadow-lg p-8 border-t-4 mb-8"
      style={{ borderTopColor: "#004AAD" }}
    >
      <h2 className="text-2xl font-bold text-[#004AAD] mb-6">
        Upload Document
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Document Type
          </label>
          <select
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004AAD]"
            onChange={(e) => setType(e.target.value)}
            value={type}
          >
            <option value="">Select Type</option>
            <option value="aadhaar">Aadhaar</option>
            <option value="pan">Pan</option>
            <option value="license">License</option>
            <option value="photo">Photo</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            File
          </label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full px-4 py-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#004AAD]"
          />
        </div>

        <div className="flex items-end">
          {uploading ? (
            <div className="w-8 h-8 border-4 border-gray-300 border-t-[#004AAD] rounded-full animate-spin mx-auto"></div>
          ) : hasUploadError ? (
            <div className="text-red-600 font-semibold flex items-end">
              Upload failed — fix the issue and try again.
            </div>
          ) : (
            <button
              onClick={upload}
              className="w-full py-3 rounded-lg text-white font-bold shadow-md hover:opacity-90 transition"
              style={{ background: "#004AAD" }}
            >
              Upload
            </button>
          )}
        </div>
      </div>
    </div>

    {/* DOCUMENT LIST CARD */}
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="px-6 py-4 bg-[#004AAD]">
        <h2 className="text-2xl font-bold text-white">Uploaded Documents</h2>
      </div>

      {(!data?.documents || data.documents.length === 0) && (
        <div className="px-6 py-12 text-center text-gray-500">
          No documents uploaded yet.
        </div>
      )}

      <div className="divide-y divide-gray-200">
        {data?.data?.documents?.map((doc) => (
          <div
            key={doc._id}
            className="px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition"
          >
            <div>
              <p className="text-lg font-semibold capitalize">{doc.type}</p>
              <p className="text-sm text-gray-600">Status: {doc.status}</p>
            </div>

            <button
              onClick={() => deleteDoc(doc._id)}
              className="px-4 py-2 text-white rounded-lg text-sm font-bold shadow-md hover:opacity-90"
              style={{ background: "#c53030" }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>

    </div>

   

  </main>
</div>

  );
}
