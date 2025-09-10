// import React from "react";
// import { ArrowLeft } from "lucide-react";

// const Conclusion = () => {
//   const handleBack = () => {
//     console.log("Navigate back");
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-black">
//       {/* Header */}
//       <div className="bg-white  dark:bg-black">
//         <div className="max-w-5xl mx-auto px-4 py-4 border-b border-gray-200 ">
//           <div className="flex items-center gap-4">
 
//             <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
//               Conclusion
//             </h1>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-5xl mx-auto px-4 py-8 bg-white dark:bg-black">
//         <div className="space-y-4 text-sm text-gray-700  dark:text-white leading-relaxed">
//           <p>
//             I express my heartfelt gratitude to the Most Exalted Allah, from the
//             very depths of my heart. The extremely arduous task of writing
//             Tafheem-ul-Qur'an, which I began in the month of Muharram, 1361
//             Hijri (February 1942), has now — after a long span of 30 years and
//             4 months — reached its completion.
//           </p>

//           <p>
//             It is purely through the infinite grace and generosity of Allah that
//             a humble servant like me was granted the ability to offer such a
//             service to His Holy Name Book. Whatever truth and guidance is found
//             in this work has only been possible through the light and guidance
//             of Allah.
//           </p>

//           <p>
//             If there are any errors in the translation or interpretation of the
//             Qur'an within this work, those are solely due to the limitations of
//             my own knowledge and understanding. However — Alhamdulillah — I have
//             not knowingly made any mistake. If there are any errors that
//             occurred unintentionally, I place my hope in the mercy and
//             compassion of Allah, trusting that He will forgive me.
//           </p>

//           <p>
//             If the effect of mine has in any way added lift servants in finding
//             the right path, I pray that Allah will accept it as a means for my
//             salvation and forgiveness.
//           </p>

//           <p>
//             I also have one humble request to the community of scholars: please
//             help me by identifying any mistakes. Any matter that is shown to be
//             wrong with proper evidence — insha'allah — I will readily correct. I
//             seek refuge in Allah from knowingly committing errors or stubbornly
//             persisting in them.
//           </p>

//           <p>
//             Additionally, I want to clarify my understanding: the Qur'an is
//             authentic; my effort in this work has been to explain the Holy
//             Qur'an as I have understood it — in a way that an average, literate
//             person can also comprehend. My aim was to explain the ideas and
//             objectives of the Qur'an clearly so that readers could grasp its
//             spirit, address the doubts that arise while reading the Qur'an or
//             its translations, and elaborate on the topics that are only briefly
//             mentioned or summarized in the original.
//           </p>

//           <p>
//             In the beginning, I did not intend to go into very detailed
//             explanations. Hence, the commentary notes in the earlier volumes are
//             relatively brief. But as I progressed, I increasingly felt the need
//             for more comprehensive explanation. So much so, that how readers may
//             feel that the earlier volumes are somewhat dry compared to the later
//             ones. However, the issues discussed briefly in the earlier volumes
//             have been explained at greater length in the later surahs, where
//             they are elaborated in greater detail. This repetition of themes is
//             one of the great benefits of the Qur'an's structure.
//           </p>

//           <p>
//             Therefore, for those who do not stop at reading the Qur'an just
//             once, but go on to read this entire commentary series again, I
//             believe that the explanations found in the later surahs will serve
//             as an effective guide for understanding the earlier ones.
//           </p>

//           {/* Author Information */}
//           <div className="border-t border-gray-200 pt-6 text-gray-600 dark:text-white">
//             <p className="font-medium mb-1">— Abul A'la Maududi</p>
//             <p>Lahore / Multan</p>
//             <p>24 Rabi' al-Akhir 1392 Hijri</p>
//             <p>(7 June 1972 CE)</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Conclusion;


import React from "react";
import { ArrowLeft } from "lucide-react";

const Conclusion = () => {
  const handleBack = () => {
    console.log("Navigate back");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black font-poppins">
      {/* Header */}
      <div className="bg-white dark:bg-black">
        <div className="mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-b border-gray-200 max-w-[1070px]">
          <div className="flex items-center gap-3 sm:gap-4">
            <h1 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 dark:text-white">
              Conclusion
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 bg-white dark:bg-black max-w-[1070px]">
        <div className="  text-lg sm:text-sm md:text-base text-gray-700 dark:text-white leading-relaxed">
          <p className="w-[350px] sm:w-full">
            I express my heartfelt gratitude to the Most Exalted Allah, from the
            very depths of my heart. The extremely arduous task of writing
            Tafheem-ul-Qur'an, which I began in the month of Muharram, 1361
            Hijri (February 1942), has now — after a long span of 30 years and
            4 months — reached its completion.
          </p>

          <p className="w-full max-w-none">
            It is purely through the infinite grace and generosity of Allah that
            a humble servant like me was granted the ability to offer such a
            service to His Holy Name Book. Whatever truth and guidance is found
            in this work has only been possible through the light and guidance
            of Allah.
          </p>

          <p className="w-[350px] sm:w-full">
            If there are any errors in the translation or interpretation of the
            Qur'an within this work, those are solely due to the limitations of
            my own knowledge and understanding. However — Alhamdulillah — I have
            not knowingly made any mistake. If there are any errors that
            occurred unintentionally, I place my hope in the mercy and
            compassion of Allah, trusting that He will forgive me.
          </p>

          <p className="w-[350px] sm:w-full">
            If the effect of mine has in any way added lift servants in finding
            the right path, I pray that Allah will accept it as a means for my
            salvation and forgiveness.
          </p>

          <p className="w-[350px] sm:w-full">
            I also have one humble request to the community of scholars: please
            help me by identifying any mistakes. Any matter that is shown to be
            wrong with proper evidence — insha'allah — I will readily correct. I
            seek refuge in Allah from knowingly committing errors or stubbornly
            persisting in them.
          </p>

          <p className="w-[350px] sm:w-full">
            Additionally, I want to clarify my understanding: the Qur'an is
            authentic; my effort in this work has been to explain the Holy
            Qur'an as I have understood it — in a way that an average, literate
            person can also comprehend. My aim was to explain the ideas and
            objectives of the Qur'an clearly so that readers could grasp its
            spirit, address the doubts that arise while reading the Qur'an or
            its translations, and elaborate on the topics that are only briefly
            mentioned or summarized in the original.
          </p>

          <p className="w-[350px] sm:w-full">
            In the beginning, I did not intend to go into very detailed
            explanations. Hence, the commentary notes in the earlier volumes are
            relatively brief. But as I progressed, I increasingly felt the need
            for more comprehensive explanation. So much so, that how readers may
            feel that the earlier volumes are somewhat dry compared to the later
            ones. However, the issues discussed briefly in the earlier volumes
            have been explained at greater length in the later surahs, where
            they are elaborated in greater detail. This repetition of themes is
            one of the great benefits of the Qur'an's structure.
          </p>

          <p className="w-[350px] sm:w-full">
            Therefore, for those who do not stop at reading the Qur'an just
            once, but go on to read this entire commentary series again, I
            believe that the explanations found in the later surahs will serve
            as an effective guide for understanding the earlier ones.
          </p>

          {/* Author Information */}
          <div className="border-t border-gray-200 pt-4 sm:pt-6 md:pt-8 text-xs sm:text-sm md:text-base text-gray-600 dark:text-white">
            <p className="font-medium mb-1">— Abul A'la Maududi</p>
            <p>Lahore / Multan</p>
            <p>24 Rabi' al-Akhir 1392 Hijri</p>
            <p>(7 June 1972 CE)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Conclusion;