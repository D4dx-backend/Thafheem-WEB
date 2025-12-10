import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { Play, Pause } from "lucide-react";

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
  
  <p style="margin-top: 0.6em;"><strong>ابوالاعلیٰ مودودی</strong></p>
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

// Hindi author's conclusion content
const HINDI_CONCLUSION_CONTENT = `
<p>मैं अपने दिल की गहराइयों से अल्लाह तआला का शुक्रिया अदा करता हूँ; तफ़हीम अल-कुरान लिखने का मुश्किल काम, जो मैंने मुहर्रम 1361 AH (फरवरी 1942) के महीने में शुरू किया था, अब 30 साल और चार महीने बाद खत्म हुआ है। यह अल्लाह की बहुत बड़ी मेहरबानी और उदारता है कि उसने अपने एक विनम्र बंदे को अल्लाह की पवित्र किताब की ऐसी सेवा करने के लिए अता किया है। इस किताब में जो भी सच्चाई है, वह सर्वशक्तिमान के प्रकाश और मार्गदर्शन के माध्यम से सामने आई है। अगर मैंने कुरान का अनुवाद और व्याख्या करने में कोई गलती की है, तो यह मेरे ज्ञान और समझ के कारण है। लेकिन - अल्हम्दुलिल्लाह - मैंने जानबूझकर कोई गलती नहीं की है। अगर मैंने अनजाने में कोई गलती की है, तो मुझे अल्लाह की दया की उम्मीद है; वह मुझे माफ कर देगा। अगर मेरे इस प्रयास ने उसके बंदों के मार्गदर्शन में किसी भी तरह से मदद की है, तो मैं प्रार्थना करता हूं कि वह इसे मेरे पापों के प्रायश्चित का साधन बना दे। मेरी दुनिया के जानकारों से भी एक गुज़ारिश है: वे मुझे मेरी गलतियों से जगाएँ। मैं हर उस चीज़ को ठीक करूँगा जो मुझे सबूतों के साथ यकीन दिलाएगी कि वह गलत है - इंशा अल्लाह। मैं अल्लाह की किताब में जानबूझकर गलती करने या गलती पर अड़े रहने से अल्लाह की पनाह लेता हूँ।</p>

<p>जैसा कि इस किताब के टाइटल से पता चलता है, मैंने पवित्र कुरान को पढ़े-लिखे आम लोगों को वैसे ही समझाने की कोशिश की है जैसा मैंने उसे समझा है। कुरान के विचारों और दिलचस्पी को समझाना ताकि वे उसकी रूह को समझ सकें, कुरान पढ़ते समय या सिर्फ़ उसका ट्रांसलेशन पढ़ते समय मन में उठने वाले शक को दूर करना, कुरान में जो बातें शॉर्ट में और साफ़ तौर पर कही गई हैं, उनका एनालिसिस करना और उन्हें समझाना -- यही मेरा मकसद था। शुरू में ज़्यादा समझाना मेरा मकसद नहीं था। इसलिए, पहले वॉल्यूम में कमेंट्री नोट्स शॉर्ट में हैं। बाद में, जैसे-जैसे मैं आगे बढ़ा, और ज़्यादा मतलब निकालने की ज़रूरत महसूस होने लगी। इस हद तक कि जो लोग अब आखिरी वॉल्यूम पढ़ते हैं, उन्हें लगने लगा है कि पहले वॉल्यूम सूखे हैं। लेकिन, कुरान में टॉपिक को दोहराने का एक फ़ायदा यह है कि जो टॉपिक एक जगह पर सूखे तरीके से समझाए गए हैं, उन पर बाद की सूरह की कमेंट्री में दूसरी सूरह में डिटेल में बात की जाती है। मुझे उम्मीद है कि जो लोग पवित्र कुरान को एक बार पढ़ते हैं और उसे खत्म नहीं करते, बल्कि पूरी किताब को दोबारा पढ़ते हैं, उन्हें आखिरी सूरह की कमेंट्री पहली सूरह को समझने के लिए काफ़ी गाइड लगेगी।</p>

<p style="margin-top: 2em;"><strong>अबुल-अला मौदूदी</strong></p>
<p><em>लाहौर</em></p>
<p><em>मुल्तान</em></p>
<p><em>24 रबीउल-अक़र 1392 AH</em></p>
<p><em>(7 जून 1972 AD)</em></p>
`;

// Bangla author's conclusion content
const BANGLA_CONCLUSION_CONTENT = `
<p>আমি মহান আল্লাহর প্রতি গভীর কৃতজ্ঞতা প্রকাশ করছি। ১৩৬১ হিজরির (১৯৪২ সালের ফেব্রুয়ারী) মহররম মাসে আমি যে তাফহীমুল কুরআন লেখার কাজ শুরু করেছিলাম, তা ৩০ বছর চার মাস পর এখন শেষ পর্যায়ে পৌঁছেছে। এটা মহান আল্লাহর অসীম করুণা এবং উদারতা যে তিনি তাঁর একজন বিনয়ী বান্দাকে আল্লাহর পবিত্র গ্রন্থের প্রতি এতটা সেবা প্রদানের তৌফিক দান করেছেন। এই গ্রন্থে যা কিছু সত্য তা মহান আল্লাহর নূর এবং হেদায়েত থেকে এসেছে। যদি আমি কুরআনের অনুবাদ ও ব্যাখ্যায় কোন ভুল করে থাকি, তা আমার জ্ঞান এবং বোধগম্যতার কারণে। তবে - আলহামদুলিল্লাহ - আমি জেনেশুনে কোন ভুল করিনি। যদি আমি অজান্তে কোন ভুল করে থাকি, তাহলে আমি আল্লাহর রহমতের আশা করি। তিনি আমাকে ক্ষমা করবেন। যদি আমার এই প্রচেষ্টা বান্দাদের কোনভাবে পথ দেখানোর ক্ষেত্রে কার্যকর হয়ে থাকে, তাহলে আমি প্রার্থনা করি যে তিনি যেন এটিকে আমার পাপের কাফফারা হিসেবে পরিণত করেন। আলেমদের কাছেও আমার অনুরোধ, যেন তারা আমাকে আমার ভুল থেকে জাগিয়ে তোলেন। আমি এমন যেকোনো বিষয় সংশোধন করব যা আমাকে ভুল বলে মনে করে - ইনশাআল্লাহ। আল্লাহর কিতাবে ইচ্ছাকৃত ভুল করা বা ভুল করেই চলা থেকে আমি আল্লাহর কাছে আশ্রয় প্রার্থনা করছি।</p>

<p>এই বইয়ের শিরোনাম থেকেই বোঝা যাচ্ছে, আমি সাধারণ মানুষের কাছে পবিত্র কুরআন ব্যাখ্যা করার চেষ্টা করেছি। কুরআনের চিন্তাভাবনা এবং আগ্রহ ব্যাখ্যা করা যাতে তারা এর মূল চেতনা খুঁজে পেতে পারে, কুরআন পড়ার সময় বা এর নিছক অনুবাদের সময় মনের মধ্যে যে সন্দেহ তৈরি হয় তা দূর করা, কুরআনে সংক্ষেপে এবং সংক্ষিপ্তভাবে ব্যাখ্যা করা বিষয়গুলি বিশ্লেষণ এবং ব্যাখ্যা করা, এটাই ছিল আমার লক্ষ্য। আরও বিস্তারিতভাবে বলা শুরুতে আমার লক্ষ্য ছিল না। অতএব, প্রথম খণ্ডের ব্যাখ্যামূলক নোটগুলি সংক্ষিপ্ত ছিল। পরে, আমি যত এগিয়েছি, আরও ব্যাখ্যার প্রয়োজনীয়তা অনুভূত হয়েছিল। এখন যারা শেষ খণ্ডগুলি পড়েছেন তারা মনে করতে শুরু করেছেন যে প্রথম খণ্ডগুলি শুষ্ক। তবে, কুরআনে বিষয়গুলির পুনরাবৃত্তির একটি সুবিধা হল যে যে বিষয়গুলি এক জায়গায় স্পষ্টভাবে ব্যাখ্যা করা হয়েছে সেগুলি পরবর্তী সূরাগুলির ব্যাখ্যায় অন্যান্য সূরাগুলিতে বিস্তারিতভাবে আলোচনা করা হয়েছে। আমি আশা করি যারা পবিত্র কুরআন একবার পড়বেন এবং শেষ না করে পুরো বইটি পুনরায় পড়বেন, তারা শেষের সূরাগুলির ব্যাখ্যাই প্রথম সূরাগুলি বোঝার জন্য যথেষ্ট দিকনির্দেশনা পাবেন।</p>

<p style="margin-top: 2em;"><strong>আবুল আলা মওদুদী</strong></p>
<p><em>লাহোর</em></p>
<p><em>মুলতান</em></p>
<p><em>২৪ রবিউল আখতার ১৩৯২ হিজরি</em></p>
<p><em>(৭ জুন ১৯৭২)</em></p>
`;

const AuthorConclusion = () => {
  const { translationLanguage } = useTheme();
  const navigate = useNavigate();
  const isUrdu = translationLanguage === 'ur' || translationLanguage === 'urdu';
  const isMalayalam = translationLanguage === 'mal';
  const isHindi = translationLanguage === 'hi';
  const isBangla = translationLanguage === 'bn';
  const isTamil = translationLanguage === 'ta';

  // Redirect to Tamil Author Conclusion page when Tamil is selected
  useEffect(() => {
    if (isTamil) {
      navigate("/tamil/author-conclusion", { replace: true });
    }
  }, [isTamil, navigate]);

  // Return null while redirecting to Tamil page
  if (isTamil) {
    return null;
  }

  // Audio player state for Malayalam
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Determine content based on language
  let content = CONCLUSION_CONTENT;
  let title = "Author's Conclusion";
  let dir = 'ltr';
  let className = 'prose prose-base dark:prose-invert prose-a:text-cyan-600 dark:prose-a:text-cyan-400 prose-p:text-gray-700 dark:prose-p:text-gray-300 leading-7 text-justify';

  if (isUrdu) {
    content = URDU_CONCLUSION_CONTENT;
    title = "مصنف کا اختتامیہ";
    dir = 'rtl';
    className += ' font-urdu-nastaliq';
  } else if (isMalayalam) {
    content = MALAYALAM_CONCLUSION_CONTENT;
    title = "രചയിതാവിന്റെ ഉപസംഹാരം";
    dir = 'ltr';
    className += ' font-malayalam';
  } else if (isHindi) {
    content = HINDI_CONCLUSION_CONTENT;
    title = "लेखक का समापन";
    dir = 'ltr';
  } else if (isBangla) {
    content = BANGLA_CONCLUSION_CONTENT;
    title = "লেখকের উপসংহার";
    dir = 'ltr';
    className += ' font-bengali';
  }

  return (
    <div className="p-6 dark:bg-gray-900 min-h-screen">
      <div className="sm:max-w-[1070px] max-w-[350px] w-full mx-auto font-poppins">
        {isMalayalam ? (
          <div className="flex items-center justify-between mb-4 border-b border-gray-300 dark:border-gray-600 pb-2">
            <h2 className="text-2xl font-bold dark:text-white font-malayalam" style={{ fontFamily: "'NotoSansMalayalam'" }}>
              രചയിതാവിന്റെ ഉപസംഹാരം
            </h2>
            <div className="relative group">
              <button
                onClick={handlePlayPause}
                className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 shadow-lg ${
                  isPlaying
                    ? 'bg-gradient-to-br from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 scale-105'
                    : 'bg-gradient-to-br from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 hover:scale-110'
                }`}
                style={{
                  boxShadow: isPlaying 
                    ? '0 4px 15px rgba(6, 182, 212, 0.4), 0 0 20px rgba(6, 182, 212, 0.2)' 
                    : '0 4px 12px rgba(6, 182, 212, 0.3)'
                }}
              >
                <div className="absolute inset-0 rounded-full bg-white opacity-0 hover:opacity-10 transition-opacity duration-300"></div>
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-white relative z-10" fill="currentColor" />
                ) : (
                  <Play className="w-5 h-5 text-white relative z-10 ml-0.5" fill="currentColor" />
                )}
                {isPlaying && (
                  <span className="absolute inset-0 rounded-full border-2 border-white border-opacity-30 animate-ping"></span>
                )}
              </button>
              {/* Tooltip */}
              <div className="absolute right-0 top-full mt-2 px-3 py-1.5 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                {isPlaying ? 'Pause Audio' : 'Play Audio'}
                <div className="absolute -top-1 right-4 w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45"></div>
              </div>
              <audio
                ref={audioRef}
                src="https://thafheem.net/audio/library/samapanam.ogg"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
              />
            </div>
          </div>
        ) : (
          <h2 className={`text-2xl font-bold mb-4 dark:text-white border-b border-gray-300 dark:border-gray-600 pb-2 ${isUrdu ? 'font-urdu' : isBangla ? 'font-bengali' : ''}`} dir={dir}>
            {title}
          </h2>
        )}

        {isUrdu ? (
          <>
            <style>{`
              .urdu-conclusion-content {
                direction: rtl;
                text-align: right !important;
              }
              .urdu-conclusion-content p {
                text-align: right !important;
                margin-bottom: 0.6em !important;
                line-height: 2 !important;
                font-size: 16px;
              }
              .urdu-conclusion-content em,
              .urdu-conclusion-content strong {
                display: block;
                margin-top: 0.15em;
                margin-bottom: 0.15em;
              }
            `}</style>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 sm:p-6 md:p-8" dir="rtl">
              <div
                className="urdu-conclusion-content prose max-w-none prose-sm sm:prose-base dark:prose-invert text-gray-800 dark:text-gray-100 font-urdu-nastaliq"
                style={{ fontFamily: "'Noto Nastaliq Urdu', 'JameelNoori', serif" }}
                dangerouslySetInnerHTML={{ __html: URDU_CONCLUSION_CONTENT.replace(/\n/g, '<br />') }}
              />
            </div>
          </>
        ) : isHindi ? (
          <>
            <style>{`
              .hindi-conclusion-content {
                text-align: left !important;
              }
              .hindi-conclusion-content h3 {
                font-weight: 700 !important;
                margin-top: 1.4em !important;
                margin-bottom: 1em !important;
              }
              .hindi-conclusion-content p {
                margin-bottom: 1.1em !important;
                line-height: 1.95 !important;
                font-size: 16px;
              }
            `}</style>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 sm:p-8 md:p-10 lg:p-12">
              <div
                className="hindi-conclusion-content prose max-w-none prose-sm sm:prose-base dark:prose-invert text-gray-800 dark:text-gray-100"
                style={{ fontFamily: "'Noto Sans Devanagari', 'Poppins', sans-serif" }}
                dangerouslySetInnerHTML={{ __html: HINDI_CONCLUSION_CONTENT }}
              />
            </div>
          </>
        ) : isBangla ? (
          // Bangla content in blocks
          (() => {
            // Parse Bangla content and wrap each paragraph in a block
            const parseBanglaContent = () => {
              // Remove the outer div wrapper if exists
              let cleanContent = content.replace(/^<div[^>]*>/, '').replace(/<\/div>$/, '');
              
              // Split by paragraph tags
              const regex = /(<p[^>]*>[\s\S]*?<\/p>)/g;
              const blocks = [];
              let match;
              
              while ((match = regex.exec(cleanContent)) !== null) {
                blocks.push(match[0]);
              }
              
              return blocks;
            };
            
            const banglaBlocks = parseBanglaContent();
            
            return (
              <>
                <style>{`
                  .bangla-conclusion-block p {
                    text-align: justify !important;
                  }
                `}</style>
                <div>
                  {banglaBlocks.map((block, index) => {
                    // Check if it's a signature section (contains strong tag or specific text)
                    if (block.includes('<strong>') || block.includes('আবুল আলা')) {
                      return (
                        <div
                          key={index}
                          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4"
                        >
                          <div
                            className="bangla-conclusion-block"
                            dangerouslySetInnerHTML={{ __html: block }}
                            style={{
                              textAlign: 'justify',
                              fontSize: '16px',
                              lineHeight: '2.6',
                              fontFamily: "'Noto Sans Bengali', 'Kalpurush', sans-serif"
                            }}
                          />
                        </div>
                      );
                    }
                    // Regular paragraph - wrap in block
                    return (
                      <div
                        key={index}
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4"
                      >
                        <div
                          className="bangla-conclusion-block"
                          dangerouslySetInnerHTML={{ __html: block }}
                          style={{
                            textAlign: 'justify',
                            fontSize: '16px',
                            lineHeight: '2.6',
                            fontFamily: "'Noto Sans Bengali', 'Kalpurush', sans-serif"
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </>
            );
          })()
        ) : isMalayalam ? (
          // Malayalam content
          <>
            <style>{`
              .malayalam-conclusion-content {
                text-align: justify !important;
                text-justify: inter-word !important;
                word-spacing: normal !important;
                letter-spacing: normal !important;
                font-family: 'NotoSansMalayalam' !important;
              }
              .malayalam-conclusion-content p {
                text-align: justify !important;
                text-justify: inter-word !important;
                margin-bottom: 1.2em !important;
                margin-top: 0 !important;
                padding: 0 !important;
                line-height: 1.8 !important;
                word-spacing: normal !important;
                letter-spacing: normal !important;
                white-space: normal !important;
                orphans: 2 !important;
                widows: 2 !important;
                font-family: 'NotoSansMalayalam' !important;
              }
              .malayalam-conclusion-content p:last-child {
                margin-bottom: 0 !important;
              }
              .malayalam-conclusion-content br {
                display: none !important;
              }
              .malayalam-conclusion-content p br {
                display: none !important;
              }
            `}</style>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 sm:p-8 md:p-10 lg:p-12">
              <div
                className="malayalam-conclusion-content prose prose-base dark:prose-invert max-w-none leading-7 font-malayalam text-gray-800 dark:text-gray-100"
                style={{
                  fontFamily: "'NotoSansMalayalam'"
                }}
                dangerouslySetInnerHTML={{ __html: MALAYALAM_CONCLUSION_CONTENT }}
              />
            </div>
          </>
        ) : (
          <div
            className={className}
            dangerouslySetInnerHTML={{ __html: content }}
            dir={dir}
          />
        )}
      </div>
    </div>
  );
};

export default AuthorConclusion;


