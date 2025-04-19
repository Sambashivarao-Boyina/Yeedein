import React from "react";
import { Link } from "react-router-dom";
import { QrCode, BarChart3, UtensilsCrossed } from "lucide-react";

const Home: React.FC = () => {
  return (
    <div className="flex flex-col w-full min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="p-4 sm:p-6 text-center">
        <div className="flex items-center justify-center mb-2">
          <UtensilsCrossed className="w-8 h-8 text-indigo-600 mr-2" />
          <h1 className="text-3xl sm:text-4xl font-bold text-indigo-800">
            Yeedein
          </h1>
        </div>
        <p className="text-gray-600 mt-1">Food Token Management System</p>
      </header>

      {/* Main Content */}
      <main className="flex flex-col flex-1 items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Card Header */}
          <div className="bg-indigo-600 p-6 text-white text-center">
            <h2 className="text-xl font-semibold">Welcome to Yeedein</h2>
            <p className="text-indigo-100 mt-1 text-sm">
              Select an option to continue
            </p>
          </div>

          {/* Card Content */}
          <div className="p-6 space-y-6">
            <Link to="/scanner" className="block w-full">
              <button className="flex items-center justify-center gap-3 w-full p-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1">
                <QrCode className="w-5 h-5" />
                <span className="font-medium">Scan Token</span>
              </button>
            </Link>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            <Link to="/dashboard" className="block w-full">
              <button className="flex items-center justify-center gap-3 w-full p-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1">
                <BarChart3 className="w-5 h-5" />
                <span className="font-medium">View Dashboard</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-md mt-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="text-blue-600 text-lg font-semibold mb-1">
              Scanner
            </div>
            <p className="text-gray-600 text-sm">
              Scan QR codes to validate food tokens
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="text-indigo-600 text-lg font-semibold mb-1">
              Dashboard
            </div>
            <p className="text-gray-600 text-sm">
              View statistics and manage tokens
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-gray-600 text-sm">
        <p>© {new Date().getFullYear()} Yeedein Food Token System</p>
      </footer>
    </div>
  );
};

export default Home;
