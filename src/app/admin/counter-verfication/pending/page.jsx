"use client";

import Navbar from "@/components/ui/navbar";
import { useGetPendingCounterPersonsQuery } from "@/utils/redux/api/adminExecutiveApi";
import { useRouter } from "next/navigation";

export default function AdminPendingPage() {
  const { data, isLoading } = useGetPendingCounterPersonsQuery();
  const router = useRouter();
  const pending = data?.counterPersons || [];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f8f9fa]">
      <Navbar />

      <main className="flex-1 px-4 sm:px-6 md:px-8 pb-24 md:pb-6">
        <div className="max-w-6xl mx-auto py-20">
          <h1 className="text-4xl pb-2 font-extrabold text-center mb-8 bg-gradient-to-r from-[#013881] via-[#004aad] to-blue-300 bg-clip-text text-transparent">
            Pending Counter Persons
          </h1>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-10 text-gray-500">Loading...</div>
          )}

          {/* Empty State */}
          {!isLoading && pending.length === 0 && (
            <div className="text-center py-12 text-gray-500 bg-white rounded-xl shadow-lg">
              No pending counter persons.
            </div>
          )}

          {/* Pending List */}
          {!isLoading && pending.length > 0 && (
            <div
              className="bg-white rounded-xl shadow-lg border-t-4"
              style={{ borderTopColor: "#004AAD" }}
            >
              <div className="px-6 py-4 bg-[#004AAD]">
                <h2 className="text-2xl font-bold text-white">Pending List</h2>
              </div>

              <div className="divide-y divide-gray-200">
                {pending.map((person) => (
                  <div
                    onClick={() =>
                      router.push(
                        `/admin/counter/${person._id}`
                      )
                    }
                    key={person._id}
                    className="px-6 py-4 hover:bg-gray-50 transition flex justify-between items-center"
                  >
                    <div>
                      <p className="text-lg font-semibold text-black">
                        {person.firstName} {person.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{person.phone}</p>
                    </div>

                    <div className="text-sm font-medium text-[#004AAD]">
                      Pending Approval
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
