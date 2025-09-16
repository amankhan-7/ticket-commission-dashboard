import { useState, useRef } from "react";

export default function MultiStepBusForm({
  showForm,
  setShowForm,
  editMode,
  handleSubmit,
  busData,
  handleChange,
  showFormRef,
}) {
  //   const showFormRef = useRef(null);

  // Step configuration
  const steps = [
    "Bus Information",
    "Route & Pricing",
    "Registration & Compliance",
  ];
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    showForm && (
      <section
        className="bg-white rounded-[12px] p-6 mt-10 mb-6 shadow max-w-5xl mx-auto w-full animate-fadeInUp"
        ref={showFormRef}
      >
        <h2 className="text-[#004aad] mb-4 text-lg font-semibold">
          {editMode ? "Update Bus" : "Add New Bus"}
        </h2>

        {/* Progress Header */}
        <div className="text-center flex mb-6 items-center justify-center">
          {/* Mobile View: Only show current step */}
          <h2 className="text-lg md:hidden font-demobold text-white bg-primary rounded-full py-1 px-4">
            {currentStep + 1}. {steps[currentStep]}
          </h2>

          {/* Desktop View: Show all steps */}
          <div className="hidden md:flex items-center gap-22">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center relative">
                {/* Circle with step number */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    index === currentStep
                      ? "bg-primary text-white font-bold"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {index + 1}
                </div>

                {/* Step name */}
                <div className="mt-2 text-center text-md text-gray-600">
                  {step}
                </div>

                {/* Connecting line (except for last step) */}
                {index !== steps.length - 1 && (
                  <div className="absolute top-5 left-19 w-52 h-1 bg-gray-300 z-0"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Multi-step Form */}
        <form onSubmit={handleSubmit} className="space-y-6 animate-fadeInUp">
          {/* STEP 1: BUS INFORMATION */}
          {currentStep === 0 && (
            <>
              <InputField
                id="busName"
                label="Bus Name"
                value={busData.busName}
                onChange={handleChange}
                placeholder="Enter bus name"
              />
              <InputField
                id="busNumber"
                label="Bus Number"
                value={busData.busNumber}
                onChange={handleChange}
                placeholder="Enter bus number"
              />
              <SelectField
                id="busType"
                label="Bus Type"
                value={busData.busType}
                onChange={handleChange}
                options={["AC", "Non-AC"]}
              />
              <InputField
                id="totalSeats"
                label="Total Seats"
                type="number"
                value={busData.totalSeats}
                onChange={handleChange}
                placeholder="e.g., 40"
              />
              <InputField
                id="seatingCapacity"
                label="Seating Capacity"
                type="number"
                value={busData.seatingCapacity}
                onChange={handleChange}
                placeholder="e.g., 40"
              />
            </>
          )}

          {/* STEP 2: ROUTE & PRICING */}
          {currentStep === 1 && (
            <>
              <InputField
                id="baseRouteFrom"
                label="Route From"
                value={busData.baseRouteFrom}
                onChange={handleChange}
                placeholder="Enter starting location"
              />
              <InputField
                id="baseRouteTo"
                label="Route To"
                value={busData.baseRouteTo}
                onChange={handleChange}
                placeholder="Enter destination location"
              />
              <InputField
                id="basePrice"
                label="Ticket Price"
                type="number"
                value={busData.basePrice}
                onChange={handleChange}
                placeholder="Enter ticket price"
              />
            </>
          )}

          {/* STEP 3: REGISTRATION & COMPLIANCE */}
          {currentStep === 2 && (
            <>
              <InputField
                id="registrationNumber"
                label="Registration Number"
                value={busData.registrationNumber}
                onChange={handleChange}
                placeholder="e.g., MH01AB1234"
              />
              <InputField
                id="yearOfManufacture"
                label="Year of Manufacture"
                type="number"
                min="1990"
                max={new Date().getFullYear()}
                value={busData.yearOfManufacture}
                onChange={handleChange}
                placeholder="e.g., 2022"
              />
              <InputField
                id="insuranceExpiry"
                label="Insurance Expiry"
                type="date"
                value={busData.insuranceExpiry}
                onChange={handleChange}
              />
              <InputField
                id="permitExpiry"
                label="Permit Expiry"
                type="date"
                value={busData.permitExpiry}
                onChange={handleChange}
              />
              <InputField
                id="amenities"
                label="Amenities (optional)"
                value={busData.amenities}
                onChange={handleChange}
                placeholder="e.g., USB Charging, WiFi"
              />
            </>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            {currentStep > 0 ? (
              <button
                type="button"
                onClick={prevStep}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Back
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
            )}

            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-900"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                {editMode ? "Update Bus" : "Add Bus"}
              </button>
            )}
          </div>
        </form>
      </section>
    )
  );
}

/* Reusable Input Field */
function InputField({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  ...props
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block mb-2 text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        {...props}
        className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
      />
    </div>
  );
}

/* Reusable Select Field */
function SelectField({ id, label, value, onChange, options }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block mb-2 text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <select
        id={id}
        name={id}
        value={value || ""}
        onChange={onChange}
        className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
