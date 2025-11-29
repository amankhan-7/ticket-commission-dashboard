"use client";

import Navbar from "@/components/ui/navbar";
import { useParams, useRouter } from "next/navigation";
import { useGetSingleCounterPersonQuery } from "@/utils/redux/api/adminExecutiveApi";

export default function CounterPersonDetail() {
  const { counterPersonId } = useParams();
  const router = useRouter();

  const { data, isLoading } = useGetSingleCounterPersonQuery(counterPersonId);
  const person = data?.counterPerson;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f8f9fa]">
      <Navbar />

      <main className="flex-1 px-4 sm:px-6 md:px-8 pb-24 md:pb-6">
        <div className="max-w-4xl mx-auto py-20">
          <h1 className="text-4xl pb-2 font-extrabold text-center mb-8 bg-gradient-to-r from-[#013881] via-[#004aad] to-blue-300 bg-clip-text text-transparent">
            Counter Person Details
          </h1>

          {/* Loading */}
          {isLoading && (
            <div className="text-center py-12 text-gray-500">Loading...</div>
          )}

          {/* Not Found */}
          {!isLoading && !person && (
            <div className="text-center py-12 text-gray-500 bg-white rounded-xl shadow-lg">
              No details found.
            </div>
          )}

          {/* Details */}
          {!isLoading && person && (
            <div
              className="bg-white rounded-xl shadow-lg border-t-4"
              style={{ borderTopColor: "#004AAD" }}
            >
              <div className="px-6 py-4 bg-[#004AAD] flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">
                  {person.firstName} {person.lastName}
                </h2>
              </div>

              <div className="px-6 py-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-lg font-semibold">{person.phone}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-lg font-semibold">{person.email}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="text-lg font-semibold">{person.address}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="text-lg font-semibold text-[#004AAD]">
                    {person.status || "Pending"}
                  </p>
                </div>

                {/* View Document Button */}
                {/* <div className="pt-4">
                  <a
                    href={person.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3 bg-[#004AAD] text-white rounded-lg shadow-md hover:bg-blue-700 transition font-semibold"
                  >
                    View Document
                  </a>
                </div> */}

                {/* Back Button */}
                <div className="pt-6">
                  <button
                    onClick={() =>
                      router.push(`/admin/counter/${counterPersonId}/verify`)
                    }
                    className="inline-block px-6 py-3 bg-[#004AAD] text-white rounded-lg shadow-md hover:bg-blue-700 transition font-semibold"
                  >
                    Verify Documents
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
