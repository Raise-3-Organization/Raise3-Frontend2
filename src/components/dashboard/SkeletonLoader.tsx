import React from "react";


const SkeletonLoader = () => {
    return (
      <div className="border border-gray-800 rounded-lg p-4 animate-pulse">
        <div className="flex justify-between items-start">
          <div>
            <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          </div>
          <div className="h-6 bg-gray-700 rounded-full w-16"></div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <div className="h-4 bg-gray-700 rounded w-1/4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/6"></div>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div className="bg-gray-700 h-2 rounded-full w-3/4"></div>
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center text-sm">
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          <div className="h-6 bg-gray-700 rounded w-16"></div>
        </div>
      </div>
    );
  };

  export default SkeletonLoader;