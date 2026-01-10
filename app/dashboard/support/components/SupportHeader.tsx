import { Headphones } from "lucide-react";

export default function SupportHeader() {
  return (
    <div className="flex items-center gap-3">
      <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
        <Headphones className="h-6 w-6 text-white" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage customer queries and support requests
        </p>
      </div>
    </div>
  );
}
