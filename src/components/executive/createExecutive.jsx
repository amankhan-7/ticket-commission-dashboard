"use client";
import { useState } from "react";
import { useCreateTicketExecutiveMutation } from "@/utils/redux/api/executiveApi";
import Navbar from "@/components/ui/BottomNav";
import AuthGuard from "@/components/wrapper/AuthGuard";
import { toast } from "sonner";

export default function CreateTicketExecutivePage({ onCreated }) {
  const [form, setForm] = useState({
    tenentId: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    pin: "",
    bankAccountNumber: "",
    bankName: "",
    ifscCode: "",
  });

  const [createTicketExecutive, { isLoading }] =
    useCreateTicketExecutiveMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Build body properly for backend
    const body = {
      tenentId: form.tenentId,
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone,
      email: form.email,
      pin: form.pin,
      bankDetails: {
        accountNumber: form.bankAccountNumber || undefined,
        bankName: form.bankName || undefined,
        ifsc: form.ifscCode || undefined,
      },
    };

    try {
      const result = await createTicketExecutive(body).unwrap();
      const newExecutive = result?.data?.ticketExecutive;

      if (onCreated) {
        onCreated(newExecutive?.id, newExecutive);
      }

      alert("Ticket Executive Created Successfully");
    } catch (err) {
      toast(err?.data?.message || "Error creating ticket executive");
    }
  };

  const inputClass =
    "w-full px-2 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#004AAD] transition";

  return (
    // <AuthGuard>
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f8f9fa]">
      <Navbar />

      <main className="flex-1 px-4 sm:px-6 md:px-8 pb-24 md:pb-6 lg:ml-18">
        <h1 className="text-2xl md:text-4xl mt-20 font-extrabold text-center mb-8 bg-gradient-to-r from-[#013881] via-[#004aad] to-blue-300 bg-clip-text text-transparent">
          Add Ticket Executive
        </h1>

        <div className="md:flex md:flex-col md:items-center md:gap-8">
          <div
            className="bg-white md:w-4xl rounded-xl shadow-lg p-8 border-t-4"
            style={{ borderTopColor: "#004AAD" }}
          >
            <h2 className="text-2xl font-bold mb-6 text-[#004AAD]">
              Create Ticket Executive
            </h2>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {[
                "tenentId",
                "firstName",
                "lastName",
                "phone",
                "email",
                "pin",
              ].map((key) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1 capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder={key}
                    value={form[key]}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                    required
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Bank Account Number
                </label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Account Number"
                  value={form.bankAccountNumber}
                  onChange={(e) =>
                    setForm({ ...form, bankAccountNumber: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Bank Name"
                  value={form.bankName}
                  onChange={(e) =>
                    setForm({ ...form, bankName: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  IFSC Code
                </label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="IFSC Code"
                  value={form.ifscCode}
                  onChange={(e) =>
                    setForm({ ...form, ifscCode: e.target.value })
                  }
                />
              </div>

              <div className="col-span-1 md:col-span-2 mt-4">
                <button
                  disabled={isLoading}
                  className="w-full py-4 rounded-lg text-white font-bold text-lg transition-all hover:opacity-90 shadow-md"
                  style={{ background: "#004AAD" }}
                >
                  {isLoading ? "Creating..." : "Create Ticket Executive"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
    // </AuthGuard>
  );
}
