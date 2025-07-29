export default function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004aad] mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Loading SmallBus
        </h2>
        <p className="text-gray-600">
          Please wait while we prepare your experience...
        </p>
      </div>
    </div>
  );
}
