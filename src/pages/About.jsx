import React from 'react';
import { Languages } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ENGLISH_ABOUT = `
  <p>
    The Holy Qur'an is the magnificent message bestowed upon humanity by the Creator of the universe, Allah. It transcends time, 
    making it eternally relevant. Therefore, digital access to the Holy Qur'an holds great significance.
  </p>

  <p>
    The aim of this mobile application, which provides access to the commentary 'Tafheem-ul-Qur'an' authored by Syed Abul A'la 
    Maududi, is to facilitate the study of the Qur'an's profound meanings using digital tools.
  </p>

  <p>
    Currently, the Tafheem-ul-Qur'an is available in Urdu, English, and Malayalam. It is hoped that translations in other languages will be 
    included soon.
  </p>

  <p>
    Efforts are being made to utilize various digital features to ensure readers can easily access the rich insights of the Tafheem-ul- 
    Qur'an.
  </p>

  <p>
    May Allah reward and bless all those who contributed to this endeavour with abundant rewards. Ameen.
  </p>
`;

const URDU_ABOUT = `
  <div dir="rtl" style="text-align: right;">
    <p>
      قرآن کریم کائنات کے خالق اللہ کی طرف سے انسانیت کو دیا گیا سب سے بڑا پیغام ہے۔ یہ بے وقت ہے۔ اس لیے قرآن پاک کی ڈیجیٹل پڑھائی بہت اہمیت کی حامل ہے۔ سید ابوالاعلیٰ مودودی کی تحریر کردہ تفسیری کتاب 'تفہیم القرآن' کی ڈیجیٹل ایپلی کیشن کا مقصد قرآن مجید کے تصورات کے مطالعہ کے لیے ڈیجیٹل سہولیات کا زیادہ سے زیادہ استعمال کرنا ہے۔
    </p>

    <p>
      اس موبائل ایپلی کیشن میں فی الحال تفہیم القرآن کی چھ زبانیں شامل ہیں، یعنی اردو، انگریزی، ملیالم، ہندی، تامل اور بنگلہ۔ اس میں اردو اور ملیالم ترجمہ کی آڈیو بھی دستیاب کرائی گئی ہے۔ امید ہے کہ جلد ہی دیگر زبانوں میں تفہیم کے تراجم بھی اس میں شامل کیے جائیں گے۔ یہ بھی ایک عاجزانہ کوشش ہے کہ ڈیجیٹل سسٹمز کی مختلف سہولیات سے استفادہ کرتے ہوئے تفہیم القرآن کی معلوماتی دولت کو قارئین تک باآسانی پہنچانے کے لیے تمام ممکنہ ذرائع استعمال کیے جائیں۔
    </p>

    <p>
      تفہیم القرآن کا پہلا ڈیجیٹل ورژن 2008 میں جاری کیا گیا تھا۔ اس کے بعد 2016 میں جاری ہونے والے دوسرے ورژن میں تفہیم ملیالم ترجمہ کی مکمل آڈیو شامل تھی۔ تفہیم القرآن کی توسیع کا تیسرا مرحلہ 2025 میں مکمل ہوگا۔ ہم یہاں ان تمام لوگوں کا شکریہ ادا کرتے ہوئے اپنا شکریہ ادا کرنا چاہیں گے جنہوں نے اس عظیم اقدام کی مختلف سرگرمیوں میں تعاون کیا ہے۔ اللہ سب کو اجر عظیم سے نوازے۔
    </p>

    <p>
      ہم ہر سطح کے صارفین کی جانب سے آپ کے قیمتی تبصروں اور تجاویز کا بے تابی سے انتظار کرتے ہیں۔ اللہ رب العزت اس عمل کو قبول فرمائے اور سب کو اجر عظیم سے نوازے۔ آمین
    </p>

    <p style="margin-top: 2em;">
      <strong>- شہاب پوک کوٹور، چیئرمین،</strong><br/>
      <strong>D4DX Innovations LLP</strong>
    </p>
  </div>
`;

const About = () => {
  const { translationLanguage } = useTheme();
  const isUrdu = translationLanguage === 'ur' || translationLanguage === 'urdu';

  return (
    <div className=" mx-auto min-h-screen p-6 bg-white dark:bg-gray-900 font-poppins">
      <div className="max-w-[1070px] w-full mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold text-gray-900 mb-4 dark:text-white ${isUrdu ? 'font-urdu' : ''}`} dir={isUrdu ? 'rtl' : 'ltr'}>
            {isUrdu ? 'ہمارے بارے میں' : 'About Us'}
          </h1>
          <div className=" h-px bg-gray-200 "></div>
        </div>

        {/* Content */}
        <div className={`dark:text-white text-gray-800 leading-relaxed ${isUrdu ? 'font-urdu' : ''}`} dir={isUrdu ? 'rtl' : 'ltr'}>
          <div
            className="prose prose-base dark:prose-invert prose-p:text-gray-700 dark:prose-p:text-gray-300 leading-7"
            dangerouslySetInnerHTML={{ __html: isUrdu ? URDU_ABOUT : ENGLISH_ABOUT }}
          />

          {/* Language Feature */}
          <div className={`flex items-center mt-8 pt-4 ${isUrdu ? 'flex-row-reverse' : ''}`}>
            <div className="rounded-lg p-2 mr-3" style={{ backgroundColor: '#2AA0BF' }}>
              <Languages className="w-6 h-6 text-white" />
            </div>
            <span className="text-lg font-medium dark:text-white" style={{ color: '#2AA0BF' }}>
              {isUrdu ? 'متعدد زبانوں میں دستیاب' : 'Available in multiple language'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;