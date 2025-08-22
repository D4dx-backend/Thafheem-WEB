const Footer = () => {
    return (
      <footer className="bg-white border-t border-gray-100 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            {/* Left - Copyright */}
            <div className="text-sm text-gray-600">
              © 2025, Thatheem ul Quran . All Rights Reserved
            </div>
  
            {/* Center - Policy Links */}
            <div className="flex items-center space-x-6">
              <a 
                href="/privacy-policy" 
                className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Privacy Policy
              </a>
              <a 
                href="/terms-and-conditions" 
                className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Terms and conditions
              </a>
            </div>
  
            {/* Right - Powered by */}
            <div className="text-sm text-gray-600">
              Powered by{' '}
              <a 
                href="#" 
                className="text-cyan-500 hover:text-cyan-600 font-medium transition-colors"
              >
                Q4DX
              </a>
            </div>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;