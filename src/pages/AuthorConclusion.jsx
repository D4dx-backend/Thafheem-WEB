import React from "react";
import { useTheme } from "../context/ThemeContext";

const CONCLUSION_CONTENT = `
<p class="eng">
I express my gratitude to Allah the Highest from the bottom of my heart; the difficult task of writing Tafheem al-Quran, which I began in the month of Muharram 1361 AH (February 1942), has now come to an end after 30 years and four months. It is the immense blessing and generosity of Allah that He has bestowed upon a humble servant of His to render such service to the Holy Book of Allah. Whatever truth is in this book has come about through the light and guidance of the Almighty. If I have made any mistake in translating and interpreting the Quran, it is due to my knowledge and understanding. But - Alhamdulillah - I have not made any mistake knowingly. If I have made any mistake unknowingly, I hope in the mercy of Allah; He will forgive me. If this effort of mine has helped in any way in the guidance of His servants, I pray that He may make it a means of expiation for my sins. I also have a request to the world of scholars: May they awaken me to my mistakes. I will correct anything that convinces me with evidence that it is wrong - Insha Allah. I seek refuge in Allah from knowingly making a mistake in the Book of Allah or persisting in a mistake.<br><br>

As the title of this book suggests, I have tried to explain the Holy Quran to the literate common people as I have understood it. To explain the ideas and interests of the Quran so that they can find its spirit, to resolve the doubts that arise in the mind while reading the Quran or its mere translation, to analyze and explain the things that are stated briefly and concisely in the Quran — this was my aim. To explain more was not my aim at the beginning. Therefore, the commentary notes in the first volumes are brief. Later, as I progressed, the need for more interpretation became felt. To the extent that those who read the last volumes now begin to feel that the first volumes are dry. However, one of the benefits of the repetition of topics in the Quran is that the topics that are explained dryly in one place are later discussed in other surahs in detail in the commentary of the later surahs. It is my hope that those who read the Holy Quran once and do not finish it, but reread the entire book, will find the commentary of the last Surahs to be a sufficient guide to understand the first Surahs.<br><br>

Abul-A'la Maududi<br>
Lahore<br>
Multan<br>
24 Rabi'ul-Aqar 1392 AH<br>
(7 June 1972 AD)<br>
</p>
`;

const URDU_CONCLUSION_CONTENT = `
<div dir="rtl" style="text-align: right;">
  <p>میں دل کی گہرائیوں سے اللہ تعالیٰ کا شکر ادا کرتا ہوں۔ تفہیم القرآن لکھنے کا مشکل کام جو میں نے ماہ محرم 1361ھ (فروری 1942) میں شروع کیا تھا، اب 30 سال اور چار ماہ کے بعد اپنے اختتام کو پہنچا ہے۔ یہ اللہ تعالیٰ کی بے پناہ عنایت اور سخاوت ہے کہ اس نے اپنے ایک عاجز بندے کو اللہ کی مقدس کتاب کی ایسی خدمت کرنے سے نوازا ہے۔ اس کتاب میں جو بھی حقیقت ہے وہ اللہ تعالیٰ کے نور اور ہدایت سے آئی ہے۔ اگر مجھ سے قرآن کے ترجمہ و تفسیر میں کوئی غلطی ہوئی ہے تو وہ میرے علم و فہم کی وجہ سے ہے۔ لیکن - الحمدللہ - میں نے جان بوجھ کر کوئی غلطی نہیں کی ہے۔ اگر مجھ سے نادانستہ کوئی غلطی ہوئی ہے تو میں اللہ کی رحمت کی امید رکھتا ہوں۔ وہ مجھے معاف کر دے گا۔ اگر میری یہ کوشش بندوں کی رہنمائی میں کسی طرح سے کام آئی ہے تو میری دعا ہے کہ وہ اسے میرے گناہوں کا کفارہ بنادے۔ میری اہل علم سے بھی ایک گزارش ہے کہ وہ مجھے میری غلطیوں سے بیدار کریں۔ میں ہر وہ چیز درست کروں گا جو مجھے ثبوت کے ساتھ قائل کرے کہ وہ غلط ہے - انشاء اللہ۔ میں اللہ کی پناہ چاہتا ہوں کہ اللہ کی کتاب میں جان بوجھ کر غلطی کروں یا غلطی پر اڑے رہوں۔</p>
  
  <p>جیسا کہ اس کتاب کے عنوان سے اندازہ ہوتا ہے کہ میں نے قرآن پاک کو عام فہم لوگوں تک سمجھانے کی کوشش کی ہے۔ قرآن کے خیالات اور دلچسپیوں کو بیان کرنا تاکہ وہ اس کی روح کو تلاش کر سکیں، قرآن یا اس کا محض ترجمہ پڑھتے ہوئے ذہن میں پیدا ہونے والے شکوک کا ازالہ کرنا، قرآن مجید میں مختصر اور اختصار کے ساتھ بیان کردہ چیزوں کا تجزیہ اور وضاحت کرنا، یہ میرا مقصد تھا۔ مزید وضاحت کرنا شروع میں میرا مقصد نہیں تھا۔ اس لیے پہلی جلدوں میں تفسیری نوٹ مختصر ہیں۔ بعد میں، جیسے جیسے میں ترقی کرتا گیا، مزید تشریح کی ضرورت محسوس ہوتی گئی۔ اس حد تک کہ اب آخری جلدیں پڑھنے والوں کو محسوس ہونے لگتا ہے کہ پہلی جلدیں خشک ہیں۔ البتہ قرآن مجید میں موضوعات کی تکرار کا ایک فائدہ یہ ہے کہ جن موضوعات کو ایک جگہ صاف صاف بیان کیا گیا ہے ان پر بعد میں آنے والی سورتوں کی تفسیر میں تفصیل کے ساتھ دوسری سورتوں میں بحث کی گئی ہے۔ مجھے امید ہے کہ وہ لوگ جو قرآن پاک کو ایک بار پڑھتے ہیں اور اسے ختم نہیں کرتے بلکہ پوری کتاب کو دوبارہ پڑھتے ہیں، وہ آخری سورتوں کی تفسیر پہلی سورتوں کو سمجھنے کے لیے کافی رہنمائی پائیں گے۔</p>
  
  <p style="margin-top: 2em;"><strong>ابوالاعلیٰ مودودی</strong></p>
  <p><em>لاہور</em></p>
  <p><em>ملتان</em></p>
  <p><em>24 ربیع الاخر 1392ھ</em></p>
  <p><em>(7 جون 1972ء)</em></p>
</div>
`;

// Malayalam author's conclusion content (HTML)
const MALAYALAM_CONCLUSION_CONTENT = `
<p>ഞാനെന്റെ ഹൃദയത്തിന്റെ അകക്കാമ്പുകൊണ്ട് അത്യുന്നതനായ അല്ലാഹുവിന് നന്ദി രേഖപ്പെടുത്തുന്നു; ഹിജ്‌റാബ്ദം 1361 മുഹര്‍റം മാസത്തില്‍ (1942 ഫെബ്രുവരി) ഞാന്‍ ആരംഭിച്ച, തഫ്ഹീമുല്‍ഖുര്‍ആന്‍ എഴുതുക എന്ന അതിക്ലിഷ്ടമായ സംരംഭം 30 വര്‍ഷവും നാലു മാസവും പിന്നിട്ടശേഷം ഇന്നിതാ പരിസമാപ്തിയിലെത്തിയിരിക്കുകയാണ്. പരിശുദ്ധമായ ദൈവിക ഗ്രന്ഥത്തിന് ഇങ്ങനെയൊരു സേവനമര്‍പ്പിക്കാന്‍ തന്റെ നിസ്സാരനായ ഒരു ദാസന്ന് ഉതവിയരുളിയത് അല്ലാഹുവിന്റെ അപാരമായ അനുഗ്രഹവും ഔദാര്യവുംതന്നെയാകുന്നു. ഈ ഗ്രന്ഥാവലിയില്‍ സത്യമായി എന്തുണ്ടോ അതൊക്കെയും പടച്ചതമ്പുരാന്‍ അരുളിയ വെളിച്ചത്താലും മാര്‍ഗദര്‍ശനത്താലും ഉണ്ടായിട്ടുള്ളതാണ്. ഖുര്‍ആന്‍ ഭാഷാന്തരം ചെയ്യുന്നതിലും വ്യാഖ്യാനിക്കുന്നതിലും എനിക്ക് വല്ലേടത്തും അബദ്ധം പിണഞ്ഞിട്ടുണ്ടെങ്കില്‍ ആയത് എന്റെ അറിവിന്റെയും ഗ്രാഹ്യതയുടെയും കുറ്റമാകുന്നു. എന്നാല്‍ -അല്‍ഹംദുലില്ലാഹ്- ഞാന്‍ അറിഞ്ഞുകൊണ്ട് ഒരബദ്ധവും വരുത്തിയിട്ടില്ല. അറിയാതെ വല്ല അബദ്ധവും വന്നുപോയിട്ടുണ്ടെങ്കില്‍, ഞാന്‍ അല്ലാഹുവിന്റെ ദയാദാക്ഷിണ്യത്തില്‍ പ്രതീക്ഷയര്‍പ്പിക്കുകയാണ്; അതവനെനിക്കു പൊറുത്തുതരുമെന്ന്. എന്റെ ഈ പരിശ്രമം അവന്റെ ദാസന്മാരുടെ സന്മാര്‍ഗപ്രാപ്തിക്ക് വല്ലവിധേനയും സഹായകമായിട്ടുണ്ടെങ്കില്‍ അത് എന്റെ പാപമുക്തിക്കുള്ള മാധ്യമമാക്കേണമേ എന്നു പ്രാര്‍ഥിക്കുകയും ചെയ്യുന്നു. പണ്ഡിതലോകത്തോടും എനിക്കൊരപേക്ഷയുണ്ട്: എന്റെ അബദ്ധങ്ങള്‍ അവരെന്നെ ഉണര്‍ത്തുമാറാകണം. തെറ്റാണെന്നു തെളിവുസഹിതം എനിക്ക് ബോധ്യപ്പെടുത്തിത്തരുന്ന ഏത് കാര്യവും- ഇന്‍ശാ അല്ലാഹ് - ഞാന്‍ തിരുത്തുന്നതാണ്. അല്ലാഹുവിന്റെ വേദത്തില്‍ അറിഞ്ഞുകൊണ്ട് തെറ്റുവരുത്തുകയോ തെറ്റില്‍ ശഠിച്ചുനില്‍ക്കുകയോ ചെയ്യുന്നതില്‍നിന്ന് ഞാന്‍ അല്ലാഹുവില്‍ ശരണം തേടുന്നു.</p>

<p>ഈ ഗ്രന്ഥാവലിയുടെ പേര് സൂചിപ്പിക്കുന്നതുപോലെ, ഞാനിതില്‍ ശ്രമിച്ചിട്ടുള്ളത്, വിശുദ്ധ ഖുര്‍ആന്‍ ഞാന്‍ എപ്രകാരം മനസ്സിലാക്കിയോ അതേപ്രകാരം അക്ഷരജ്ഞാനമുള്ള സാധാരണക്കാര്‍ക്കു മനസ്സിലാക്കിക്കൊടുക്കാനാണ്. അവര്‍ക്ക് ഖുര്‍ആനിന്റെ ആത്മാവ് കണ്ടെത്താന്‍ കഴിയുമാറ് അതിന്റെ ആശയങ്ങളും താല്‍പര്യങ്ങളും തുറന്നു വിശദീകരിക്കുക, ഖുര്‍ആന്‍ അല്ലെങ്കില്‍ അതിന്റെ കേവല തര്‍ജമ വായിക്കുമ്പോള്‍ മനസ്സിലുണരുന്ന സംശയങ്ങള്‍ തീര്‍ത്തുകൊടുക്കുക, ഖുര്‍ആനില്‍ സംക്ഷിപ്തമായും സംഗ്രഹിതമായും പ്രസ്താവിച്ച കാര്യങ്ങള്‍ അപഗ്രഥിച്ചു വിശദമാക്കുക-- ഇതായിരുന്നു എന്റെ ലക്ഷ്യം. കൂടുതല്‍ വിശദീകരിക്കുക തുടക്കത്തില്‍ എന്റെ ലക്ഷ്യമായിരുന്നില്ല. അതുകൊണ്ട്  ആദ്യവാല്യങ്ങളിലെ വ്യാഖ്യാനക്കുറിപ്പുകള്‍ സംക്ഷിപ്തമാണ്. പിന്നീട് മുന്നോട്ട് പോകുന്തോറും കൂടുതല്‍ വ്യാഖ്യാനവൈശദ്യത്തിന്റെ ആവശ്യകത അനുഭവപ്പെട്ടുകൊണ്ടിരുന്നു. എത്രത്തോളമെന്നാല്‍ അവസാന വാല്യങ്ങള്‍ കാണുന്നവര്‍ക്ക് ഇപ്പോള്‍ ആദ്യവാല്യങ്ങള്‍ ശുഷ്‌കമാണെന്നു തോന്നാന്‍ തുടങ്ങിയിരിക്കുന്നു. എങ്കിലും ഒരിടത്ത് ശുഷ്‌കമായി വ്യാഖ്യാനിക്കപ്പെട്ട വിഷയങ്ങള്‍ പിന്നീട് മറ്റു സൂറകളിലും വരുന്നതിനാല്‍ ശേഷമുള്ള സൂറകളുടെ വ്യാഖ്യാനത്തില്‍ അവ വിശദമായി ചര്‍ച്ചചെയ്യപ്പെടുന്നു എന്നതും ഖുര്‍ആനില്‍ വിഷയങ്ങള്‍ ആവര്‍ത്തിക്കപ്പെടുന്നതിന്റെ പ്രയോജനങ്ങളിലൊന്നാകുന്നു. തഫ്ഹീമുല്‍ ഖുര്‍ആന്റെ സഹായത്തോടെ വിശുദ്ധ ഖുര്‍ആന്‍ ഒരുവട്ടം വായിച്ചു മതിയാക്കാതെ ഗ്രന്ഥാവലി മുഴുവന്‍ വീണ്ടും വായിക്കുന്നവരെ സംബന്ധിച്ചിടത്തോളം, ആദ്യ സൂറകള്‍ മനസ്സിലാക്കാന്‍, അവസാന സൂറകളുടെ വ്യാഖ്യാനം മതിയായ ഗൈഡായി അനുഭവപ്പെടുമെന്നാണെന്റെ പ്രതീക്ഷ.</p>

<p><span class="m1">അബുല്‍അഅ്‌ലാ മൗദൂദി<br>

ലാഹോര്‍<br>

മുല്‍ത്താന്‍<br>

ഹി. 24 റബീഉല്‍ ആഖര്‍ 1392<br>

(ക്രി. 7 ജൂണ്‍- 1972)</span></p>
`;

const AuthorConclusion = () => {
  const { translationLanguage } = useTheme();
  const isUrdu = translationLanguage === 'ur' || translationLanguage === 'urdu';
  const isMalayalam = translationLanguage === 'mal';

  // Determine content based on language
  let content = CONCLUSION_CONTENT;
  let title = "Author's Conclusion";
  let dir = 'ltr';
  let className = 'prose prose-base dark:prose-invert prose-a:text-cyan-600 dark:prose-a:text-cyan-400 prose-p:text-gray-700 dark:prose-p:text-gray-300 leading-7 text-justify';

  if (isUrdu) {
    content = URDU_CONCLUSION_CONTENT;
    title = "مصنف کا اختتامیہ";
    dir = 'rtl';
    className += ' font-urdu';
  } else if (isMalayalam) {
    content = MALAYALAM_CONCLUSION_CONTENT;
    title = "രചയിതാവിന്റെ ഉപസംഹാരം";
    dir = 'ltr';
    className += ' font-malayalam';
  }

  return (
    <div className="p-6 dark:bg-gray-900 min-h-screen">
      <div className="sm:max-w-[1070px] max-w-[350px] w-full mx-auto font-poppins">
        <h2 className={`text-2xl font-bold mb-4 dark:text-white border-b border-gray-300 dark:border-gray-600 pb-2 ${isUrdu ? 'font-urdu' : isMalayalam ? 'font-malayalam' : ''}`} dir={dir}>
          {title}
        </h2>

        {isMalayalam && (
          // Audio player for Malayalam author's conclusion
          <div className="mb-6">
            <audio
              controls
              className="w-full max-w-md"
              src="https://thafheem.net/audio/library/samapanam.ogg"
            >
              നിങ്ങളുടെ ബ്രൗസർ ഓഡിയോ പ്ലേബാക്ക് പിന്തുണയ്ക്കുന്നില്ല.
            </audio>
          </div>
        )}

        <div
          className={className}
          dangerouslySetInnerHTML={{ __html: content }}
          dir={dir}
        />
      </div>
    </div>
  );
};

export default AuthorConclusion;


