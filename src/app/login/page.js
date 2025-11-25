
import Link from 'next/link';

function Page() {
  return (
    <div className="h-full flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Login as</h1>
      <div className="flex flex-col gap-4">
        <Link href="/login/counterPerson">
          <button
            className="bg-[#004aad] text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Counter Person
          </button>
        </Link>
        <Link href="/login/ticketExecutive">
          <button
            className="bg-[#004aad] text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Ticket Executive
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Page;
