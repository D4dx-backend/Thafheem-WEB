import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, CheckCircle } from 'lucide-react';

const ApiStatusBanner = () => {
  const [apiStatus, setApiStatus] = useState('checking'); // 'checking', 'online', 'offline'
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        // Test the Thafheem API endpoint
        const response = await fetch('/api/thafheem/suranames/all', {
          method: 'HEAD', // Just check if endpoint responds
          signal: AbortSignal.timeout(5000) // 5 second timeout
        });
        
        if (response.ok) {
          setApiStatus('online');
          setIsVisible(false);
        } else {
          setApiStatus('offline');
          setIsVisible(true);
        }
      } catch (error) {
        console.warn('Thafheem API is offline, using fallback data:', error.message);
        setApiStatus('offline');
        setIsVisible(true);
      }
    };

    // Check API status on mount
    checkApiStatus();

    // Check every 5 minutes
    const interval = setInterval(checkApiStatus, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible || apiStatus === 'checking') {
    return null;
  }

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-yellow-400 mr-3" />
          <div>
            <p className="text-sm text-yellow-800">
              <strong>API Service Notice:</strong> The primary Thafheem API is currently unavailable. 
              The app is using backup data sources to ensure continued functionality.
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-yellow-400 hover:text-yellow-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default ApiStatusBanner;

