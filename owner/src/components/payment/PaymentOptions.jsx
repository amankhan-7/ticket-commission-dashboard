"use client";
import { SiRazorpay } from "react-icons/si";

export const paymentMethods = [
  {
    id: "razorpay",
    icon: <SiRazorpay className="w-6 h-6 text-[#004aad]" />,
    title: "Razorpay",
    description: "Pay securely using Razorpay gateway",
  },
];

export default function PaymentOptions() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Payment Method</h3>
      <div className="space-y-3">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-[#004aad] transition-colors cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              {method.icon}
              <div>
                <h4 className="font-medium text-gray-900">{method.title}</h4>
                <p className="text-sm text-gray-500">{method.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
