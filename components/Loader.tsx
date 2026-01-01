import React from 'react';

const Loader = () => {
    return (
        <div className="flex items-center justify-center w-full h-full min-h-[50vh]">
            <div className="relative w-16 h-16">
                {/* Outer ring */}
                <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-800 rounded-full"></div>

                {/* Spinning ring */}
                <div className="absolute top-0 left-0 w-full h-full border-4 border-yellow-500 rounded-full border-t-transparent animate-spin"></div>

                {/* Inner glowing pulse */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-yellow-500/20 rounded-full animate-pulse"></div>
            </div>
            <span className="sr-only">Loading...</span>
        </div>
    );
};

export default Loader;
