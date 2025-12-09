import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Mail, Phone, MapPin, Globe, ExternalLink } from 'lucide-react';

const Contact = () => {
  const { translationLanguage } = useTheme();
  const isMalayalam = translationLanguage === 'mal';

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 font-poppins">
      <div className="max-w-[1070px] w-full mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold text-gray-900 mb-4 dark:text-white ${isMalayalam ? 'font-malayalam' : ''}`}>
            {isMalayalam ? 'ഞങ്ങളെ ബന്ധപ്പെടുക' : 'Contact Us'}
          </h1>
          <div className="h-px bg-gray-200 dark:bg-gray-700"></div>
        </div>

        {/* Content */}
        <div className="dark:text-white text-gray-800 leading-relaxed">
          <div className="prose prose-base dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              {isMalayalam 
                ? 'ഞങ്ങളുടെ സേവനങ്ങളെക്കുറിച്ച് കൂടുതൽ അറിയാൻ അല്ലെങ്കിൽ എന്തെങ്കിലും ചോദ്യങ്ങൾക്ക് ഞങ്ങളെ ബന്ധപ്പെടാം.'
                : 'Feel free to reach out to us for any questions or inquiries about our services.'}
            </p>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Mail className="w-6 h-6 text-[#2AA0BF] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {isMalayalam ? 'ഇമെയിൽ' : 'Email'}
                  </h3>
                  <a 
                    href="mailto:mail@d4dx.co" 
                    className="text-[#2AA0BF] hover:underline dark:text-[#4FAEC7]"
                  >
                    mail@d4dx.co
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Phone className="w-6 h-6 text-[#2AA0BF] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {isMalayalam ? 'ഫോൺ' : 'Phone'}
                  </h3>
                  <a 
                    href="tel:+919946666139" 
                    className="text-[#2AA0BF] hover:underline dark:text-[#4FAEC7]"
                  >
                    (+91) 9946 666 139
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Globe className="w-6 h-6 text-[#2AA0BF] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {isMalayalam ? 'വെബ്സൈറ്റ്' : 'Website'}
                  </h3>
                  <a 
                    href="https://d4dx.co" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#2AA0BF] hover:underline dark:text-[#4FAEC7] flex items-center gap-1"
                  >
                    d4dx.co
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <MapPin className="w-6 h-6 text-[#2AA0BF] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {isMalayalam ? 'വിലാസം' : 'Address'}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Atharwala Apartment,<br />
                    First Floor, 5/3520G, (44/1342),<br />
                    Mavoor Road, Thiruthiyad,<br />
                    Kozhikode, Kerala 673004
                  </p>
                </div>
              </div>
            </div>

            {/* Privacy Policy Link */}
            <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <a 
                href="https://d4dx.co/privacy-policy/" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2AA0BF] hover:underline dark:text-[#4FAEC7] flex items-center gap-2"
              >
                <span>{isMalayalam ? 'സ്വകാര്യതാ നയം' : 'Privacy Policy'}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;


