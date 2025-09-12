const Footer = () => {
  return (
    <footer className="bg-white py-6 mt-auto font-poppins dark:bg-black">
      <div className="border-t border-gray-300 mx-auto" style={{ maxWidth: '1290px' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col mt-5 sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          {/* Left - Copyright */}
          <div className="text-sm text-gray-600 dark:text-white">
            © 2025, Thatheem ul Quran. All Rights Reserved
          </div>

          {/* Center - Policy Links */}
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <a 
              href="/privacy-policy" 
              className="hover:text-gray-800 transition-colors dark:text-white"
            >
              Privacy Policy
            </a>

            <span className="text-gray-400">|</span>

            <a 
              href="/terms-and-conditions" 
              className="hover:text-gray-800 transition-colors dark:text-white"
            >
              Terms and Conditions
            </a>
          </div>

          {/* Right - Powered by */}
          <div className="text-sm text-gray-600 dark:text-white">
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
