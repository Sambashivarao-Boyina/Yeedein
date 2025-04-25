import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  GraduationCap,
  Check,
  X,
  Clock,
  Search,
  Loader,
  AlertCircle,  
  Coffee,
  IceCream,
} from "lucide-react";

// Define the type for our API response
interface UserData {
  _id: string;
  email: string;
  idNumber: string;
  year: string;
  isCheckIn: boolean;
  checkInTime: string | null;
  checkInScannedBy: string | null;
  isTakenFood: boolean;
  foodTakenAt: string | null;
  foodScannedBy: string | null;
  isTakenIcecream: boolean;
  iceCreamTakenAt: string | null;
  iceCreamScannedBy: string | null;
}

const StudentSearch = () => {
  const navigate = useNavigate();
  const [idNumber, setIdNumber] = useState("");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!idNumber.trim()) {
      setError("Please enter an ID number");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Replace with your actual API endpoint
      const response = await axios.get(`/api/student/${idNumber}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.data;
      setUserData(data);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Scanning failed, please try again";
      toast.error(errorMessage);
      setUserData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      {/* Header - Responsive and sticky */}
      <div className="sticky top-0 bg-white shadow-md z-10 p-4 flex items-center border-b border-gray-200">
        <button
          onClick={handleGoBack}
          className="mr-3 p-2 hover:bg-gray-100 rounded-full transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Go back"
        >
          <ArrowLeft size={20} className="text-blue-600" />
        </button>
        <h1 className="text-lg sm:text-xl font-semibold text-blue-800">
          Student ID Search
        </h1>
      </div>

      {/* Main Content */}
      <div className="p-4 md:p-6 flex-grow max-w-4xl mx-auto w-full">
        {/* Search Card */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-col gap-3">
            <div className="relative">
              <input
                type="text"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                placeholder="Enter ID Number"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
              />
              <div className="absolute left-3 top-3 text-gray-400">
                <Search size={18} />
              </div>
            </div>
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition duration-200 disabled:bg-blue-400 shadow-sm flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Loader size={18} className="animate-spin mr-2" />
                  Searching...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <Search size={18} className="mr-2" />
                  Search
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-200 flex items-center">
            <AlertCircle size={18} className="mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* User Data Card */}
        {userData && (
          <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-200 shadow-md transition-all duration-300 ease-in-out">
            <h2 className="text-lg md:text-xl font-semibold text-blue-800 mb-4 flex items-center">
              <User size={20} className="mr-2 text-blue-600" />
              Student Information
            </h2>

            <div className="space-y-4">
              {/* Basic Information */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <h3 className="text-sm uppercase text-blue-700 font-medium mb-3">
                  Basic Details
                </h3>
                <InfoItem
                  label="ID Number"
                  value={userData.idNumber}
                  icon={<User size={16} />}
                />

                <InfoItem
                  label="Email"
                  value={userData.email}
                  icon={<Mail size={16} />}
                />

                <InfoItem
                  label="Year"
                  value={userData.year}
                  icon={<GraduationCap size={16} />}
                  noBorder={true}
                />
              </div>

              {/* Status Cards - Grid layout for desktop */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {/* Check-in Card */}
                <StatusCard
                  title="Check-in"
                  icon={<User size={18} />}
                  isCompleted={userData.isCheckIn}
                  completedTime={
                    userData.checkInTime
                      ? formatDate(userData.checkInTime)
                      : null
                  }
                  completedBy={userData.checkInScannedBy}
                />

                {/* Food Card */}
                <StatusCard
                  title="Food"
                  icon={<Coffee size={18} />}
                  isCompleted={userData.isTakenFood}
                  completedTime={
                    userData.foodTakenAt
                      ? formatDate(userData.foodTakenAt)
                      : null
                  }
                  completedBy={userData.foodScannedBy}
                />

                {/* Ice Cream Card */}
                <StatusCard
                  title="Ice Cream"
                  icon={<IceCream size={18} />}
                  isCompleted={userData.isTakenIcecream}
                  completedTime={
                    userData.iceCreamTakenAt
                      ? formatDate(userData.iceCreamTakenAt)
                      : null
                  }
                  completedBy={userData.iceCreamScannedBy}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Reusable info item component
const InfoItem = ({
  label,
  value,
  icon = null,
  noBorder = false,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  noBorder?: boolean;
}) => (
  <div
    className={`flex flex-col sm:flex-row sm:justify-between py-3 ${
      noBorder ? "" : "border-b border-blue-100"
    }`}
  >
    <span className="font-medium text-gray-700 flex items-center mb-1 sm:mb-0">
      {icon && <span className="mr-2 text-blue-600">{icon}</span>}
      {label}
    </span>
    <span className="text-gray-800 break-all sm:text-right">{value}</span>
  </div>
);

// Enhanced status card component
const StatusCard = ({
  title,
  icon,
  isCompleted,
  completedTime,
  completedBy,
}: {
  title: string;
  icon: React.ReactNode;
  isCompleted: boolean;
  completedTime: string | null;
  completedBy: string | null;
}) => {
  return (
    <div
      className={`p-4 rounded-xl ${
        isCompleted
          ? "bg-green-50 border border-green-200"
          : "bg-gray-50 border border-gray-200"
      } transition-all duration-300 hover:shadow-md`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold flex items-center text-gray-800">
          <span
            className={`mr-2 ${
              isCompleted ? "text-green-600" : "text-gray-600"
            }`}
          >
            {icon}
          </span>
          {title}
        </h3>
        <span
          className={`text-sm font-medium px-2 py-1 rounded-full ${
            isCompleted
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          } flex items-center`}
        >
          {isCompleted ? (
            <>
              <Check size={14} className="mr-1" />
              Completed
            </>
          ) : (
            <>
              <X size={14} className="mr-1" />
              Pending
            </>
          )}
        </span>
      </div>

      {isCompleted ? (
        <div className="space-y-2 text-sm">
          {completedTime && (
            <div className="flex items-center text-gray-700">
              <Clock size={14} className="text-blue-500 mr-1 flex-shrink-0" />
              <div>
                <span className="font-medium mr-1">Time:</span>
                <span className="break-all">{completedTime}</span>
              </div>
            </div>
          )}

          {completedBy && (
            <div className="flex items-center text-gray-700">
              <User size={14} className="text-blue-500 mr-1 flex-shrink-0" />
              <div>
                <span className="font-medium mr-1">By:</span>
                <span className="break-all">{completedBy}</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-sm text-gray-500 italic">No data available</div>
      )}
    </div>
  );
};

export default StudentSearch;
