"use client";


import { useGetPendingCounterPersonsQuery } from "@/utils/redux/api/adminExecutiveApi";

export default function PendingStep() {
  const { data, isLoading } = useGetPendingCounterPersonsQuery();

  return (
    // <AdminGuard>
      <div className="max-w-6xl mx-auto px-4 py-20">
        <main className="flex-1 px-4 sm:px-6 md:px-8 pb-24 md:pb-6 lg:ml-18">

          <h1 className="text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-[#013881] via-[#004aad] to-blue-300 bg-clip-text text-transparent">
            Pending Counter Persons
          </h1>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-10 text-gray-500">Loading...</div>
          )}

          {/* Empty State */}
          {!isLoading && (!data?.counterPersons || data.counterPersons.length === 0) && (
            <div className="text-center py-12 text-gray-500 bg-white rounded-xl shadow-lg">
              No pending counter persons.
            </div>
          )}

          {/* List Container */}
          {!isLoading && data?.counterPersons?.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg border-t-4"
                 style={{ borderTopColor: "#004AAD" }}>
              
              <div className="px-6 py-4 bg-[#004AAD]">
                <h2 className="text-2xl font-bold text-white">Pending List</h2>
              </div>

              <div className="divide-y divide-gray-200">
                {data.counterPersons.map((person) => (
                  <div
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
        </main>
      </div>
//</AdminGuard> 
  );
}
