import React from 'react';
import { Languages } from 'lucide-react';

const About = () => {
  return (
    <div className="w-full mx-auto min-h-screen p-6 bg-white dark:bg-black">
            <div className="max-w-5xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 dark:text-white">About Us</h1>
        <div className="w-full h-px bg-gray-200 "></div>
      </div>

      {/* Content */}
      <div className=" dark:text-white text-gray-800 leading-relaxed">
        <p className="text-base">
          The Holy Qur'an is the magnificent message bestowed upon humanity by the Creator of the universe, Allah. It transcends time, 
          making it eternally relevant. Therefore, digital access to the Holy Qur'an holds great significance.
        </p>

        <p className="text-base dark:text-white">
          The aim of this mobile application, which provides access to the commentary 'Tafheem-ul-Qur'an' authored by Syed Abul A'la 
          Maududi, is to facilitate the study of the Qur'an's profound meanings using digital tools.
        </p>

        <p className="text-base dark:text-white">
          Currently, the Tafheem-ul-Qur'an is available in Urdu, English, and Malayalam. It is hoped that translations in other languages will be 
          included soon.
        </p>

        <p className="text-base dark:text-white">
          Efforts are being made to utilize various digital features to ensure readers can easily access the rich insights of the Tafheem-ul-
          Qur'an.
        </p>

        <p className="text-base dark:text-white">
          May Allah reward and bless all those who contributed to this endeavour with abundant rewards. Ameen.
        </p>

        {/* Language Feature */}
        <div className="flex items-center mt-8 pt-4">
          <div className="rounded-lg p-2 mr-3" style={{ backgroundColor: '#2AA0BF' }}>
            <Languages className="w-6 h-6 text-white" />
          </div>
          <span className="text-lg font-medium dark:text-white" style={{ color: '#2AA0BF' }}>
            Available in multiple language
          </span>
        </div>
      </div>
      </div>

    </div>
  );
};

export default About;