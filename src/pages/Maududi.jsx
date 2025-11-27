import React, { useState, useRef } from 'react';
import maududiImg from "../assets/maududi.png";
import Ed1 from "../assets/ed1.png";
import Ed2 from "../assets/ed2.png";
import Ed3 from "../assets/ed3.png";
import Ed4 from "../assets/ed4.png";
import Ed5 from "../assets/ed5.png";
import Ed6 from "../assets/ed6.png";
import Ed7 from "../assets/ed7.png";
import VideoPlayer from '../components/VideoPlayer';
import { useTheme } from "../context/ThemeContext";

const MALAYALAM_CONTENT = `
<div>
  <div style="display:flex;flex-wrap:wrap;gap:16px;margin:16px 0;">
    <img src="${maududiImg}" alt="സയ്യിദ് അബുല്‍ അഅ്‌ലാ മൗദൂദി" style="width:220px;height:auto;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.15);" />
    <img src="${Ed2}" alt="മൗദൂദിയുടെ കുടുംബഭവനം" style="width:220px;height:auto;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.15);" />
  </div>
  <p>ഹിജ്‌റവര്‍ഷം 1321 റജബ് 3ന് (1903 സെപ്റ്റംബര്‍ 25) പഴയ ഹൈദരാബാദ് സംസ്ഥാനത്തെ ഔറംഗാബാദില്‍ സയ്യിദ് അബുല്‍ അഅ്‌ലാ മൗദൂദി ജനിച്ചു. സ്വൂഫി പാരമ്പര്യമുള്ള സയ്യിദ് കുടുംബമായിരുന്നു അദ്ദേഹത്തിന്റേത്. പിതാവ് അഹ്മദ് ഹസന്‍ മതഭക്തനായ വക്കീല്‍ ആയിരുന്നു. അദ്ദേഹത്തിന്റെ മൂന്ന് ആണ്‍മക്കളില്‍ ഇളയവനായിരുന്നു അബുല്‍അഅ്‌ലാ. മാതാവ് റുഖിയ്യാ ബീഗം.</p>
  <h3>വിദ്യാഭ്യാസം</h3>
  <p>വീട്ടില്‍നിന്ന് പ്രാഥമികവിദ്യാഭ്യാസം നേടിയശേഷം അദ്ദേഹത്തെ ആധുനിക പാശ്ചാത്യവിദ്യാഭ്യാസവും പരമ്പരാഗത ഇസ്‌ലാമിക വിദ്യാഭ്യാസവും ഒരുമിച്ച് നല്‍കിയിരുന്ന മദ്‌റസ ഫുര്‍ഖാനിയ്യയില്‍ ചേര്‍ത്തു. സെക്കന്ററി വിദ്യാഭ്യാസം വിജയകരമായി പൂര്‍ത്തിയാക്കിയശേഷം ഹൈദറാബാദിലെ ദാറുല്‍ഉലൂമില്‍ ഉപരിപഠനത്തിന് ചേര്‍ന്നു. പിതാവിന്റെ രോഗവും മരണവും മൂലം ഔപചാരിക പഠനം മുടങ്ങി.</p>
  <p><img src="${Ed1}" alt="മൗദൂദിയുടെ സര്‍ട്ടിഫിക്കറ്റ്" style="width:220px;height:auto;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.15);" />എന്നാല്‍, സ്വന്തം നിലക്ക് അത്യധ്വാനം ചെയ്ത് അദ്ദേഹം പഠിച്ചുമുന്നേറി. 20 വയസ്സ് തികയും മുമ്പ് തന്നെ മാതൃഭാഷയായ ഉര്‍ദുവിനു പുറമെ അറബി, പേര്‍ഷ്യന്‍, ഇംഗ്ലീഷ് ഭാഷകള്‍ അദ്ദേഹം വശമാക്കി. വിവിധ വിഷയങ്ങള്‍ വിശദമായി പഠിക്കാന്‍ ഇത് അദ്ദേഹത്തെ സഹായിച്ചു.</p>
  <h3>പത്രപ്രവര്‍ത്തനത്തില്‍</h3>
  <p>ഔപചാരിക പഠനം മുടങ്ങിയശേഷം മൗദൂദി സാഹിബ് പത്രപ്രവര്‍ത്തനത്തിലേക്ക് തിരിഞ്ഞു. 1918ല്‍ ബീജ്‌നൂരിലെ 'അല്‍മദീന' പത്രാധിപസമിതിയില്‍ അംഗമായി. 1920ല്‍ 17ാം വയസ്സില്‍ ജബല്‍പൂരില്‍നിന്ന് പ്രസിദ്ധീകരിച്ചിരുന്ന 'താജി' ന്റെ പത്രാധിപരായി. <img src="${Ed4}" alt="പത്രപ്രവര്‍ത്തന കുറിപ്പുകള്‍" style="width:220px;height:auto;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.15);" />1920ല്‍ ദല്‍ഹിയിലെത്തി ജംഇയ്യത്തെ ഉലമായെ ഹിന്ദിന്റെ 'മുസ്‌ലിം' പത്രത്തിന്റെയും (1921 മുതല്‍ 1923 വരെ) 'അല്‍ ജംഇയ്യത്തി'ന്റെയും (1925-28) പത്രാധിപരായി ജോലിചെയ്തു. മൗദൂദിയുടെ പത്രാധിപത്യത്തില്‍ 'അല്‍ ജംഇയ്യത്ത്' ഒന്നാംകിട പത്രമായിമാറി.</p>
  <h3>രാഷ്ട്രീയത്തില്‍ താല്‍പര്യം</h3>
  <p>1920കളോടെ രാഷ്ട്രീയത്തിലും മൗദൂദി സാഹിബ് ചെറിയ തോതില്‍ താല്‍പര്യം കാണിച്ചുതുടങ്ങി. ബ്രിട്ടീഷ് ഭരണത്തെ എതിര്‍ക്കുകയും മുസ്‌ലിംകളെ അഫ്ഗാനിസ്താനിലേക്ക് പലായനം ചെയ്യാന്‍ പ്രേരിപ്പിക്കുകയും ചെയ്തിരുന്ന 'തഹ്‌രീਕੇ ഹിജ്‌റ'ത്തിലും ഖിലാഫത്ത് പ്രസ്ഥാനത്തിലും ചേര്‍ന്നു പ്രവര്‍ത്തിച്ചു. പ്രസ്ഥാനത്തിന്റെ ലക്ഷ്യവും പരിപാടിയും യാഥാര്‍ഥ്യാധിഷ്ഠിതവും ആസൂത്രിതവുമായിരിക്കണമെന്ന് നിര്‍ബന്ധമുണ്ടായിരുന്ന മൗദൂദിസാഹിബിന് പക്ഷേ, അധികകാലം അവയോടൊത്തുപോകാന്‍ കഴിഞ്ഞില്ല. അദ്ദേഹം പഠനത്തിലും പത്രപ്രവര്‍ത്തനത്തിലും കൂടുതല്‍ ശ്രദ്ധ കേന്ദ്രീകരിച്ചു.</p>
  <h3>ആദ്യപുസ്തകം</h3>
  <p>1920 മുതല്‍ 1928 വരെ 4 വ്യത്യസ്ത പുസ്തകങ്ങള്‍ മൗദൂദി സാഹിബ് വിവര്‍ത്തനം ചെയ്തു. ഒന്ന് അറബിയില്‍നിന്നും ബാക്കിയുള്ളവ ഇംഗ്ലീഷില്‍നിന്നും. ആദ്യത്തെ ഗ്രന്ഥമായ 'അല്‍ ജിഹാദു ഫില്‍ ഇസ്‌ലാം' 1927 ല്‍ 'അല്‍ജംഇയ്യത്തി'ല്‍ പരമ്പരയായി പ്രസിദ്ധീകരിച്ചു. 1930ല്‍ അത് പുസ്തകരൂപത്തില്‍ പുറത്തുവന്നു. അല്ലാമാ മുഹമ്മദ് ഇഖ്ബാലും മൗലാനാ മുഹമ്മദലി ജൗഹറും പ്രസ്തുത കൃതിയെ ഏറെ പ്രശംസിക്കുകയുണ്ടായി. മൗദൂദി സാഹിബ് തന്റെ ഇരുപതുകളില്‍ എഴുതിയതാണെങ്കിലും ഇന്നും ഏറെ വിലമതിക്കപ്പെടുന്ന ഈ കൃതി അദ്ദേഹത്തിന്റെ പ്രമുഖ ഗ്രന്ഥങ്ങളിലൊന്നാണ്.</p>
  <h3>ഗവേഷണവും രചനയും</h3>
  <p>
    <video width="350" controls="">
      <source src="/articles/video/MaududiSahibVideo2.mp4" type="video/mp4">
      നിങ്ങളുടെ ബ്രൗസര്‍ വീഡിയോ പ്‌ളേബാക്ക് പിന്തുണക്കുന്നില്ല.
    </video>
  </p>
  <p>1928ല്‍ 'അല്‍ ജംഇയ്യത്തി'ല്‍നിന്ന് വിരമിച്ച ശേഷം മൗദൂദി സാഹിബ് ഹൈദരാബാദിലേക്കു തിരിച്ചുപോയി ഗവേഷണത്തിലും എഴുത്തിലും മുഴുകി. 1933ല്‍ സ്വന്തം പത്രാധിപത്യത്തില്‍ 'തര്‍ജുമാനുല്‍ ഖുര്‍ആന്‍' മാസിക ആരംഭിച്ചു. അന്നുമുതല്‍ തന്റെ ആശയങ്ങളും ചിന്തകളും വീക്ഷണങ്ങളും പ്രകാശിപ്പിക്കാനുള്ള മുഖ്യമാധ്യമമായി ഓഫ് തര്‍ജുമാനുല്‍ ഖുര്‍ആന്‍ മാറി.</p>
  <p>മുപ്പതുകളുടെ മധ്യത്തില്‍ ഇന്ത്യന്‍ മുസ്‌ലിംകള്‍ നേരിട്ടുകൊണ്ടിരുന്ന മുഖ്യ രാഷ്ട്രീയ സാംസ്‌കാരിക പ്രശ്‌നങ്ങളെക്കുറിച്ച് ഇസ്‌ലാമിക കാഴ്ചപ്പാടിലൂടെ അദ്ദേഹം എഴുതാന്‍ തുടങ്ങി. മുസ്‌ലിംകളില്‍ സ്വാധീനം ചെലുത്തിക്കൊണ്ടിരുന്ന അനിസ്‌ലാമിക ആശയാദര്‍ശങ്ങളെയും ചിന്താഗതികളെയും രൂക്ഷമായി വിമര്‍ശിക്കുകയും അവയുടെ പൊള്ളത്തരം സമര്‍ഥമായി തുറന്നുകാട്ടുകയും ചെയ്തു.</p>
  <p>പിന്നീട് അല്ലാമാ ഇഖ്ബാലിന്റെ ക്ഷണപ്രകാരം ഹൈദരാബാദ് വിട്ട് പഞ്ചാബിലെ പഠാന്‍കോട്ട് ജില്ലയില്‍ താമസമാക്കിയ മൗദൂദി അവിടെ ദാറുല്‍ഇസ്‌ലാം എന്ന പേരില്‍ ഒരു അക്കാദമിക ഗവേഷണസ്ഥാപനം ആരംഭിച്ചു. അല്ലാമാ ഇഖ്ബാലിനോടൊപ്പം ചേര്‍ന്ന് ഇസ്‌ലാമിക ചിന്തയുടെ പുനര്‍നിര്‍മാണം യാഥാര്‍ഥ്യമാക്കുകയും ഇസ്‌ലാമിക വിഷയങ്ങളില്‍ കഴിവുറ്റ പണ്ഡിതന്മാരെ വാര്‍ത്തെടുക്കുകയും ചെയ്യുക എന്നതായിരുന്നു ലക്ഷ്യം.</p>
  <h3>ജമാഅത്തെ ഇസ്‌ലാമി</h3>
  <p>1940കളോടെ സമഗ്രമായ ഒരു ഇസ്‌ലാമിക പ്രസ്ഥാനത്തിന് രൂപം നല്‍കുന്നതിനെ കുറിച്ച് മൗദൂദിസാഹിബ് ഗൗരവപൂര്‍വം ചിന്തിക്കാന്‍ തുടങ്ങി. അങ്ങനെ അദ്ദേഹം 1941 ആഗസ്ത് 26 ന് ലാഹോറില്‍ വിളിച്ചുചേര്‍ത്ത നാട്ടിന്റെ നാനാഭാഗങ്ങളില്‍ നിന്നുള്ള 72 പേര്‍ പങ്കെടുത്ത യോഗത്തില്‍വെച്ച് ജമാഅത്തെ ഇസ്‌ലാമി രൂപം കൊണ്ടു. ആദ്യത്തെ അമീറായി തിരഞ്ഞെടുക്കപ്പെട്ട അദ്ദേഹം 1972ല്‍ ആരോഗ്യകാരണങ്ങളാല്‍ ഉത്തരവാദിത്വം ഒഴിയുന്നതുവരെ ആ ചുമതല നിര്‍വഹിച്ചു.</p>
  <h3>പോരാട്ടവും പീഡനങ്ങളും</h3>
  <p><img src="${Ed5}" alt="മൗദൂദിയുടെ പ്രസംഗം" style="width:220px;height:auto;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.15);" />ഇന്ത്യാ വിഭജനത്തെത്തുടര്‍ന്ന് 1947 ആഗസ്റ്റില്‍ പാകിസ്താനില്‍ താമസമാക്കിയ മൗദൂദി അവിടെ ഒരു യഥാര്‍ഥ ഇസ്‌ലാമിക സമൂഹവും രാഷ്ട്രവും സ്ഥാപിക്കാന്‍ പരിശ്രമിച്ചു. ഭരണാധികാരികള്‍ കടുത്ത നടപടികളോടെ അദ്ദേഹം നേരിട്ടു. പലതവണ അദ്ദേഹത്തെ അറസ്റ്റുചെയ്ത് ജയിലിലടച്ചു. 1953 ല്‍ ഖാദിയാനീ പ്രശ്‌നത്തെക്കുറിച്ച് ഒരു ലഘുലേഖ എഴുതിയതിന്റെ പേരില്‍ രാജ്യദ്രോഹക്കുറ്റം ചുമത്തി പട്ടാളകോടതി മൗദൂദി സാഹിബിന് വധശിക്ഷ വിധിച്ചു. മാപ്പപേക്ഷ നല്‍കി കുറ്റവിമുക്തനാകാന്‍ അവസരം ലഭിച്ചെങ്കിലും സത്യത്തിനുവേണ്ടി വധശിക്ഷ സ്വീകരിക്കാന്‍ അദ്ദേഹം തയ്യാറായി. ഒടുവില്‍ പാകിസ്ഥാനകത്തും ലോകത്തിന്റെ ഇതര ഭാഗങ്ങളിലും ഉണ്ടായ ശക്തമായ എതിര്‍പ്പിനെ തുടര്‍ന്ന് വധശിക്ഷ ജീവപര്യന്തം തടവായി ചുരുക്കാനും പിന്നീട് അതുതന്നെ റദ്ദാക്കാനും ഭരണകൂടം നിര്‍ബന്ധിതമായി.</p>
  <h3>സംഭാവനകള്‍</h3>
  <p>മൗദൂദിസാഹിബ് 120ലേറെ പുസ്തകങ്ങളും ലഘുലേഖകളും എഴുതി. ആയിരത്തിലേറെ പ്രസംഗങ്ങളും പത്ര പ്രസ്താവനകളും നടത്തി.</p>
  <p><${Ed4}" alt="മൗദൂദിയുടെ രചനങ്ങള്‍" style="width:220px;height:auto;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.15);" />ലളിതവും ചടുലവും കരുത്തുറ്റതുമാണ് അദ്ദേഹത്തിന്റെ രചനാരീതി. വിവിധ വിഷയങ്ങളെക്കുറിച്ച് പണ്ഡിതോചിതമായും യുക്തിഭദ്രതയോടെയും അതോടൊപ്പം സരളമായും അദ്ദേഹം എഴുതി. തഫ്‌സീര്‍, ഹദീസ്, നിയമം, തത്ത്വചിന്ത, ചരിത്രം എന്നിവയെല്ലാം അദ്ദേഹത്തിന്റെ വിഷയങ്ങളായിരുന്നു.</p>
  <p>രാഷ്ട്രീയവും സാമ്പത്തികവും സാംസ്‌കാരികവും സാമൂഹികവും ദൈവശാസ്ത്രപരവുമായ വിവിധ പ്രശ്‌നങ്ങള്‍ അദ്ദേഹം ചര്‍ച്ചചെയ്യുകയും ഇസ്‌ലാമിക അധ്യാപനങ്ങളുമായി അവയെ ബന്ധിപ്പിക്കുകയും ചെയ്തു. തഫ്ഹീമുല്‍ ഖുര്‍ആന്‍ ആണ് മൗദൂദിസാഹിബിന്റെ ഏറ്റവും മഹത്തായ രചന. ഖുര്‍ആന്റെ മൊത്തം ആശയത്തിന്റെ അടിസ്ഥാനത്തില്‍ ഖുര്‍ആന്‍ ആയത്തുകളെ വിശദീകരിക്കുന്ന രീതിയാണ് അതില്‍ അദ്ദേഹം സ്വീകരിച്ചിരിക്കുന്നത്. 1943ല്‍ ആരംഭിച്ച തഫ്ഹീമുല്‍ ഖുര്‍ആന്റെ രചന 1972ലാണ് പൂര്‍ത്തിയാക്കിയത്.</p>
  <p>സംഘടനകള്‍ക്കും രാജ്യാതിര്‍ത്തികള്‍ക്കുമപ്പുറം സ്വാധീനം ചെലുത്താന്‍ കഴിഞ്ഞ അദ്ദേഹത്തിന്റെ കൃതികള്‍ ഇംഗ്ലീഷ്, അറബി, പേര്‍ഷ്യന്‍, ഹിന്ദി, ഫ്രഞ്ച്, ജര്‍മന്‍, സ്വാഹിലി, തമിഴ്, ബംഗാളി, മലയാളം തുടങ്ങി എഴുപതിലേറെ ഭാഷകളിലേക്ക് വിവര്‍ത്തനം ചെയ്യപ്പെട്ടിട്ടുണ്ട്. ഇപ്പോഴും അത് തുടരുന്നു.</p>
  <h3>മൗദൂദിയെക്കുറിച്ച കൃതികള്‍</h3>
  <p><span class="m1">അബുല്‍അഅ്‌ലാ - ടി മുഹമ്മദ്.<br>മൂന്ന് മുസ്‌ലിം പരിഷ്‌കര്‍ത്താക്കള്‍ - കെ.കെ. അലി.<br>വിമര്‍ശിക്കപ്പെടുന്ന മൗദൂദി - ഒരുസംഘം ലേഖകര്‍.<br>മൗദൂദി സ്മൃതിരേഖകള്‍ - എഡിറ്റര്‍ വി.എ. കബീര്‍.</span></p>
  <h3>അവാര്‍ഡ്</h3>
  <p>1962ല്‍ 'റാബിത്വതുല്‍ ആലമില്‍ ഇസ്‌ലാമി'യുടെ സ്ഥാപകസമിതിയില്‍ അംഗമായ മൗദൂദിക്കാണ് 1979ല്‍ അന്താരാഷ്ട്രതലത്തില്‍ ഇസ്‌ലാമികസേവനത്തിനുള്ള പ്രഥമ ഫൈസല്‍ അവാര്‍ഡ് ലഭിച്ചത്. കൂടാതെ ശ്രദ്ധേയങ്ങളായ ഒട്ടേറെ ബഹുമതികളും അദ്ദേഹത്തിന് ലഭിക്കുകയുണ്ടായി.</p>
  <p class="photo">
    <img src="${Ed6}" alt="മൗദൂദിയുടെ സന്ദര്‍ശനങ്ങള്‍" style="width:100%;max-width:280px;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.15);" />
  </p>
  <h3>അന്ത്യം</h3>
  <p><img src="${Ed7}" alt="മൗദൂദിയുടെ ജനാസ" style="width:220px;height:auto;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.15);" />നേരത്തേയുണ്ടായിരുന്ന വൃക്കരോഗം 1979 ഏപ്രിലില്‍ വര്‍ധിക്കുകയും ഹൃദയസംബന്ധമായ രോഗങ്ങള്‍ക്കടിപ്പെടുകയും ചെയ്തു. ചികിത്സക്കായി അദ്ദേഹത്തെ അമേരിക്കയിലേക്ക് കൊണ്ടുപോയി. അദ്ദേഹത്തിന്റെ രണ്ടാമത്തെ പുത്രന്‍ ന്യൂയോര്‍ക്കിലെ ബഫലോയില്‍ ഡോക്ടറായിരുന്നു. ശസ്ത്രക്രിയയെത്തുടര്‍ന്ന് 1979 സെപ്റ്റംബര്‍ 22ന് അദ്ദേഹം നിര്യാതനായി. 76 വയസ്സായിരുന്നു.</p>
  <p>പിന്നീട് പാകിസ്താനിലേക്ക് കൊണ്ടുവന്ന് ലാഹോറിലെ വീട്ടുവളപ്പില്‍ സംസ്‌കരിച്ചു. ഇസ്‌ലാമിനും ഇസ്‌ലാമിക സമൂഹത്തിനും ചെയ്ത മഹത്തായ സേവനങ്ങള്‍ക്ക് അല്ലാഹു മൗദൂദിസാഹിബിന് ഉദാരമായി പ്രതിഫലം നല്‍കുമാറാകട്ടെ, ആമീന്‍.</p>
  <h3>പ്രധാന കൃതികള്‍</h3>
  <p>ലോകത്ത് ഏറ്റവുംകൂടുതല്‍ വായിക്കപ്പെടുന്ന ഇസ്‌ലാമിക ഗ്രന്ഥകര്‍ത്താവ് ഒരുപക്ഷേ മൗദൂദിയായിരിക്കും. 60 വര്‍ഷത്തെ പൊതുജീവിതത്തിനിടയില്‍ 120-ഓളം ഗ്രന്ഥങ്ങള്‍ രചിച്ചു. മൗദൂദിയുടെ ഏറ്റവും മഹത്തായ കൃതി ആറുവാല്യങ്ങളിലായി വിരചിതമായ <span class="m1">തഫ്ഹീമുല്‍ ഖുര്‍ആന്‍</span> എന്ന ഖുര്‍ആന്‍ വ്യാഖ്യാന ഗ്രന്ഥമാണ്.</p>
  <p><span class="m1">• രിസാലെദീനിയാത്ത് (ഇസ്‌ലാംമതം)<br>• ഖുതുബാത്<br>• ഖുര്‍ആന്‍ കീ ചാര്‍ ബുന്‍യാദീ ഇസ്തിലാഹേം (ഖുര്‍ആനിലെ നാല് സാങ്കേതിക ശബ്ദങ്ങള്‍)<br>• അല്‍ജിഹാദു ഫില്‍ ഇസ്‌ലാം (ജിഹാദ്)<br>• സുന്നത്ത് കീ ആയീനീ ഹൈഥിയത് (സുന്നത്തിന്റെ പ്രാമാണികത)<br>• മസ്അലെ ജബ്ര്‍ വ ഖദ്ര്‍<br>• ഇസ്‌ലാമീ തഹ്ദീബ് ഓര്‍ ഉസ്‌കെ ഉസ്വൂല്‍ വൊമബാദി (ഇസ്‌ലാമിക സംസ്‌കാരം മൂലശിലകള്‍)<br>• ഇസ്‌ലാം ഓര്‍ ജാഹിലയത് (ഇസ്‌ലാമും ജാഹിലിയ്യതും)<br>• മുസല്‍മാന്‍ ഓര്‍ മൗജൂദെസിയാസീ കശ്മകശ്<br>• ഖിലാഫത്‌വൊമുലൂകിയത് (ഖിലാഫതും രാജവാഴ്ചയും)<br>• ഇസ്‌ലാമീരിയാസത്, തജ്ദീദ് വൊ ഇഹ്‌യായെ ദീന്‍<br>• മആശിയാതെ ഇസ്‌ലാം<br>• പര്‍ദ്ദ<br>• സൂദ്<br>• ഇസ്‌ലാം ഓര്‍ സബ്‌തെ വിലാദത്ത് (സന്താന നിയന്ത്രണം)<br>• ഹുഖൂഖു സൗജൈന്‍ (ദാമ്പത്യനിയമങ്ങള്‍ ഇസ്‌ലാമില്‍)<br>• തഅ്‌ലീമാത്ത്<br>• തഫ്ഹീമാത്ത്<br>• തന്‍കീഹാത്ത്<br>• ശഹാദത്തെ ഹഖ് (സത്യസാക്ഷ്യം)<br>• സീറതെ സര്‍വറെആലം<br>• തഹ്‌രീക് ഓര്‍ കാര്‍കുന്‍ (പ്രസ്ഥാനവും പ്രവര്‍ത്തകരും)</span></p>
</div>
`;

const Maududi = () => {
    const { translationLanguage } = useTheme();
    const isMalayalam = translationLanguage === "mal";

    const books = [
        "Jihad in Islam",
        "Towards Understanding Islam",
        "Purdah & the Status of Women in Islam",
        "The Islamic Law and Constitution",
        "Let Us Be Muslims",
        "The Islamic Way Of Life",
        "The Meaning Of The Qur'an",
        "A Short History Of The Revivalist Movement In Islam",
        "Human Rights in Islam",
        "Four basic Qur'anic terms",
        "The process of Islamic revolution",
        "Unity of the Muslim world",
        "The moral foundations of the Islamic movement",
        "Economic system of Islam",
        "The road to peace and salvation",
        "The Qadiani Problem",
        "The Question of Dress",
        "The Rights of Non-Muslims in Islamic State",
    ];

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const videoRef = useRef(null);

    // Format time from seconds to MM:SS
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
        }
    };

    const handlePrevious = () => {
        setCurrentTime(Math.max(0, currentTime - 10));
        if (videoRef.current) {
            videoRef.current.currentTime = Math.max(0, currentTime - 10);
        }
    };

    const handleNext = () => {
        setCurrentTime(Math.min(duration, currentTime + 10));
        if (videoRef.current) {
            videoRef.current.currentTime = Math.min(duration, currentTime + 10);
        }
    };

    const handleProgressClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const newTime = (clickX / rect.width) * duration;
        setCurrentTime(newTime);
        if (videoRef.current) {
            videoRef.current.currentTime = newTime;
        }
    };

    const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

    if (isMalayalam) {
        return (
            <div className="mx-auto bg-white dark:bg-gray-900 p-2 sm:p-4 md:p-6 lg:p-8 font-poppins">
                <div className="max-w-[959.01px] mx-auto px-2 sm:px-4 lg:px-0 lg:ml-50">
                    <div className="mb-4 sm:mb-6 md:mb-8 border-b border-gray-300 dark:border-gray-600 pb-2">
                        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-black dark:text-white font-malayalam">
                            സയ്യിദ് അബുല്‍ അഅ്‌ലാ മൗദൂദി
                        </h1>
                    </div>
                    <div
                        className="prose max-w-none prose-sm sm:prose-base dark:prose-invert text-gray-800 dark:text-gray-100 font-malayalam leading-7"
                        dangerouslySetInnerHTML={{ __html: MALAYALAM_CONTENT }}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto bg-white dark:bg-gray-900 p-2 sm:p-4 md:p-6 lg:p-8 font-poppins">
            {/* Portrait Image - Responsive positioning */}
            <div className="block sm:block lg:absolute lg:top-40 mb-4 sm:mb-6 lg:mb-0">
                <img 
                    src={maududiImg} 
                    alt="Sayyid Abul A'la Maududi"
                    className="w-[120px] h-[120px] xs:w-[140px] xs:h-[140px] sm:w-[150px] sm:h-[150px] md:w-[156px] md:h-[186px] object-cover rounded shadow-sm mx-auto lg:mx-0"
                />
            </div>

            <div className="max-w-[959.01px] mx-auto px-2 sm:px-4 lg:px-0 lg:ml-50">
                {/* Header */}
                <div className="mb-4 sm:mb-6 md:mb-8 border-b border-gray-300 dark:border-gray-600 pb-2">
                    <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-black dark:text-white ">
                        Sayyid Abul A'la Maududi (1903-1979)
                    </h1>
                </div>

                {/* Main Biography Section */}
                <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 md:mb-8">
                    {/* Biographical Text */}
                    <div className="flex-1 lg:ml-0">
                        <h3 className="text-blue-600 font-normal mb-2 sm:mb-3 text-sm dark:text-white">(1903-1979)</h3>
                        <p className="text-black leading-relaxed mb-3 sm:mb-4 text-xs sm:text-sm dark:text-white">
                            Abul A'la was born on Rajab 3, 1321 AH (September 25, 1903 AD) in Aurangabad, 
                            a well-known town in the former princely state of Hyderabad (Deccan), presently 
                            Maharashtra, India. Born in a respectable family, his ancestry on the paternal 
                            side is traced back to the Holy Prophet Muhammad (peace and blessing of Allah be on him).
                        </p>
                        <p className="text-black leading-relaxed mb-4 sm:mb-4 lg:mb-6 text-xs sm:text-sm dark:text-white">
                            The family had a long-standing tradition of spiritual leadership and a number of 
                            Maududi's ancestors were outstanding leaders of Sufi Orders. One of the luminaries 
                            among them, the one from whom he derived his family name, was Khwajah Qutb al-Din Maudud 
                            (d. 527 AH), a renowned leader of the Chishti Sufi Order. Maududi's forefathers had moved 
                            to the Subcontinent from Chisht towards the end of the 9th century of the Islamic calendar 
                            (15th century of the Christian calendar). The first one to arrive was Maududi's namesake, 
                            Abul A'la Maududi (d. 935 AH). Maududi's father, Ahmad Hasan, born in 1855 AD, a lawyer 
                            by profession, was a highly religious and devout person. Abul A'la was the youngest of his three sons.
                        </p>

                        {/* Educational & Intellectual Growth */}
                        <div className="mb-4 sm:mb-4 lg:mb-6">
                            <h2 className="text-blue-600 font-normal mb-2 sm:mb-3 lg:mb-4 text-sm sm:text-base dark:text-white">
                                Educational & Intellectual Growth
                            </h2>
                            <div className="flex flex-row gap-2 sm:gap-3 md:gap-4 mb-3 lg:mb-4 overflow-x-auto pb-2">
                                <img 
                                    src={Ed1}
                                    alt="Historical Document"
                                    className="w-[80px] h-[80px] xs:w-[90px] xs:h-[90px] sm:w-[108px] sm:h-[108px] md:w-[120px] md:h-[120px] lg:w-[186px] lg:h-[186px] object-cover rounded shadow-sm flex-shrink-0"
                                />
                                <img 
                                    src={Ed2}
                                    alt="School Building"
                                    className="w-[80px] h-[80px] xs:w-[90px] xs:h-[90px] sm:w-[108px] sm:h-[108px] md:w-[120px] md:h-[120px] lg:w-[186px] lg:h-[186px] object-cover rounded shadow-sm flex-shrink-0"
                                />
                                <img 
                                    src={Ed3}
                                    alt="Street View"
                                    className="w-[80px] h-[80px] xs:w-[90px] xs:h-[90px] sm:w-[108px] sm:h-[108px] md:w-[120px] md:h-[120px] lg:w-[186px] lg:h-[186px] object-cover rounded shadow-sm flex-shrink-0"
                                />
                            </div>
                            <p className="text-black leading-relaxed text-xs sm:text-sm dark:text-white">
                                After acquiring early education at home, Abul A'la was admitted in Madrasah Furqaniyah, 
                                a high school which attempted to combine the modern Western with the traditional Islamic 
                                education. After successfully completing his secondary education, young Abul A'la was at 
                                the stage of undergraduate studies at Darul Uloom, Hyderabad, when his formal education 
                                was disrupted by the illness and eventual death of his father. This did not deter Maududi 
                                from continuing his studies though these had to be outside of the regular educational 
                                institutions. By the early 1920s, Abul A'la knew enough Arabic, Persian and English, 
                                besides his mother-tongue, Urdu, to study the subjects of his interest independently. 
                                Thus, most of what he learned was self-acquired though for short spells of time he also 
                                received systematic instruction and guidance from some competent scholars. Thus, Maududi's 
                                intellectual growth was largely a result of his own effort and the stimulation he received 
                                from his teachers. Moreover, his uprightness, his profound regard for propriety and 
                                righteousness largely reflect the religious piety of his parents and their concern for 
                                his proper moral upbringing.
                            </p>
                        </div>

                        <div className="mb-4 sm:mb-4 lg:mb-6">
    <h2 className="text-blue-500 font-normal mb-2 sm:mb-3 text-sm sm:text-base dark:text-white">
        Involvement in journalism
    </h2>
    <div className="block lg:flex lg:gap-4 mb-3">
        <div className="float-left mr-2 sm:mr-3 mb-2 lg:float-none lg:mr-0 lg:mb-0 lg:flex-shrink-0">
            <img 
                src={Ed4}
                alt="Historical Document"
                className="w-[100px] h-[100px] xs:w-[110px] xs:h-[110px] sm:w-[120px] sm:h-[120px] md:w-[150px] md:h-[120px] lg:w-[186px] lg:h-[150px] object-fill rounded shadow-sm"
            />
        </div>
        <div className="lg:flex-1 w-full">
            <p className="text-black leading-relaxed text-xs sm:text-sm dark:text-white max-w-full">
                After the interruption of his formal education, Maududi turned to journalism in order to make 
                his living. In 1918, he was already contributing to a leading Urdu newspaper, and in 1920, at 
                the age of 17, he was appointed editor of Taj, which was being published from Jabalpore, a 
                city in the province now called Madhya Pradesh, India. Late in 1920, Maududi came to Delhi 
                and first assumed the editorship of the newspaper Muslim (1921-23), and later of al-Jam'iyat 
                (1925-28), both of which were the organs of the Jam'iyat-i 'Ulama-i Hind, an organisation of 
                Muslim religious scholars. Under his editorship, al-Jam'iyat became the leading newspaper 
                of the Muslims of India.
            </p>
        </div>
    </div>
</div>


                        <div className="mb-4 sm:mb-4 lg:mb-6">
                            <h2 className="text-blue-500 font-normal mb-2 sm:mb-3 text-sm sm:text-base dark:text-white">
                                Interest in politics
                            </h2>
                            <div className="block lg:flex lg:gap-4 mb-3">
                                <div className="float-left mr-2 sm:mr-3 mb-2 lg:float-none lg:mr-0 lg:mb-0 lg:flex-shrink-0">
                                    <img 
                                        src={Ed5}
                                        alt="Political Meeting"
                                        className="w-[120px] h-[120px] xs:w-[130px] xs:h-[130px] sm:w-[150px] sm:h-[150px] md:w-[170px] md:h-[140px] lg:w-[186px] lg:h-[150px] object-fill mx-auto lg:mx-0"
                                    />
                                </div>
                                <div className="flex-1">
                                    <p className="text-black leading-normal text-xs sm:text-sm dark:text-white max-w-[738px]">
                                        Around the year 1920, Maududi also began to take some interest in politics. He participated 
                                        in the Khilafat Movement, and became associated with the Tahrik-e Hijrat, which was a 
                                        movement in opposition to the British rule over India and urged the Muslims of that country 
                                        to migrate en masse to Afghanistan. However, he fell foul of the leadership of the movement 
                                        because of his insistence that the aims and strategy of the movement should be realistic 
                                        and well-planned. Maududi withdrew more and more into academic and journalistic 
                                        pursuits.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4 sm:mb-4 lg:mb-6">
                            <h2 className="text-blue-600 font-normal mb-2 sm:mb-3 lg:mb-4 text-sm sm:text-base dark:text-white">
                                First book
                            </h2>
                            <p className="text-black leading-relaxed text-xs sm:text-sm dark:text-white">
                                During 1920-28, Maulana Maududi also translated four different books, one from Arabic and the rest from English. He also made his mark on the academic life of the Subcontinent by writing his first major book, al-Jihad fi al-Islam. This is a masterly treatise on the Islamic law of war and peace. It was first serialised in al-Jam'iyat in 1927 and was formally published in 1930. It was highly acclaimed both by the famous poet-philosopher Muhammad Iqbal (d. 1938) and Maulana Muhammad Ali Jauhar (d. 1931), the famous leader of the Khilafat Movement. Though written during his '20s, it is one of his major and most highly regarded works.
                            </p>
                        </div>

                        <div className="mb-4 sm:mb-4 lg:mb-6">
                            <h2 className="text-blue-500 font-normal mb-2 sm:mb-3 text-sm sm:text-base dark:text-white">
                                Research and writings
                            </h2>
                            <div className="block lg:flex lg:gap-4 mb-3">
                                <div className="float-left mr-2 sm:mr-3 mb-2 lg:float-none lg:mr-0 lg:mb-0 lg:flex-shrink-0">
                                    <img 
                                        src={Ed6}
                                        alt="Historical Document"
                                        className="w-[120px] h-[120px] xs:w-[130px] xs:h-[130px] sm:w-[150px] sm:h-[150px] md:w-[170px] md:h-[140px] lg:w-[186px] lg:h-[150px] object-fill mx-auto lg:mx-0"
                                    />
                                </div>
                                <div className="flex-1">
                                    <p className="text-black leading-normal text-xs sm:text-sm dark:text-white">
                                        After his resignation from al-Jam'iyat in 1928, Maududi moved to Hyderabad and devoted himself to research and writing. It was in this connection that he took up the editorship of the monthly Tarjuman al-Qur'an in 1933, which since then has been the main vehicle for the dissemination of Maududi's ideas. He proved to be a highly prolific writer, turning out several scores of pages every month. Initially, he concentrated on the exposition of ideas, values and basic principles of Islam. He paid special attention to the questions arising out of the conflict between the Islamic and the contemporary Western world. 
                                    </p>
                                </div>
                            </div>
                            <div className="mb-3 sm:mb-4 lg:mb-6">
                                <p className="text-black leading-relaxed text-xs sm:text-sm dark:text-white">
                                    He also attempted to discuss some of the major problems of the modern age and sought to present Islamic solutions to those problems. He also developed a new methodology to study those problems in the context of the experience of the West and the Muslim world, judging them on the theoretical criterion of their intrinsic soundness and viability and conformity with the teachings of the Qur'an and the Sunnah. His writings revealed his erudition and scholarship, a deep perception of the significance of the teachings of the Qur'an and the Sunnah and a critical awareness of the mainstream of Western thought and history. All this brought a freshness to Muslim approach to these problems and lent a wider appeal to his message.
                                </p>
                            </div>
                            <div className="mb-4 sm:mb-4 lg:mb-6">
                                <p className="text-black leading-relaxed text-xs sm:text-sm dark:text-white">
                                    In the mid '30s, Maududi started writing on major political and cultural issues confronting the Muslims of India at that time and tried to examine them from the Islamic perspective rather than merely from the viewpoint of short-term political and economic interests. He relentlessly criticised the newfangled ideologies which had begun to cast a spell over the minds and hearts of his brethren-in-faith and attempted to show the hollowness of those ideologies. In this connection, the idea of nationalism received concerted attention from Maududi when he forcefully explained its dangerous potentialities as well as its incompatibility with the teachings of Islam. Maududi also emphasised that nationalism in the context of India meant the utter destruction of the separate identity of Muslims. In the meantime, an invitation from the philosopher-poet Allama Muhammad Iqbal persuaded him to leave Hyderabad and settle down at a place in the Eastern part of Punjab, in the district of Pathankot. Maududi established what was essentially an academic and research centre called Darul-Islam where, in collaboration with Allama Iqbal, he planned to train competent scholars in Islamics to produce works of outstanding quality on Islam, and above all, to carry out the reconstruction of Islamic Thought.
                                </p>
                            </div>
                        </div>

                        <div>
                            <div className="mb-4 sm:mb-4 lg:mb-6">
                                <h2 className="text-blue-600 font-normal mb-2 sm:mb-3 lg:mb-4 text-sm sm:text-base dark:text-white">
                                    Jamaat-e-Islami
                                </h2>
                                <p className="text-black leading-relaxed text-xs sm:text-sm dark:text-white">
                                    Around the year 1940, Maududi developed ideas regarding the founding of a more comprehensive and ambitious movement and this led him to launch a new organisation under the name of the Jamaat-e-Islami. Maududi was elected Jamaat's first Ameer and remained so till 1972 when he withdrew from the responsibility for reasons of health.
                                </p>
                            </div>
                            <div className="mb-4 sm:mb-4 lg:mb-6">
                                <h2 className="text-blue-600 font-normal mb-2 sm:mb-3 lg:mb-4 text-sm sm:text-base dark:text-white">
                                    Struggle & persecution
                                </h2>
                                <p className="text-black leading-relaxed text-xs sm:text-sm dark:text-white">
                                    After migrating to Pakistan in August 1947, Maududi concentrated his efforts on establishing a truly Islamic state and society in the country. Consistent with this objective, he wrote profusely to explain the different aspects of the Islamic way of life, especially the socio-political aspects. This concern for the implementation of the Islamic way of life led Maududi to criticise and oppose the policies pursued by the successive governments of Pakistan and to blame those in power for failing to transform Pakistan into a truly Islamic state. The rulers reacted with severe reprisal measures. Maududi was often arrested and had to face long spells in prison.
                                </p>
                            </div>
                            <div>
                                <p className="text-black leading-relaxed text-xs sm:text-sm dark:text-white">
                                    During these years of struggle and persecution, Maududi impressed all, including his critics and opponents, by the firmness and tenacity of his will and other outstanding qualities. In 1953, when he was sentenced to death by the martial law authorities on the charge of writing a seditious pamphlet on the Qadyani problem, he resolutely turned down the opportunity to file a petition for mercy. He cheerfully expressed his preference for death to seeking clemency from those who wanted, altogether unjustly, to hang him for upholding the right. With unshakeable faith that life and death lie solely in the hands of Allah, he told his son as well as his colleagues: "If the time of my death has come, no one can keep me from it; and if it has not come, they cannot send me to the gallows even if they hang themselves upside down in trying to do so." His family also declined to make any appeal for mercy. His firmness astonished the government which was forced, under strong public pressure both from within and without, to commute the death sentence to life imprisonment and then to cancel it.
                                </p>
                            </div>
                        </div>

                        <div>
                            <div className="mb-4 sm:mb-4 lg:mb-6">
                                <h2 className="text-blue-600 font-normal mb-2 sm:mb-3 lg:mb-4 text-sm sm:text-base dark:text-white">
                                    Intellectual contribution
                                </h2>
                                <p className="text-black leading-relaxed text-xs sm:text-sm dark:text-white">
                                    Maulana Maududi has written over 120 books and pamphlets and made over a 1000 speeches and press statements of which about 700 are available on record.
                                </p>
                            </div>
                            <div className="mb-4 sm:mb-4 lg:mb-6">
                                <p className="text-black leading-relaxed text-xs sm:text-sm dark:text-white">
                                    Maududi's pen was simultaneously prolific, forceful and versatile. The range of subjects he covered is unusually wide. Disciplines such as Tafsir, Hadith, law, philosophy and history, all have received the due share of his attention. He discussed a wide variety of problems — political, economic, cultural, social, theological etc. — and attempted to state how the teachings of Islam were related to those problems. Maududi has not delved into the technical world of the specialist, but has expounded the essentials of the Islamic approach in most of the fields of learning and inquiry. His main contribution, however, has been in the fields of the Qur'anic exegesis (Tafsir), ethics, social studies and the problems facing the movement of Islamic revival. His greatest work is his monumental tafsir in Urdu of the Qur'an, Tafhim al-Qur'an, a work he took 30 years to complete. Its chief characteristic lies in presenting the meaning and message of the Qur'an in a language and style that penetrates the hearts and minds of the men and women of today and shows the relevance of the Qur'an to their everyday problems, both on the individual and societal planes. He translated the Qur'an in direct and forceful modern Urdu idiom. His translation is much more readable and eloquent than ordinary literal translations of the Qur'an. He presented the Qur'an as a book of guidance for human life and as a guide-book for the movement to implement and enforce that guidance in human life. He attempted to explain the verses of the Qur'an in the context of its total message. This tafsir has made a far-reaching impact on contemporary Islamic thinking in the Subcontinent, and through its translations, even abroad.
                                </p>
                            </div>
                            <div>
                                <p className="text-black leading-relaxed text-xs sm:text-sm dark:text-white">
                                    The influence of Maulana Maududi is not confined to those associated with the Jamaat-e-Islami. His influence transcends the boundaries of parties and organisations. Maududi is very much like a father-figure for Muslims all over the world. As a scholar and writer, he is the most widely read Muslim writer of our time. His books have been translated into most of the major languages of the world Arabic, English, Turkish, Persian, Hindi, French, German, Swahili, Tamil, Bengali, etc. and are now increasingly becoming available in many more of the Asian, African and European languages.
                                </p>
                            </div>
                        </div>

                        {/* Video Player Section */}
                        <div className="mb-4 sm:mb-6 lg:mb-6 flex justify-center px-2 sm:px-0 m-3">
                            {/* <div className="w-full max-w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl"> */}
                                <VideoPlayer/>
                            {/* </div> */}
                        </div>

                        <div>
                            <div className="mb-4 sm:mb-4 lg:mb-6">
                                <h2 className="text-blue-600 font-normal mb-2 sm:mb-3 lg:mb-4 text-sm sm:text-base dark:text-white">
                                    Travels & journeys abroad
                                </h2>
                                <p className="text-black leading-relaxed text-xs sm:text-sm dark:text-white">
                                    The several journeys which Maududi undertook during the years 1956-74 enabled Muslims in many parts of the world to become acquainted with him personally and appreciate many of his qualities. At the same time, these journeys were educative for Maududi himself as well as they provided to him the opportunity to gain a great deal of first-hand knowledge of the facts of life and to get acquainted with a large number of persons in different parts of the world. During these numerous tours, he lectured in Cairo, Damascus, Amman, Makkah, Madinah, Jeddah, Kuwait, Rabat, Istanbul, London, New York, Toronto and at a host of international centres. During these years, he also participated in some 10 international conferences. He also made a study tour of Saudi Arabia, Jordan (including Jerusalem), Syria and Egypt in 1959-60 in order to study the geographical aspects of the places mentioned in the Qur'an. He was also invited to serve on the Advisory Committee which prepared the scheme for the establishment of the Islamic University of Madinah and was on its Academic Council ever since the inception of the University in 1962.
                                </p>
                            </div>
                            <div className="mb-4 sm:mb-4 lg:mb-6">
                                <p className="text-black leading-relaxed text-xs sm:text-sm dark:text-white">
                                    He was also a member of the Foundation Committee of the Rabitah al-Alam al-Islami, Makkah, and of the Academy of Research on Islamic Law, Madinah. In short, he was a tower of inspiration for Muslims the world over and influenced the climate and pattern of thought of Muslims, as the Himalayas or the Alps influence the climate in Asia or Europe without themselves moving about.
                                </p>
                            </div>
                        </div>

                        <div className="mb-4 sm:mb-4 lg:mb-6">
                            <h2 className="text-blue-500 font-normal mb-2 sm:mb-3 text-sm sm:text-base dark:text-white">
                                His last days
                            </h2>
                            <div className="flex flex-col sm:flex-col lg:flex-row gap-2 lg:gap-4 mb-3">
                                <div className="flex-shrink-0 self-center lg:self-start">
                                    <img 
                                        src={Ed7}
                                        alt="Historical Document"
                                        className="w-[120px] h-[120px] xs:w-[130px] xs:h-[130px] sm:w-[150px] sm:h-[150px] md:w-[170px] md:h-[140px] lg:w-[186px] lg:h-[150px] object-fill mx-auto lg:mx-0"
                                    />
                                </div>
                                <div className="flex-1">
                                    <p className="text-black leading-normal text-xs sm:text-sm dark:text-white max-w-[738px]">
                                        In April 1979, Maududi's long-time kidney ailment worsened and by then he also had heart problems. He went to the United States for treatment and was hospitalised in Buffalo, New York, where his second son worked as a physician. Even at Buffalo, his time was intellectually productive. He spent many hours reviewing Western works on the life of the Prophet and meeting with Muslim leaders, their followers and well-wishers. Following a few surgical operations, he died on September 22, 1979 at the age of 76. His funeral was held in Buffalo, but he was buried in an unmarked grave at his residence (Ichra) in Lahore after a very large funeral procession through the city.
                                    </p>
                                </div>
                            </div>
                            <p className="text-black leading-normal text-xs sm:text-sm dark:text-white">
                                May Allah bless him with his mercy for his efforts and reward him amply for the good that he has rendered for the nation of Islam (Ummah).
                            </p>
                        </div>

                        {/* Books List */}
                        <div className="mb-4 sm:mb-6">
                            <h2 className="text-base sm:text-lg md:text-xl font-bold mb-3 sm:mb-4 dark:text-white">
                                Some of his books translated into English:
                            </h2>
                            <ul className="list-disc p-3 sm:p-4 rounded-lg space-y-1">
                                {books.map((book, index) => (
                                    <li key={index} className="text-gray-800 dark:text-white text-xs sm:text-sm md:text-base">
                                        {book}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Maududi;