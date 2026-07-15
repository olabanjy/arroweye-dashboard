import React from "react";
import { FiWifiOff } from "react-icons/fi";
import { useNoNetwork } from "./hooks/use-no-network";

interface NoNetworkProps {
  onReconnect: () => void;
}

const NoNetwork: React.FC<NoNetworkProps> = ({ onReconnect }) => {
  const { isChecking, handleRetry } = useNoNetwork(onReconnect);

  return (
    <div className="w-full min-h-[450px] flex items-center justify-center font-IBM select-none py-12">
      <div className="w-full max-w-sm px-6 text-center">
        {/* Minimal Outline Icon */}
        <div className="mb-6 flex justify-center text-[#7c7e81]">
          <FiWifiOff size={36} strokeWidth={1.5} />
        </div>

        {/* High-contrast Typography matching system scheme */}
        <h2 className="text-[20px] font-[600] text-[#212529] tracking-tight mb-2 font-IBM">
          No Internet Connection
        </h2>

        <p className="text-[14px] text-[#7c7e81] leading-relaxed mb-8 font-IBM">
          We couldn't connect to the server. Please check your Wi-Fi or cellular connection and try again.
        </p>

        {/* System styled green button */}
        <button
          onClick={handleRetry}
          disabled={isChecking}
          className="mx-auto h-[48px] px-8 flex items-center justify-center rounded-full bg-[#03a835] hover:bg-opacity-90 active:scale-[0.98] text-white text-[15px] font-[500] transition-all disabled:opacity-50 disabled:pointer-events-none shadow-sm"
        >
          {isChecking ? (
            <div className="flex items-center gap-2">
              <svg
                className="h-4 w-4 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Retrying...</span>
            </div>
          ) : (
            <span>Retry Connection</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default NoNetwork;
