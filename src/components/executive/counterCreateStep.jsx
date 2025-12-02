"use client";
import { useState, useEffect } from "react";
import { useCreateCounterPersonMutation } from "@/utils/redux/api/adminExecutiveApi";
import BottomNav from "@/components/ui/BottomNav";
import { useAuth } from "@/hooks/useAuth";
import { PageSkeleton } from "../ui/skeletons";
import ExecutiveNavbar from "@/components/ui/executiveNavbar";
import Navbar from "@/components/ui/navbar";

export default function CreateCounterPersonPage({ ticketExecutiveId }) {
  const { isLoading: authLoading, userType } = useAuth();
  console.log(ticketExecutiveId);
  const [form, setForm] = useState({
    tenentId: "",
    ticketExecutiveId: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    pin: "",
    commissionRate: 5,
  });

  // Sync ticketExecutiveId once available
  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      ticketExecutiveId: ticketExecutiveId || "",
    }));
  }, [ticketExecutiveId]);

  const [createCounterPerson, { isLoading: isCounterCreating }] =
    useCreateCounterPersonMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.ticketExecutiveId) {
      alert("Error: ticketExecutiveId is missing.");
      return;
    }

    try {
      await createCounterPerson(form).unwrap();
      alert("Counter Person Created");
    } catch (err) {
      alert(err?.data?.message || "Error creating counter person");
    }
  };

  // block UI until auth loads
  if (authLoading || !userType) {
    return (
      <div className="flex items-center justify-center h-screen">
        <PageSkeleton />
      </div>
    );
  }

  const inputClass =
    "w-full px-2 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#004AAD] transition";

  // fields the user can edit — secure and clean
  const editableFields = [
    "tenentId",
    "firstName",
    "lastName",
    "phone",
    "email",
    "pin",
    "commissionRate",
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-20">
      {/* conditional navbar */}
      {userType === "counterPerson" ? (
        <BottomNav />
      ) : userType === "ticketExecutive" ? (
        <ExecutiveNavbar />
      ) : (
        <Navbar />
      )}

      <main className="flex-1 px-4 sm:px-6 md:px-8 pb-24 md:pb-6 lg:ml-18">
        <h1 className="text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-[#013881] via-[#004aad] to-blue-300 bg-clip-text text-transparent">
          Add Counter Officer
        </h1>

        <div
          className="bg-white rounded-xl shadow-lg p-8 border-t-4"
          style={{ borderTopColor: "#004AAD" }}
        >
          <h2 className="text-2xl font-bold mb-6 text-[#004AAD]">
            Create Counter Person
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* hidden: never user-editable */}
            <input type="hidden" value={form.ticketExecutiveId} />

            {editableFields.map((key) => (
              <div key={key}>
                <label className="block text-sm font-semibold text-gray-700 mb-1 capitalize">
                  {key.replace(/([A-Z])/g, " $1")}
                </label>

                <input
                  type={key === "commissionRate" ? "number" : "text"}
                  className={inputClass}
                  placeholder={key}
                  value={form[key]}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      [key]:
                        key === "commissionRate"
                          ? Number(e.target.value)
                          : e.target.value,
                    })
                  }
                />
              </div>
            ))}

            <div className="col-span-1 md:col-span-2 mt-4">
              <button
                disabled={isCounterCreating}
                className="w-full py-4 rounded-lg text-white font-bold text-lg transition-all hover:opacity-90 shadow-md"
                style={{ background: "#004AAD" }}
              >
                {isCounterCreating ? "Creating..." : "Create Counter Person"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
