import { Heart, Mail, Facebook, Instagram, Youtube, Play, Apple } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import googlePlayBadge from '../assets/google-play-badge.png';
import appStoreBadge from '../assets/app-store-badge.png';

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'About', path: '/about' },
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Contact', path: '/contact' },
  ];

  const socialLinks = [
    {
      icon: Instagram,
      href: 'https://instagram.com/thafheemulquran_app',
      label: 'Instagram',
    },
    {
      icon: Facebook,
      href: 'https://facebook.com/ThafheemulQuran',
      label: 'Facebook',
    },
    {
      icon: Youtube,
      href: 'https://youtube.com/@thafheemulquranapp',
      label: 'YouTube',
    },
    {
      icon: Play,
      href: 'https://play.google.com/store/apps/details?id=com.d4media.thafheem',
      label: 'Play Store',
    },
    {
      icon: Apple,
      href: 'https://apps.apple.com/in/app/thafheem-ul-quran/id1292572556',
      label: 'App Store',
    },
  ];


  return (
    <footer className="relative bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-black py-8 mt-auto font-poppins border-t border-gray-200 dark:border-gray-800">
      {/* Decorative gradient line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#62C3DC] via-[#2596be] to-[#1e7a9a]"></div>

      <div className="max-w-[1290px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* Brand Section */}
          <div className="flex flex-col items-center md:items-start space-y-3">
            <h3 className="text-lg font-bold bg-gradient-to-r from-[#2596be] to-[#62C3DC] bg-clip-text text-transparent">
              Thafheem ul Quran
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center md:text-left max-w-xs">
            It opens the Qur’an to the mind and the heart so we may understand,reflect, and live by it
            </p>
            <button
              onClick={() => window.open('https://app.thafheem.net/', '_blank')}
              className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#2596be] to-[#1e7a9a] hover:from-[#1e7a9a] hover:to-[#2596be] text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-cyan-500/30 hover:scale-105 active:scale-95"
            >
              <Heart className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Support Us</span>
            </button>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start space-y-3">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Quick Links
            </h4>
            <nav className="flex flex-col space-y-2">
              {quickLinks.map((link, index) => (
                <button
                  key={index}
                  onClick={() => navigate(link.path)}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#2596be] dark:hover:text-[#62C3DC] transition-colors duration-200 text-center md:text-left hover:translate-x-1 transform"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Social Links */}
          <div className="flex flex-col items-center md:items-start space-y-3">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Connect With Us
            </h4>
            <div className="flex gap-3 flex-wrap">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="group p-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gradient-to-br hover:from-[#62C3DC] hover:to-[#2596be] hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30 hover:scale-110 active:scale-95"
                  >
                    <Icon className="w-4 h-4 transition-transform group-hover:rotate-12" />
                  </a>
                );
              })}
            </div>
            <a
              href="mailto:mail@d4dx.co"
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-[#2596be] dark:hover:text-[#62C3DC] transition-colors duration-200"
            >
              <Mail className="w-4 h-4" />
              <span>support@thafheem.net</span>
            </a>
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <a
                href="https://play.google.com/store/apps/details?id=com.d4media.thafheem"
                target="_blank"
                rel="noopener noreferrer"
                className="group transition-all duration-300 hover:-translate-y-0.5 hover:scale-105"
              >
                <img
                  src={googlePlayBadge}
                  alt="Get it on Google Play"
                  className="h-12 w-auto object-contain"
                />
              </a>
              <a
                href="https://apps.apple.com/in/app/thafheem-ul-quran/id1292572556"
                target="_blank"
                rel="noopener noreferrer"
                className="group transition-all duration-300 hover:-translate-y-0.5 hover:scale-105"
              >
                <img
                  src={appStoreBadge}
                  alt="Download on the App Store"
                  className="h-12 w-auto object-contain"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-800 my-6"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          {/* Copyright */}
          <div className="text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left">
            © {currentYear} Thafheem ul Quran. All Rights Reserved
          </div>

          {/* Powered by */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Crafted with{' '}
            <Heart className="inline w-3.5 h-3.5 text-red-500 fill-current animate-pulse" />{' '}
            by{' '}
            <a
              href="https://d4dx.co/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold bg-gradient-to-r from-[#2596be] to-[#62C3DC] bg-clip-text text-transparent hover:from-[#62C3DC] hover:to-[#2596be] transition-all duration-300"
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
