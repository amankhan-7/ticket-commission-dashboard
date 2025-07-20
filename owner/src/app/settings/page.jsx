"use client";

import BottomNav from "@/components/UI/BottomNav";
import { FaSignOutAlt } from "react-icons/fa";
import { useState } from "react";

export default function SettingsPage() {
  const [Account, setAccount] = useState({
    name: "",
    phone: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Settings saved successfully!");
    setAccount({
      name: "",
      phone: "",
    });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f8f9fa]">
      {/* Sidebar Navigation */}
      <BottomNav />

      {/* Page Content */}
      <main className="flex-1 px-4 sm:px-6 md:px-8 pb-24 md:pb-6 lg:ml-18">
        {/* Header */}
        <div className="bg-white p-4 mt-4 md:mt-8 rounded-lg shadow mb-6 max-w-5xl mx-auto w-full flex flex-col md:flex-row md:justify-between">
          <h1 className="text-xl font-semibold text-[#004aad] mb-4 md:mb-0">
            Settings
          </h1>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#004aad] text-white flex items-center justify-center font-semibold">
              AR
            </div>
            <div>
              <div className="font-medium text-gray-800">Ankush Raj</div>
              <div className="text-sm text-gray-500">Bus Owner</div>
            </div>
          </div>
        </div>

        {/* Settings Form */}
        <section className="bg-white rounded-[12px] p-6 mb-6 shadow max-w-5xl mx-auto w-full">
          <h2 className="text-[#004aad] mb-4 text-lg font-semibold">
            Account Settings
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 mb-6">
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={Account.name}
                  onChange={(e) =>
                    setAccount({ ...Account, [e.target.name]: e.target.value })
                  }
                  autoComplete="name"
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-800 transition duration-200 ease-in-out text-gray-700"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  value={Account.phone}
                  onChange={(e) =>
                    setAccount({ ...Account, [e.target.name]: e.target.value })
                  }
                  type="tel"
                  autoComplete="tel"
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-800 transition duration-200 ease-in-out text-gray-700"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 items-start">
              <button
                type="submit"
                className="bg-[#004aad] text-white mb-4 px-4 py-2 rounded-sm text-xs font-base hover:bg-blue-900 transition duration-200 ease-in-out"
              >
                Save Changes
              </button>

              <button
                type="button"
                className="flex items-center gap-2 bg-white text-gray-600 text-xs font-base border border-gray-300 rounded-md px-3 py-2 hover:bg-[#f5f7fa] cursor-pointer transition duration-200"
              >
                <FaSignOutAlt className="text-sm" />
                Logout
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
