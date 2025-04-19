import { useState, useEffect } from "react";
import {
  PieChart,
  Users,
  QrCode,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Doughnut } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Colors,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, Colors);

interface ScanStats {
  total: number;
  completed: number;
  pending: number;
  e3Count: number;
  e4Count: number;
  e3Scanned: number;
  e3Pending: number;
  e4Scanned: number;
  e4Pending: number;
}

interface StudentScan {
  name: string;
  email: string;
  idNumber: string;
  year: string;
  scannedAt: string;
}

const Dashboard = () => {
  const [stats, setStats] = useState<ScanStats>({
    total: 0,
    completed: 0,
    pending: 0,
    e3Count: 0,
    e4Count: 0,
    e3Scanned: 0,
    e3Pending: 0,
    e4Scanned: 0,
    e4Pending: 0,
  });

  const [recentScans, setRecentScans] = useState<StudentScan[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("api/student", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        // Process the response data
        const apiData = response.data;

        // Calculate e3Scanned, e3Pending, e4Scanned, e4Pending if not provided by API
      

        const processedStats = {
          total:apiData.total || 0,
          completed: apiData.completed || 0,
          pending: apiData.pending || 0,
          e3Count: apiData.e3Count || 0,
          e4Count: apiData.e4Count || 0,
          e3Scanned:apiData.e3Scanned || 0,
          e3Pending: apiData.e3Pending || 0,
          e4Scanned: apiData.e4Sanned || 0,
          e4Pending: apiData.e4Pending || 0,
        };

        setStats(processedStats);

        // If you have recent scans data in the API response
        if (response.data.recentScans) {
          setRecentScans(response.data.recentScans);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Data for overall scan status pie chart
  const overallScanData = {
    labels: ["Scanned", "Pending"],
    datasets: [
      {
        data: [stats.completed, stats.pending],
        backgroundColor: [
          "rgba(16, 185, 129, 0.8)", // Green for scanned
          "rgba(245, 158, 11, 0.8)", // Amber for pending
        ],
        borderColor: ["rgb(16, 185, 129)", "rgb(245, 158, 11)"],
        borderWidth: 1,
      },
    ],
  };

  // Data for E3 students pie chart
  const e3ScanData = {
    labels: ["Scanned", "Pending"],
    datasets: [
      {
        data: [stats.e3Scanned, stats.e3Pending],
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)", // Blue for scanned
          "rgba(59, 130, 246, 0.3)", // Light blue for pending
        ],
        borderColor: ["rgb(59, 130, 246)", "rgb(59, 130, 246)"],
        borderWidth: 1,
      },
    ],
  };

  // Data for E4 students pie chart
  const e4ScanData = {
    labels: ["Scanned", "Pending"],
    datasets: [
      {
        data: [stats.e4Scanned, stats.e4Pending],
        backgroundColor: [
          "rgba(139, 92, 246, 0.8)", // Purple for scanned
          "rgba(139, 92, 246, 0.3)", // Light purple for pending
        ],
        borderColor: ["rgb(139, 92, 246)", "rgb(139, 92, 246)"],
        borderWidth: 1,
      },
    ],
  };

  // Chart options for better appearance
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          font: {
            size: 12,
          },
          padding: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.label || "";
            const value = context.raw || 0;
            const total = context.dataset.data.reduce(
              (a: number, b: number) => a + b,
              0
            );
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    cutout: "65%",
  };

  // Stat cards with improved styling
  const statCards = [
    {
      label: "Total Students",
      value: stats.total,
      icon: Users,
      color: "slate",
      bgColor: "bg-slate-100",
      textColor: "text-slate-600",
    },
    {
      label: "Scanned",
      value: stats.completed,
      icon: CheckCircle,
      color: "emerald",
      bgColor: "bg-emerald-100",
      textColor: "text-emerald-600",
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: XCircle,
      color: "amber",
      bgColor: "bg-amber-100",
      textColor: "text-amber-600",
    },
    {
      label: "Completion Rate",
      value: `${
        stats.total ? Math.round((stats.completed / stats.total) * 100) : 0
      }%`,
      icon: PieChart,
      color: "indigo",
      bgColor: "bg-indigo-100",
      textColor: "text-indigo-600",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-8">
        Student Scan Dashboard
      </h1>

      {/* Mobile-optimized Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`rounded-lg shadow ${stat.bgColor} p-3 sm:p-6 transition-all hover:shadow-md`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-4">
                <Icon
                  className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.textColor} mb-1 sm:mb-0`}
                />
                <span
                  className={`text-xs font-medium ${stat.textColor} uppercase tracking-wider`}
                >
                  {stat.label}
                </span>
              </div>
              <p className="text-xl sm:text-3xl font-bold text-gray-900">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Mobile-focused Stats Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Student Scan Status
        </h2>

        {/* Overall Scan Status - Card View for Mobile */}
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-3">
            Overall Status
          </h3>
          <div className="flex flex-col sm:flex-row items-center">
            <div className="w-full sm:w-1/2 h-48 mb-4 sm:mb-0">
              <Doughnut
                data={overallScanData}
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    legend: {
                      ...chartOptions.plugins.legend,
                      position: "right",
                    },
                  },
                }}
              />
            </div>
            <div className="w-full sm:w-1/2 pl-0 sm:pl-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-emerald-50 rounded-lg p-3">
                  <div className="flex items-center mb-1">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
                    <p className="text-sm text-gray-600">Scanned</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.completed}
                  </p>
                  <p className="text-xs text-gray-500">
                    {stats.total
                      ? Math.round((stats.completed / stats.total) * 100)
                      : 0}
                    % of total
                  </p>
                </div>
                <div className="bg-amber-50 rounded-lg p-3">
                  <div className="flex items-center mb-1">
                    <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                    <p className="text-sm text-gray-600">Pending</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.pending}
                  </p>
                  <p className="text-xs text-gray-500">
                    {stats.total
                      ? Math.round((stats.pending / stats.total) * 100)
                      : 0}
                    % of total
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* E3 Students - Mobile Friendly */}
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-3">
            E3 Students ({stats.e3Count})
          </h3>
          <div className="flex flex-col sm:flex-row items-center">
            <div className="w-full sm:w-1/2 h-48 mb-4 sm:mb-0">
              <Doughnut
                data={e3ScanData}
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    legend: {
                      ...chartOptions.plugins.legend,
                      position: "right",
                    },
                  },
                }}
              />
            </div>
            <div className="w-full sm:w-1/2 pl-0 sm:pl-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="flex items-center mb-1">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    <p className="text-sm text-gray-600">Scanned</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.e3Scanned}
                  </p>
                  <p className="text-xs text-gray-500">
                    {stats.e3Count
                      ? Math.round((stats.e3Scanned / stats.e3Count) * 100)
                      : 0}
                    % of E3
                  </p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 opacity-70">
                  <div className="flex items-center mb-1">
                    <div className="w-3 h-3 rounded-full bg-blue-300 mr-2"></div>
                    <p className="text-sm text-gray-600">Pending</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.e3Pending}
                  </p>
                  <p className="text-xs text-gray-500">
                    {stats.e3Count
                      ? Math.round((stats.e3Pending / stats.e3Count) * 100)
                      : 0}
                    % of E3
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* E4 Students - Mobile Friendly */}
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-3">
            E4 Students ({stats.e4Count})
          </h3>
          <div className="flex flex-col sm:flex-row items-center">
            <div className="w-full sm:w-1/2 h-48 mb-4 sm:mb-0">
              <Doughnut
                data={e4ScanData}
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    legend: {
                      ...chartOptions.plugins.legend,
                      position: "right",
                    },
                  },
                }}
              />
            </div>
            <div className="w-full sm:w-1/2 pl-0 sm:pl-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-purple-50 rounded-lg p-3">
                  <div className="flex items-center mb-1">
                    <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                    <p className="text-sm text-gray-600">Scanned</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.e4Scanned}
                  </p>
                  <p className="text-xs text-gray-500">
                    {stats.e4Count
                      ? Math.round((stats.e4Scanned / stats.e4Count) * 100)
                      : 0}
                    % of E4
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 opacity-70">
                  <div className="flex items-center mb-1">
                    <div className="w-3 h-3 rounded-full bg-purple-300 mr-2"></div>
                    <p className="text-sm text-gray-600">Pending</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.e4Pending}
                  </p>
                  <p className="text-xs text-gray-500">
                    {stats.e4Count
                      ? Math.round((stats.e4Pending / stats.e4Count) * 100)
                      : 0}
                    % of E4
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Scans Section - Mobile Optimized */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
          Recent Scans
        </h2>
        {recentScans.length > 0 ? (
          <div>
            {/* Mobile Card View - Visible on small screens */}
            <div className="block sm:hidden space-y-3">
              {recentScans.map((scan, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium text-gray-900">
                        {scan.name}
                      </div>
                      <div className="text-xs text-gray-500">{scan.email}</div>
                    </div>
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${
                        scan.year === "E3"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {scan.year}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>ID: {scan.idNumber}</span>
                    <span>
                      {new Date(scan.scannedAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Table View - Hidden on small screens, visible on larger screens */}
            <div className="hidden sm:block overflow-hidden rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Student
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      ID Number
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Year
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Scan Time
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentScans.map((scan, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {scan.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {scan.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {scan.idNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            scan.year === "E3"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {scan.year}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(scan.scannedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <QrCode className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
            <p className="text-gray-600">No recent scans to display.</p>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              Scan QR codes will appear here once they are processed.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
