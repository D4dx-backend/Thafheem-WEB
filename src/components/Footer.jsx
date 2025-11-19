const Footer = () => {
  return (
    <footer className="bg-white py-6 mt-auto font-poppins dark:bg-gray-900">
      <div className="border-t border-gray-300 mx-auto max-w-[1290px]"></div>

      <div className="max-w-[1290px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col mt-5 sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          {/* Left - Copyright */}
          <div className="text-sm sm:text-base text-gray-600 dark:text-white">
            © 2025, Thatheem ul Quran. All Rights Reserved
          </div>

          {/* Center - Policy Links */}
          <div className="flex items-center space-x-4 text-sm sm:text-base text-gray-600">
            <a 
              href="/privacy-policy" 
              className="hover:text-gray-800 transition-colors dark:text-white min-h-[44px] flex items-center"
            >
              Privacy Policy
            </a>

            <span className="text-gray-400">|</span>

            <a 
              href="/terms-and-conditions" 
              className="hover:text-gray-800 transition-colors dark:text-white min-h-[44px] flex items-center"
            >
              Terms and Conditions
            </a>
          </div>

          {/* Right - Powered by */}
          <div className="text-sm sm:text-base text-gray-600 dark:text-white">
            Powered by{' '}
            <a 
              href="https://d4dx.co/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-cyan-500 hover:text-cyan-600 font-medium transition-colors"
            >
              D4DX
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
