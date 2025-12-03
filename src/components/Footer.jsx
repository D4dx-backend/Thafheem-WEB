import { Heart, Mail, Facebook, Instagram, Youtube, PlayCircle, Apple } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'About', path: '/about' },
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Help', path: '/help' },
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
  ];

  const storeButtons = [
    {
      name: 'Google Play',
      subtitle: 'Get it on',
      href: 'https://play.google.com/store/apps/details?id=com.d4media.thafheem',
      badgeClass:
        'bg-gradient-to-r from-[#1fc4a6] via-[#27b0ff] to-[#8f63ff] text-white hover:shadow-cyan-400/30',
      textClass: 'text-white',
      icon: (
        <svg
          className="w-4 h-4"
          viewBox="0 0 512 512"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M33 32.6C29.3 36.3 27 42.8 27 51.9v408.3c0 9.1 2.3 15.6 6 19.3l1.9 1.9 229.6-229.6v-.8L33 32.6z"
            fill="#27b0ff"
          />
          <path
            d="m357.1 178.2-92.7 92.7v.8l92.7 92.7 42.6-24.3c12.2-6.9 19.6-17.5 19.6-29.5V231.9c0-12-7.4-22.6-19.6-29.5l-42.6-24.2z"
            fill="#1fc4a6"
          />
          <path
            d="M288 272.1 33 496.5c7.4 7.4 19.4 8.3 33 1.1l291.1-166.5z"
            fill="#8f63ff"
          />
          <path
            d="M357.1 338.1 357.1 338.1 357.1 338.1 357.1 338.1 357.1 338.1 445 288c18-11.4 18-29.9 0-41.3l-87.9-50.1-92.7 92.7z"
            fill="#ff9c3f"
          />
        </svg>
      ),
    },
    {
      name: 'App Store',
      subtitle: 'Download on the',
      href: 'https://apps.apple.com/in/app/thafheem-ul-quran/id1292572556',
      badgeClass:
        'bg-white text-gray-900 dark:bg-white/10 dark:text-white hover:shadow-slate-300/40',
      textClass: 'text-gray-900 dark:text-white',
      icon: (
        <svg
          className="w-4 h-4"
          viewBox="0 0 512 512"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M349.1 46.7c-25.2 1.5-54.9 18.3-72.7 39.9-15.9 19.3-29.7 48.6-24.4 77.1 27.6 2.2 56.1-15.5 73-37.5 16.9-22.1 29.1-51.9 24.1-79.5zm91.4 247.5c-1.1-1.1-66-36.7-66-108.7 0-58.2 44.6-84.7 46.6-85.9-25.4-37.3-64.4-42.5-78.1-43.2-33-3.3-64.1 19.1-80.4 19.1-16.1 0-43.2-18.6-70.9-18.1-36.6.6-70.4 21.1-89.2 54-38 65.9-9.7 162.6 27.6 215.8 18.3 26 39.8 55 68.6 54 27.4-1.1 37.8-17.4 70.9-17.4 33.1 0 42.3 17.4 70.9 16.9 29.3-.6 47.8-26.6 66-52.6 20.8-31 29.4-61 30-62.4z"
            fill="currentColor"
          />
        </svg>
      ),
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
              Experience the Quran with modern interpretation and study tools
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
              href="mailto:support@thafheem.net"
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-[#2596be] dark:hover:text-[#62C3DC] transition-colors duration-200"
            >
              <Mail className="w-4 h-4" />
              <span>support@thafheem.net</span>
            </a>
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              {storeButtons.map((store) => (
                <a
                  key={store.name}
                  href={store.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex items-center justify-center gap-3 px-5 py-3 rounded-2xl shadow-lg transition-all duration-300 w-full sm:w-auto ${store.badgeClass} hover:-translate-y-0.5`}
                >
                  <div className="flex items-center justify-center p-2 rounded-xl bg-white/10 backdrop-blur-sm motion-safe:animate-pulse group-hover:animate-none transition-transform duration-500 group-hover:scale-110">
                    {store.icon}
                  </div>
                  <div className="text-left leading-tight">
                    <p className={`text-[11px] uppercase tracking-[0.2em] ${store.textClass} opacity-80`}>
                      {store.subtitle}
                    </p>
                    <p className={`text-base font-semibold ${store.textClass}`}>
                      {store.name}
                    </p>
                  </div>
                </a>
              ))}
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
