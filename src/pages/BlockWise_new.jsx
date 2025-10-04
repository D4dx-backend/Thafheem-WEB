import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import {
  BookOpen,
  FileText,
  User,
  Heart,
  Play,
  Copy,
  Pause,
  Bookmark,
  Share2,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  X,
  Info,
  LibraryBig,
  Notebook,
} from "lucide-react";
import HomeNavbar from "../components/HomeNavbar";
import Transition from "../components/Transition";
import BookmarkService from "../services/bookmarkService";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";
import { ToastContainer } from "../components/Toast";
import InterpretationBlockwise from "./InterpretationBlockwise";
import Bismi from "../assets/bismi.jpg";
import { useTheme } from "../context/ThemeContext";
import {
  fetchBlockWiseData,
  fetchArabicVerses,
  fetchAyahTranslations,
  fetchSurahs,
} from "../api/apifunction";

const BlockWise = () => {
  const [activeTab, setActiveTab] = useState("Translation");
  const [activeView, setActiveView] = useState("Block wise");
  const [showInterpretation, setShowInterpretation] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toasts, removeToast, showSuccess, showError } = useToast();
  const { quranFont } = useTheme();
  const { surahId } = useParams();

  // State management for API data
kWise;locdefault Bxport 
};

e  );
    </>
   </div>
      </div>    )}
          /div>
        <
       </div>         >
           /
        ror}r={showErowErro   sh         }
      Successs={show  showSucces           
        }}          
     null);tedNumber(Selecset              ;
      e)ation(falsetrprtetShowIn    se             
    {Close={() =>     on      
       n" lang="e              ipt={1}
                   ing()}
  ber.toStrelectedNumrange={s                }
  urahId)parseInt(s   surahId={              umber}`}
 electedNurahId}-${setation-${sinterpr    key={`            ise
  BlockwionInterpretat   <            w-full">
  relative flow-y-autoh] over0vmax-h-[94xl w-xs sm:max-lg max-w- rounded-8]2C3bg-[#2Aite dark:Name="bg-whiv class         <d
      sm:p-4">z-50 p-2fy-center center justis-0 flex itemcity-7 bg-opaay-500et-0 bg-gr="fixed insclassName     <div         && (
tedNumberion && selecrpretat {showInte
         ion */}pretaterpup for Intrlay Po   {/* Ove

         </div>>
           </div  >
       </div            >
     </button           
   />:h-4"3 sm:w-4 sm-3 h-lassName="wht cChevronRig    <              h</span>
xt Suran>Ne  <spa               >
            ed"
     llow-not-aabled:cursor dis:opacity-50x] disabled-[48px] sm:min-hmin-h-[44pors ition-col-300 transer:text-gray0 dark:hov90ray-over:text-gwhite htext-3A3F] dark:#32ark:bg-[y-600 d-sm text-gradowshaunded-full 300 roorder-gray-te border bt-sm bg-whi sm:texpy-2 text-xs-3 sm:px-4 px-2  space-xs-center"flex itemlassName=     c         114}
    surahId) >= eInt(parssabled={        di         }
 leNextSurahClick={hand         onn
         to   <but          
   ton>  </but    
          >ah</span SurBeginning of    <span>         >
      /4 sm:h-4" sm:w--3 h-3me="wclassNawUp <Arro               
             >x]"
      n-h-[48p sm:miin-h-[44px]olors mon-cti300 transi:text-gray-dark:hovergray-900 r:text-hite hovext-wark:te23A3F] dark:bg-[#3gray-600 ddow-sm text-ded-full sha0 roungray-30r-border bordehite -sm bg-wt-xs sm:text4 py-2 tex3 sm:px-pace-x-2 px-s-center s="flex itemssName       cla        
             }
        oth" })avior: "smo: 0, behlTo({ topw.scrol       windo          >
   k={() =onClic               n
         <butto     n>

          </butto           >
</spanSurahous span>Previ     <            
 h-4" />3 sm:w-4 sm:="w-3 h-assNamevronLeft cl     <Che              >
            lowed"
   sor-not-ald:cur-50 disableled:opacitysabdipx] sm:min-h-[48x] [44pmin-h-n-colors  transitio00ay-3gr:hover:text-darkxt-gray-900 ite hover:te-whk:textdar-[#323A3F] ark:bgt-gray-600 ddow-sm texl shafulnded-gray-300 rour border--white bordebg-sm  sm:text-xs4 py-2 textpx-3 sm:px-ace-x-2 ter spx items-cename="fleclassN           
       rahId) <= 1}t(suseInd={par   disable             usSurah}
  eviodlePronClick={han          
           <button            
 -x-6">lg:space:space-x-4 -2 smspace-xcenter  justify-ms-centerte:flex ien smddame="hiassNv cl        <di */}
      youttal latop: Horizon Desk        {/*>

      iv    </d
           </div>      >
         /button          <       
 " /> h-3me="w-3sNaight clasevronR  <Ch                  /span>
>Next Surah< <span                      >
              wed"
 r-not-allocurso0 disabled:d:opacity-5le[44px] disabmin-h--lg oundedgray-600 rr-rk:bordegray-300 daorder-order b00 bt-gray-3er:texark:hovay-900 d:text-grte hoverk:text-whi3A3F] darbg-[#32600 dark:y- text-graxt-xsx-4 py-2 tespace-x-2 pfy-center  justitems-centerflex i6px] .973"w-[1 className=                14}
   Id) >= 1Int(surahabled={parsedis           }
         eNextSurahandlnClick={h   o                
  <button            
     r">enteustify-c"flex jassName=cl<div              h */}
   urat Srow: Nexcond  Se    {/*    
        
    </div>          
    </button>              h</span>
  Suraof eginning     <span>B            3" />
    ="w-3 h-amewUp classN  <Arro        
                  >
          [44px]"-lg min-h--600 roundedray:border-g300 darkgray-order- b border-300text-grayver:00 dark:hoxt-gray-9hover:tewhite  dark:text-bg-[#323A3F]-600 dark:t-graytext-xs tex px-4 py-2  space-x-2nterustify-center jex items-ce1 fl"flex-=className                    }
                   )
 mooth" }avior: "s top: 0, behTo({indow.scroll      w                =>
 lick={()nC          o          n
     <butto           
  tton>
    </bu    
          h</span>s Surarevioun>P    <spa                " />
e="w-3 h-3sNamft clas <ChevronLe        
                     >    d"
    allowe-not-ed:cursorty-50 disablopaciisabled:px] d-[4496px] min-h-[173.ed-lg w-600 roundayrder-grbo-300 dark:-grayder borderborxt-gray-300 ark:hover:teay-900 d-grxthover:te-white extk:t#323A3F] darg-[dark:b600 -gray-s text-2 text-x4 pyx-space-x-2 pfy-center er justiitems-cent-1 flex "flex className=                1}
    ) <=rahIdnt(suparseIdisabled={                 
   urah}sSiouevhandlePronClick={                   utton
     <b            >
  e-x-2"x spacfleassName="<div cl        
        */} Beginning s +ow: Previout r Firs{/*              ">
  ce-y-2dden spa:hiName="sm  <div class           
 ically */}ert: Stack v {/* Mobile            ed-lg">
 ound8 rmt-sm:y-4 mt-6 -4 py-3 sm:psm:px-3  pxr-gray-700dark:borde00 -2der-grayray-900 borrk:bg-grder-t date bowhime="bg-lassNaiv c          <d  ion */}
gatttom Navi/* Bo          {   })}

             );
           /div>
            <iv>
              </d
          </button>                  />
 :h-5"  sm:w-5 sm-4 h-4e="wassNam cl   <Share2                     >
         "
         Share blockle="   tit                         }}
                  }
                    
  are");led to shError("Fai        show                  ed", e);
ailare f("Shorconsole.err                         (e) {
 h     } catc                     }
                 
        );ard!"ipbo clied to"Link copwSuccess(         sho                  ;
  )                         }`
  areUrlt}\n${shshareTex        `${                   t(
   rd.writeTexclipboaavigator.ait n      aw                      } else {
                     });
                                 hareUrl,
rl: s    u                       ,
   xtTeext: share        t               
       ,y"an Studfheem - Quritle: "Tha   t                       
    .share({ort navigatai          aw                  are) {
ator.sh if (navig                        href;

 ion..locatrl = windowconst shareU                
          nd}`;start}-${e${ses • VerrahId} urah ${suxt = `Sst shareTe    con                   try {
                   
        ) => {k={async (      onClic               ter"
  justify-cencenteritems-x  flepx]:min-w-[44w-[40px] sm min-[44px]-h- sm:minh-[40px]rs min-ion-colo transitunded-lg800 ror:bg-gray-hove00 dark:y-1:bg-graery-300 hovver:text-gra400 dark:hok:text-gray--700 dar-grayhover:textgray-500 p-2 text-5 sm:me="p-1. classNa              
       tton  <bu             */}
      Share /* {               

    on> </butt                  
        )}             
  m:h-5" />h-4 sm:w-5 se="w-4 lassNamBookmark c           <                ) : (
              div>
     "></-currentder bor-b4 borderh-4 w-nded-full n rou"animate-spilassName=div c          <             ? (
 t}-${end}`] ng[`${starokmarkLoadiBoock  {bl            
         >                  
 }`]}}-${endrtstakLoading[`${mar={blockBookabled        dis     "
         rk blockokmatle="Bo        ti            }}
                
               }                 );
  })                  
      lse,fa]:  [key                
           rev,       ...p                    > ({
 ing((prev) =rkLoadckBookma      setBlo                   ly {
  final       }                
 lock");ve bailed to saror("F showEr                     );
    :", errkmark block booled toFai"r(ro.eronsole    c                   {
    rr) } catch (e               );
        t}-${end}`ock ${starSaved bluccess(`     showS                       );
                 
          end                     rt,
          sta               Id,
       ahsur                            ,
   userId                       ookmark(
  ce.addBlockBvirkSerkma Boo       await           ;
        UserId(user)tEffectivegeService.Bookmark userId = nst co                
         ));           }       
        rue, tkey]:  [                      .prev,
           ..               ({
       ng((prev) =>markLoadiBook    setBlock                
        try {                   
   }-${end}`;{startt key = `$ns  co                        }

                    
    return;                          });
                         },
                   
        ",blocksokmark  in to bo "Sign   message:                          me,
 on.pathna locati       from:                     tate: {
       s                  {
      gn",e("/siigat   nav               
        ks");okmark bloc to bogn in si"Please( showError                        er) {
 if (!us                  {
      > ync () =nClick={as      o           `}
           }                ""
    :                     
  allowed" cursor-not-y-50"opacit?                     d}`]
      t}-${eng[`${staroadinkBookmarkL  bloc                  
    fy-center ${ustiter jems-cenlex it] f-[44px:min-ww-[40px] smpx] min--[44sm:min-hn-h-[40px] ors mi-col transitioned-lg round:bg-gray-800ver-100 dark:hoaygr0 hover:bg-ray-30text-ghover:ark:y-400 drak:text-g-700 darayover:text-gray-500 hp-2 text-gr`p-1.5 sm:className={                   on
   utt      <b         
     rk */}Bookma      {/*        
       </button>
                    -5" />
sm:w-5 sm:hw-4 h-4 "ssName=FileText cla        <           >
                   d"
    worby rd title="Wo                     }}
               
        });                      hname },
  on.patcati{ from: lo     state:               {
       ${start}`, {surahId}/ord/$ord-by-wavigate(`/w       n                 ) => {
nClick={(   o               ter"
    ify-censt-center jux itemspx] flesm:min-w-[44-w-[40px] h-[44px] min sm:min-0px]ors min-h-[4nsition-colded-lg traay-800 rounhover:bg-gr100 dark::bg-gray-er300 hovt-gray-texhover: dark:xt-gray-400te0 dark:t-gray-70texover:-500 h-gray2 text sm:p-e="p-1.5  classNam                  on
  <butt               /}
     ord * Word by W Note/Page -    {/*                tton>

bu      </         " />
     w-5 sm:h-5 sm:me="w-4 h-4en classNa  <BookOp                        >
          "
      ilsew ayah detatitle="Vi            
                }}            tUrl);
    (targeigate      nav                  `;
e-${start}urahId}#vers{surah/$ `/setUrl =rgconst ta                  > {
      k={() =      onClic          
      -center"fytijuser ntx items-cex] flem:min-w-[44p40px] sx] min-w-[m:min-h-[44px] sn-h-[40p miition-colorslg trans rounded-ay-800hover:bg-grark:g-gray-100 d:bhover0 -30xt-gray:teark:hover400 dk:text-gray-0 dar70-gray-er:texthovay-500  text-gr5 sm:p-2me="p-1.     classNa                    <button
          
       */}ah Detail k - Ay     {/* Boo       
        on>
   </butt              " />
   h-5-5 sm:m:w sw-4 h-4="classNameay         <Pl              >
                    audio"
 e="Play     titl                     }}
                  oon!");
oming sk feature co playbacs("AudicesuchowS           s             => {
lick={() nC         o             nter"
-ce justifyterms-cenx] flex iten-w-[44p0px] sm:mi[4in-w--[44px] min-hm:m[40px] sin-h-ors moln-cnsitiotraded-lg ungray-800 rohover:bg-00 dark:g-gray-1er:b-300 hov-gray:hover:textrk-gray-400 da00 dark:texttext-gray-7r:ove00 h-gray-5text5 sm:p-2 ame="p-1.    classN          
        utton         <b       y */}
        {/* Pla          />

                  }
        ={showError   showError             }
      ss={showSuccessce showSuc                    
 }d={surahId   surahI                  icSlice}
 Slice={arab  arabic                d} 
    {ennd=   e               
    rt}  start={sta                   Button 
       <Copy               */}
  {/* Copy            
        sm:pt-4">p-2 pt-31 sm:gaap- gtarty-sstifp juflex-wraflex me="assNa    <div cl           
         />
           kIndex} 
 occkIndex={bllo        b  
            end={end}            } 
       art={start          st     on 
     nslatiockTra        <Bl       ck */}
    blor thistion Text fo* Transla   {/         v>

         </di               </p>
                 "}
   ext... Arabic tding     : "Loa                 n(" ")
  joi           .                
           )         `
         tart + idx}﴾ni} ﴿${s_uthma${verse.text    `                 
           se, idx) =>  (ver                    
               .map(                
     icSlice? arab                     
    > 0ce.lengthabicSli {ar                   >
            
          erif` }}ont}', squranFy: `'${milontFayle={{ f st                    
 -2"t-white pxrk:tex-gray-900 danter textose text-celoding-leatext-xl t-2xl xl:texxt-xl lg:t-lg md:teexsm:text-lg "tName=     class        p
               <            -8">
  lg:pmd:p-6 -3 sm:p-4 ssName="pv cla<di                 >

       </div       an>
          </sp           }
    nd}` : ""t ? `-${end !== star e &&       {end      }
         yahs {start: Adex + 1}blockIn { Block                     um">
 font-mediray-200dark:text-gy-700 text-graxt-sm xs sm:tetext-ame="span classN         <           een">
etwfy-br justis-centeex itemt-4 fl:p pt-3 sm-4sm:px="px-3  classNamediv       <   
                 >s"
       tion-coloransif6] tr8f2e:bg-[#ef2f6] activr:bg-[#e8-800 hoveay-grk:hover:bg700 darray-r-g dark:border-gray-200border bordeb-6 :m4 sm-xl mb-ndedroume="  classNa              ${end}`}
  t}-ex}-${star-${blockInd={`block     key       <div
                  
    rn (   retu         ];

     : [      d)
       tart - 1, enlice(scVerses.s ? arabi            ses)
   ery(arabicVray.isArralice = Art arabicScons          t;

    ar   st           ndAya ||
  m.egeIte        ran       nd ||
  rangeItem.e        ||
       .to    rangeItem         
    ||eItem.ayato        rang|
         Item.ayaTo |geran              end =
  nst      co                 1;
        ||
 m.startAyaeIte      rang      ||
    .start temngeI    ra            m.from ||
    rangeIte          ||
  m afroItem.ay      range
          m ||em.ayaFro rangeIt            rt =
   staonst         c{
      x) => de, blockInem((rangeItRender().mapngesTo    {getRa/}
        es *on aya rang based ender blocks/* R      {      :pb-8">
6 smx-auto pb-] m90pxm:max-w-[12-full s"max-wassName=v cl       <di */}
   ntentMain Co    {/*       v>

 </di
         iv>      </d    v>
  di</           iv>
     </d              >
iv       </d        ton>
       </but      
          Block                   >
   on-colors"siti trandowium sha-xs font-medxt ted-full0 roundeext-gray-90 bg-white tt-whitek dark:texark:bg-blac5px] d-[5x-3 py-1.5 w sm:p-2sName="pxbutton clas        <          tton>
  /bu    <           
         Ayah          
                  >          rs"
coloansition--700 trt-grayver:texium hot-medonext-xs f00 ter:bg-gray-8rk:hovite dat-whtexk:hover:t-white darll dark:texunded-furo00  text-gray-5-[55px]x-3 py-1.5 wm:p"px-2 sssName=         cla     }
        `)h/${surahId}suranavigate(`/) => onClick={(                  
    ton<but                 
   w-sm">ll p-1 shadorounded-fu23A3F] #3k:bg-[[115px] darray-100 w-g-gex bName="flssiv cla        <d          >
:hidden"end sm justify-"flexme=v classNa     <di
           button>   </           span>
          </       o
   udi  Play A               um">
   nt-medim:text-sm foxt-xs sme="tepan classNa<s                " />
  w-4 sm:h-4h-3 sm:e="w-3 ssNamy cla<Pla                 >
 px-2"n-h-[44px] n-colors miitio transxt-cyan-300k:hover:ten-400 dartext-cyaan-600 dark:r:text-cy0 hovext-cyan-50e-x-2 teter spacx items-censName="fleclasn tto    <bu          ">
  tweeny-beflex justifName="  <div class          }
  o */y Audi   {/* Pla           /div>

     <  k>
            </Lin   >
          </span     
           urah info     S          ne">
     rliver:undeinter horsor-poite cuxt-whdark:te0 y-60sm text-gras sm:text-me="text-xspan classNa     <         `}>
    urahId}nfo/${shi to={`/suraLink          < />
      -white":textay-900 darkh-5 text-gr sm:m:w-5h-4 same="w-4 fo classN <In           ">
    pace-x-2y-start sifst juerent items-came="flexv classN         <di
     0">ace-y-y-2 sm:spce-uto spax-a90px] m-w-[12sm:maxull -w-fn maxtify-betweeflex-row jusflex-col sm:flex e="Namss    <div cla      
     </div>
        div>
          </  div>
            </       utton>
     </b           wise
         Block        >
      n-colors"w transitioadot-medium shm fonxs sm:text-sext-ded-full t roun-900t-grayhite texite bg-wwh:text-black darkbg-1.5 dark::px-4 py-m:px-3 lg-2 same="px classN <button         
        /button>        <    
      yah wise        A                     >
       
  )}Id}`h/${surahigate(`/suraav{() => n   onClick=          
       "stion-color-700 transixt-grayer:te hovt-mediumfont-sm -xs sm:tex0 text-80bg-grayer:te dark:hovt-whihover:texite dark:-whxtdark:teounded-full y-500 rtext-gra4 py-1.5 lg:px-x-2 sm:px-3 "pme= classNa               
       <button              sm">
 w- p-1 shadonded-full rou#323A3F]k:bg-[ay-100 darex bg-gr"flame=sNasiv cl        <d    
    lock">hidden sm:bght-0 e top-0 risolute="ab classNam     <div         ns */}
 wise buttoockh wise / Bl Desktop Aya     {/*
          </div>
                  />
       ert"
    -4 dark:inv9px] mb[52.6px] h-ame="w-[23   classN       "
        "Bismi   alt=           Bismi}
     src={        g
             <im    ">
        px-4m: px-2 s-centercol itemsex-"flex fl className=  <div           
 elative">sm:mb-8 rb-6 "mlassName=   <div c     ls */}
     Controthillah wi Bism {/*  
         </div>
          </div>
             on>
        </butt        -5" />
    sm:w-5 sm:h h-4="w-4ame classN      <Heart        ter">
     justify-cener items-cent flexw-[44px]x] min-min-h-[44pors nsition-colgray-300 traover:text-rk:h00 datext-gray-4ark:00 d-gray-8xt hover:tep-2="lassNametton c         <bu  
     /button>  <         con}
       {kabahI      
          nter">justify-cems-center  flex ite-w-[44px] minn-h-[44px]ors mition-colransiy-300 t-graver:textark:ho400 dgray-0 dark:text-ray-80ext-gp-2 hover:t"ssName=ton cla     <but        
   ">mb-6-4 sm:-600 mbay4 text-gre-x-acce-x-3 sm:sp spatify-centerlex juse="f classNam   <div           </h1>
              "}
|| "القرآنo?.arabic urahInfata?.skDloc  {b                  >
   }
       ial" }y: "Arile={{ fontFamyl st           "
    mb-4te mb-3 sm:k:text-whiray-900 darext-gold txl font-b:text-6xl xl:text-5 lg:text-4xlmdm:text-3xl 2xl s="text-   className                <h1
       6">
    mb-4 sm:mb-ter -censName="text   <div clas
         */}e itl Arabic T     {/*     /div>

   <           /div>
      <
        /div>         <>
           </button             /Link>
       <              /span>
     <        
         ing   Read                  >
   :underline"er hoverrsor-point-white cudark:textk blacxt-pins te-popfontm:text-sm ext-xs sName="tspan class        <         }`}>
     hId${suraeading/ to={`/r   <Link       
          >white" /text-k dark:t-blac tex5 lg:h-5m:h-4 lg:w-sm:w-4 s h-3 w-3sName="k clasboo<Note                x]">
    44pm:min-h-[px] s40um min-h-[dim font-met-sex:tt-xs sml texded-fuly-50 roung-graite hover:bext-wh0 dark:tray-80:hover:bg-gdarkay-600 t-grx-4 py-2 texg:p-2 sm:px-3 lspace-x-2 pxm:space-x-1 stems-center flex iassName="ton cl  <but          
        </button>        >
             </span           ion
     Translat                    
 -white">ark:textk dxt-blacoppins text-sm font-p:tetext-xs sme="an classNam        <sp      />
      white" rk:text-dat-black  tex:h-5lg:h-4 lg:w-5  sm:w-4 sm-3="w-3 hassNameyBig cl    <Librar           ">
     in-h-[44px]] sm:mn-h-[40pxhadow-sm mimedium sext-sm font- sm:tull text-xsounded-f-900 rtext-grayhite text-wk:darray-900 te dark:bg-gpy-2 bg-whi-3 lg:px-4 pxx-2 px-2 sm:ce- sm:spaspace-x-1center ms-="flex itesNamebutton clas  <         ">
       ms-centerlex itelassName="f    <div c       ">
     d-full p-1F] rounde3A332bg-[#dark:-100 me="bg-grayv classNa   <di         ">
  :mb-8nter mb-6 smustify-center jms-ceflex iteassName="     <div cl/}
       ng Tabs *dion/Reanslati/* Tra           {6">
 m:py-y-4 sy-900 pg-graark:bwhite d="bg-sNamediv clas         <abs */}
 der with THea     {/* 
     8">lg:px-m:px-6  s-auto px-3assName="mx  <div cl      ay-900">
:bg-grg-white darkn-h-screen buto mi"mx-ame=<div classNa     ion />
 ransit/>
      <TmoveToast} t={reasts} removeTotoasts={toasstContainer    <Toa <>
   
   eturn (

  r);
  }      </>
    
 </div>iv>
               </dn>
       </buttoain
       Try Ag                    >
"
      on-colorstransiti0 cyan-60g hover:bg-e rounded-ltext-whitcyan-500 x-4 py-2 bg-"pme=lassNa        c}
      d()reloaocation.> window.l() =onClick={         ton
             <but</p>
               
 {error}             mb-4">
  ay-400ext-grdark:t0 ext-gray-60"text-sm tme=<p classNa                </p>
        
ataock-wise do load BlFailed t              mb-2">
 0 text-lgext-red-40rk:t00 datext-red-5assName=" <p cl      er">
     text-centassName="v cl         <di>
 r"tify-cententer jus-ceex itemsg-black fldark:bwhite n bg-n-h-scree"miv className=       <dition />
 <Transi  >
      t} /oveToasveToast={rem remots}{toasner toasts=oastContai<T>
          <  eturn (
      r{
rror) te
  if (e/ Error sta  }

  /
    );
 </>
      </div>iv>
         </d
             </p>      ta...
  dag Block-wisedin      Loa       y-400">
 text-grak:0 darext-gray-60"tlassName=<p c        /div>
    -4"><0 mx-auto mb50r-cyan-b-2 bordeer-ordw-32 b-32 d-full hounden rnimate-spilassName="a     <div c">
       -centerextme="tsNa<div clas          ">
-centernter justify items-celex f:bg-gray-900-white darkcreen bg"min-h-sme=sNa <div clas/>
       ransition      <T />
   moveToast}oveToast={re} remts={toasts toasainerastCont<To      <>
   (
         returng) {
 f (loadinte
  istaading Lo
  // 
  };  })();
     nges;
 backRan fall    retur             }
 ;
      }),
        alVerses) totn(i + 4,: Math.mi   ayato        
   from: i,         aya({
     anges.pushkR    fallbac{
        ; i += 5) alVerses<= totet i = 1; i    for (l      ;
 Ranges = [] fallbackst con;
         th || 0.lengbicVerses?ara.length || Data? = ayaheserst totalV     cons
     : (() => {nges
      aRaa.ay  ? blockDatRanges
    rn hasValids)
    returse(every 5 venges lback raeate fal ranges, cro valid n If   //

      );e.endAya)
      rang       |
ge.end |         ran   ||
range.to            
 ||yato    range.a     To ||
    ya    (range.a
      tartAya) &&     range.s    tart ||
   range.s         
    ||range.from       m ||
     royafrange.a          om ||
  aFr.aynge  (ra=>
          (range) (
      .someaRangesblockData.ay0 &&
      th > ngs.leangeockData.ayaR    bl) &&
  ta.ayaRangesrray(blockDaray.isA Ar
     yaRanges &&ckData?.a      blo =
alidRangeshasV   const m API
 es froangya ralid af we have veck i  // Ch => {
  ender = ()sToRtRangegeng
  const enderiges for rpare ran  // Pre };

range}`;
 {range}-${rn `$
    retur-number"numbes " aack: returnallb // F   }
    range;
     return'-')) {
  ncludes(.i (range
    if as isrn, retuhas a dashady alre// If it      }
ange}`;
   range}-${r `${urn
      retge))) {t(String(ranex.tesrReg   if (numbed+$/;
 ^\x = /Regeconst numberformat
    -number"  to "numberonvert a number, cit's just/ If {
    />  (range) =ationRange =matInterpret
  const for );
vg>
  </s
   />
      "555424"0.Width=ketro       stColor"
 "curren stroke=      ntColor"
 urre    fill="c01Z"
    26367 2.33359 6..26172 2.370838 625784 2.406.4629C.25781 2.474 686 3.66667773 6.257C7.19699 4..677736328 469 8.3.4019 4.677753 8029 4.6.67285C8.447852 49868 8.4.20953 4.8308 8.87411 5.07 5.03125C7107 7.5136.03 6.6467 5768 4.2903393.35059C5.75 5.9375 32.96968 5.93789 164 2.6301C6.058533M6.26367 2.H1.84863Z 17.31646 12.61133166978 17.12.17.3848 61C12.7724 7.4925V12.77H118.27544961V45 17.68933 1. 17.38164 1.6895517.39 164C1.7631 17.31.84863876953ZM2 0.103L7.0487797.0293 0.83L 0.8798 7.018551.155359 7 5.7183 2.39205059C5.1255.125 3.356 4864.19 5.12515  5.450841086562C5.5V5.72 6.23146.8255 71611 6. 6.524.13381 73809C6.04306.55.46484 795218 54 7.33749 4.872C4.2039 8.5332 8.773443924 3. 9.75 2.04737309 10.96495C0.89076953 12.9714.2984 0.8.868253 279 09C1.2185 15.9605.9619V15. 126793 1.6146.0 1.67857 19 16.1511729C1.77531.88574 16.173 16.1939 4 1.9925 16.165104C2.0987262 16.1 2.18993174 15.9.3501 25.7686 15C2.45315.5222 2.307614.9624 5 98257 1.67627 14.144824C1.1.68945 12.9969 11.2034 2702 1.7079826 10.28C2..488 9875321 3.96 9.29260793 4.84391 9.105C4.566914 8.9228 4.8737675.17372 8.7 48029 8.55119C5.8.354459 5.77539 7.991 6.31991 587486.8299 7.812C072949 7.01 7.2 7.5857.62651.97136  78.119643252C527 8.8.51673 8.65.94523 2 8.70108 88965C9.24995762 8.89.07874 9.59.86617 .27251 C10.1797 9873.4912 9.485 10769 10.3611.44 1.295 15C12.798.978 12.7715 1289 14.3763135 12.74649 15.6.3506C12.33 16.4688H1188 1.8486077 16.46 16.9411 1.377067961C0.818.6973V17.49 0.876953 6181 18.9239.1218 0.8725C1.05037 1.123H1.2813L13.1768 19.2607 19.1149 13 19.0734503 13.8.8969C13.5847 161V18.6973584 17.49408 13. 16.9.583916.469 13516 3C13.112.611688H12.499 16.4 15.2962 13.3942 13.9776 5C13.59463 12.979.839 13.58 103.5581 9.68443 11C12.29119287 8.77445402 10.7 8.5.59834461 102C10.2631 8.9375 8.140693618 9. 9.61115 7.73653C9.29438 7.2253 9 7.93.42031 7.12971662 8 6.3242C7.93786 5.87305V6.21 7.6367266874 5.81656733 8.9.54829 5.03 4.0127C15472L9.8011445 4.8 9.819048171 3.7 9.89692323 3.59.8149219C66992 3.4 9.896 3.3317 9.529553.3808 1758C9.327 3.587L9.178713.58802 9.08984 45 8.87562 3.77 3.82971.6221.83008C828 38.36308  3.8305293 3.2205 7.64629C7.07036.07031 2.4 2.12551 7689 7.070517444 1.811C7.16 1.57034L7.36428 1.569343054 7.363269 1..47266 1.25677 7.12012C7.47913 7.41797 195 0.98292433 7.3550.878 6953C7.219887M7.04102 0.  d="
      th <pa
     >"
    t-whiteck dark:textext-blassName="     cla"
 svg3.org/2000/://www.ws="http  xmln"
    ne   fill="no
   20"="0 0 14 iewBox      v20"
="eight   h"
   ="14
      widthg (
    <svon =onst kabahIc };

  c;
    }
 `)urahId}e/${nextS`/blockwisgate(
      navi= 114) {xtSurahId <
    if (ne) + 1;t(surahIdrseInrahId = paconst nextSu
     => {h = ()leNextSura  const hand
  };

);
    }rahId}`ise/${prevSukwblocigate(`/{
      navd >= 1) vSurahI    if (pre 1;
surahId) -eInt(rsrahId = paconst prevSu=> {
    rah = () ePreviousSu const handlons
 tion functi
  // Naviga
};  );
etation(truewInterprtSho
    seber);(nummberectedNu    setSelmber) => {
lick = (numberCNuhandleonst ;

  c]) [surahId();
  },DataockWise
    loadBl
    };
  }
    ng(false);  setLoadi   ally {
      } finerr);
   data:", block-wise ng r fetchi("Erronsole.error     cossage);
   .meror(err    setEr) {
     (erratch      } cructure);
aStatta(ayahD setAyahDa        }));

 ns
      lationstralock ed from bpulat po// Will be"", nslation:     Tra    t: "",
  icTex     Arab     x + 1,
 indeumber:  n({
        , index) => s }, (_Versegth: total{ lenfrom(rray.e = AtaStructurnst ayahDa  co
      lityatibicompucture for ata strreate ayah d/ C        /[]);

esponse || (arabicResetArabicVers   se);
     iseResponsa(blockWckDattBlo
        se);
        ]rahId)),
t(suses(parseInicVerfetchArab        ),
  urahId)arseInt(sa(patWiseD fetchBlock
         e.all([Promist = awaisponse] Re arabicseResponse, [blockWi     const

   | 7;ah?.ayahs |urrrentSs = cuotalVerse t  const);
      rahId)(suInt= parse ==.numbernd(s => sa.fi= surahsDaturah tSt curren  cons  ;
    hs()Suraawait fetchhsData = const sura        rses
ine total veto determsurah info First get     //    ;

 l)r(nul     setErroe);
   (trudingtLoa
        setry {
      return;
) f (!surahId> {
      i() =ata = async ckWiseD loadBlo  const() => {
  useEffect(e data
  wisck- blotch  // Fe

  };
);utton>
    /b
      <5" />sm:w-5 sm:h- h-4 "w-4ame=lassNy c    <Cop    
      >
Copy text"itle="
        tpy}andleConClick={h     o   enter"
ify-c-center just itemspx] flex[44x] sm:min-w--[40p min-wmin-h-[44px]] sm:h-[40pxolors min-ition-cnsd-lg tra00 roundey-8g-grahover:by-100 dark::bg-graay-300 hovergrr:text-dark:hovegray-400 k:text-00 dary-7text-gra00 hover:-gray-5text5 sm:p-2 sName="p-1.        claston
  <but
        return (;


    } }");
     xtto copy teFailed ror("      showEre);
  led", faiopy ror("Ce.eronsol        catch (e) {
     } c;
 lipboard!")opied to c"Text chowSuccess(;
        sToCopy)extText(twriteoard.tor.clipb naviga     await
   nText}`;slatio\n${tranbicText}\n `${araToCopy =onst text      c...";

  anslationoading tr : "L)
         join("\n"           .
        })    `;
     ext}mber}) ${tId}:${ayahNu `(${surah    return          
    .trim();             ")
   gex, " spaceRe   .replace(            
   ex, "")Reg(sup  .replace           "")
     on.text ||  translatiText ||tion.Audioslaext = (tran  const t              x;
art + id= stmber Nu ayah    const             {
n, idx) =>atioanslp((tr.ma           ations
   nsl blockTra        ?
   0.length >Translationst = blocknTexanslatiotr    const    +/g;
 \sRegex = /const space       
 /sup>/g;]*>\d+<\ot_note[^>]*fo/<sup[^>ex = onst supReg      c text
  anslation   // Get tr

      text...";ing Arabic   : "Load")
        .join("          `)
     + idx}﴾art} ﴿${st_uthmanixt.terse `${vese, idx) =>map((ver           .cSlice
    ? arabi
         ength > 0ice.lt = arabicSlbicTex ara    const    text
Get Arabic   //       try {
=> {
      () ync Copy = ashandleonst  c;

   urahId])rt, end, s[sta,  }
   ();pylationsForCochTrans

      fet     }; }
 );
       py:', errons for cotranslati fetching rore.error('Er    consol      rr) {
catch (e        } ons);
ns(translatislatioan  setBlockTr);
         range, 'E'd),hIt(suraeInns(parsioahTranslatetchAywait fs = aionranslatconst t      
    -${end}`;{start}art}` : `$? `${stnd === e start ange =const r           try {
       () => {
 syncorCopy = alationsFanshTr fetc    const {
  =>fect(()     useEf

e([]); = useStatslations]lockTrans, setBionTranslatconst [block    }) => {
owError uccess, shhId, showSrabicSlice, su end, ara= ({ start,on CopyButtt lock
  conseach bality for py functioncoe ent to handl  // Compon;
  };

iv>
    )      </d    </p>
.."}
    ion.lating trans : "Load        
   r}`ockErroion: ${blng translatror loadi ? `Er          ockError
  bl           :)
          }       );
             t>
 .Fragmeneact </R            "}
       </span>{"                  r}
 beayahNum     {           
        >                mber)}
  ck(ayahNumberCliandleNuick={() => h        onCl        
      -shrink-0"excolors flition-600 transyan-r hover:bg-cpointecursor-m:mx-2 -1 sounded-lg mxont-medium r-xs ftextte ext-whiD] tg-[#19B5Dw-5 md:h-5 bsm:h-6 md:-6 -5 h-5 sm:w wfy-centercenter justis--flex itemnesName="inlilas    c               <span
                 
      ion}.Translat      {ayah            "}
  >{"     </strong          )
      hNumber}}:{ayaurahId        ({s         
      <strong>                   
mber}`}>yahNu{`ayah-${aey=t.Fragment k   <Reac          
        return (      er;
       numbr = ayah.t ayahNumbens    co         x) => {
   (ayah, idlations.map( blockTrans     ?
       length > 0ions.anslat    {blockTr      ">
-poppinse fontg:text-basxt-base lt-sm md:texs sm:texelaxed text-leading-r-white k:text81px] darmax-w-[10ay-700 t-grame="texp classN <">
       -8:pb-6 lg:pbm:pb-4 md:px-8 pb-3 smd:px-6 lg sm:px-4 x-3"pv className=  <di (
     return    }

         );
v>
    </diiv>
             </d>
 </dived w-1/2">und-gray-700 roark:bg day-200g-gr"h-4 bclassName=div          <
   </div>-2">mb4 unded w-3/robg-gray-700 k:200 darh-4 bg-gray-"lassName=v c<di           ">
 seule-patanimsName="div clas     <  ">
   lg:pb-84 md:pb-6 pb- pb-3 sm:px-6 lg:px-8md:sm:px-4 Name="px-3 ss <div cla       (
turn {
      reading)  if (blockLo

    surahId]);art, end,st [   },ion();
 Translatlock    fetchB    };

  }
  );
        ng(falsedickLoaBlo       setally {
   fin   } ons);
     atilbackTranslfals(ationockTransl   setBl            }
     );
  }   ,
       ain later.`ase try agse ${i}. Plee for verilablavat slation noTran `tion:ransla     T     er: i,
       numb     ({
      ushslations.pTran   fallback
         +) { i+ end;rt; i <=t i = stafor (le  
         [];nslations =rafallbackT const s
         onlatier transldlaceho: create pFallback        //      
   );
    geor(err.messaBlockErr   setr);
       d}:`, erart}-${enlock ${station for bng translchir(`Error fetsole.erro       con    (err) {
 } catch     ;
  anslations)edTrmattations(foranslTrck     setBlo    
     ;
      }))         .trim(),
             
  " ")ex, (spaceRegplace       .re)
       pRegex, "" .replace(su        "")
     || xt anslation.teioText || trudion.Aranslat (tanslation:    Tr,
        dxt + istar:    number     
    , idx) => ({ranslations.map((tslationons = trandTranslatiormatte  const f     \s+/g;
   aceRegex = /nst sp      cog;
    \d+<\/sup>/[^>]*>_note^>]*foot= /<sup[Regex st sup    con      
re structuh expectedons to matce translatithat rm// Fo
               
     E');nge, 'd), raInt(surahIparsetions(ahTranslafetchAyns = await slatiot tran    consd}`;
      ${entart}-art}` : `${send ? `${st=  start ==range =      const 
       l);
       kError(nultBloc    se;
      ue)oading(tretBlockL          sry {
        t {
async () =>nslation = etchBlockTrast f
      conect(() => {eEff   us;

 ull)State(nor] = useockErrr, setBlkErrobloc  const [
  );State(trueding] = usekLoaBloc setng,oadinst [blockL[]);
    cote(= useStaons] slatiTranns, setBlockranslatiolockTonst [b    c{
> ckIndex }) =end, blot, ar({ stslation = ckTranst Bloching
  contion fet transladual blockle indivi handto Component   //

eState({});g] = uskmarkLoadinooetBlockBding, skLoackBookmarlo
  const [b;te([])seStaes] = ursArabicVeetrses, sst [arabicVe[]);
  conseState(yahData] = ua, setAyahDatst [acon
  l);ate(nul= useStor] rrtEt [error, sens;
  co(true)ateuseStLoading] = loading, setconst [
  null);= useState(a] attBlockDa, sest [blockDat  con