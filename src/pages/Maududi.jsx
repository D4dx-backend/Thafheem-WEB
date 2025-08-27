import React, { useState, useRef } from 'react';
import maududiImg from "../assets/maududi.png";
import Ed1 from "../assets/ed1.png";
import Ed2 from "../assets/ed2.png";
import Ed3 from "../assets/ed3.png";
import Ed4 from "../assets/ed4.png";
import Ed5 from "../assets/ed5.png";
import Ed6 from "../assets/ed6.png";
import Ed7 from "../assets/ed7.png";

const Maududi = () => {
    const books = [
        "Jihad in Islam",
        "Towards Understanding Islam",
        "Purdah & the Status of Women in Islam",
        "The Islamic Law and Constitution",
        "Let Us Be Muslims",
        "The Islamic Way Of Life",
        "The Meaning Of The Qur’an",
        "A Short History Of The Revivalist Movement In Islam",
        "Human Rights in Islam",
        "Four basic Qur’anic terms",
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

    return (
        <div className="w-full mx-auto bg-white dark:bg-black p-8">
                  <div className="max-w-6xl mx-auto">

            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-black dark:text-white">
                    Sayyid Abul A'la Maududi (1903-1979)
                </h1>
            </div>

            {/* Main Biography Section */}
            <div className="flex gap-6 mb-8">
                {/* Portrait Image */}
                <div className="flex-shrink-0">
                    <img 
                        src={maududiImg} 
                        alt="Sayyid Abul A'la Maududi"
                        className="w-[120px] h-[160px] object-cover rounded shadow-sm"
                    />
                </div>
                
                {/* Biographical Text */}
                <div className="flex-1 ">
                    <h3 className="text-blue-600 font-normal mb-3 text-sm dark:text-white">(1903-1979)</h3>
                    <p className="text-black leading-relaxed mb-4 text-sm dark:text-white">
                        Abul A'la was born on Rajab 3, 1321 AH (September 25, 1903 AD) in Aurangabad, a well-known town in the former princely 
                        state of Hyderabad (Deccan), presently Maharashtra, India. Born in a respectable family, his ancestry on the paternal 
                        side is traced back to the Holy Prophet Muhammad (peace and blessing of Allah be on him).
                    </p>
                    <p className="text-black leading-relaxed text-sm dark:text-white">
                        The family had a long-standing tradition of spiritual leadership and a number of Maududi's ancestors were outstanding 
                        leaders of Sufi Orders. One of the luminaries among them, the one from whom he derived his family name, was 
                        Khwajah Qutb al-Din Maudud (d. 527 AH), a renowned leader of the Chishti Sufi Order. Maududi's forefathers had 
                        moved to the Subcontinent from Chisht towards the end of the 9th century of the Islamic calendar (15th century of the 
                        Christian calendar). The first one to arrive was Maududi's namesake, Abul A'la Maududi (d. 935 AH). Maududi's father, 
                        Ahmad Hasan, born in 1855 AD, a lawyer by profession, was a highly religious and devout person. Abul A'la was the 
                        youngest of his three sons.
                    </p>
                </div>
            </div>

            {/* Educational & Intellectual Growth Section */}
            <div className="mb-6">
                <h2 className="text-blue-600 font-normal mb-4 text-base dark:text-white">
                    Educational & Intellectual Growth
                </h2>
                <div className="flex gap-4 mb-4">
                    <img 
                        src={Ed1}
                        alt="Historical Document"
                        className="w-[100px] h-[130px] object-cover rounded shadow-sm"
                    />
                    <img 
                        src={Ed2}
                        alt="School Building"
                        className="w-[120px] h-[130px] object-cover rounded shadow-sm"
                    />
                    <img 
                        src={Ed3}
                        alt="Street View"
                        className="w-[120px] h-[130px] object-cover rounded shadow-sm"
                    />
                </div>
                <p className="text-black leading-relaxed text-sm dark:text-white">
                    After acquiring early education at home, Abul A'la was admitted in Madrasah Furqaniyah, a high school which 
                    attempted to combine the modern Western with the traditional Islamic education. After successfully completing his 
                    secondary education, young Abul A'la was at the stage of undergraduate studies at Darul Uloom, Hyderabad, when his 
                    formal education was disrupted by the illness and eventual death of his father. This did not deter Maududi from 
                    continuing his studies though these had to be outside of the regular educational institutions. By the early 1920s, Abul A'la 
                    knew enough Arabic, Persian and English, besides his mother-tongue, Urdu, to study the subjects of his interest 
                    independently. Thus, most of what he learned was self-acquired though for short spells of time he also received 
                    systematic instruction and guidance from some competent scholars. Thus, Maududi's intellectual growth was largely a 
                    result of his own effort and the stimulation he received from his teachers. Moreover, his uprightness, his profound regard 
                    for propriety and righteousness largely reflect the religious piety of his parents and their concern for his proper moral 
                    upbringing.
                </p>
            </div>

            <div className="mb-6">
                <h2 className="text-blue-500 font-normal mb-3 text-base dark:text-white">
                    Involvement in journalism
                </h2>
                <div className="flex gap-4 mb-3">
                    <div className="flex-shrink-0">
                        <img 
                            src={Ed4}
                            alt="Historical Document"
                            className="w-[80px] h-[100px] object-cover"
                        />
                    </div>
                    <div className="flex-1">
                        <p className="text-black leading-normal text-sm dark:text-white">
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

            <div className="mb-6">
                <h2 className="text-blue-500 font-normal mb-3 text-base">
                    Interest in politics
                </h2>
                <div className="flex gap-4 mb-3">
                    <div className="flex-shrink-0">
                        <img 
                            src={Ed5}
                            alt="Political Meeting"
                            className="w-[80px] h-[100px] object-cover"
                        />
                    </div>
                    <div className="flex-1">
                        <p className="text-black leading-normal text-sm dark:text-white">
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

            <div className="mb-6">
                <h2 className="text-blue-600 font-normal mb-4 text-base dark:text-white">
                    First book
                </h2>
                <p className="text-black leading-relaxed text-sm dark:text-white">
                    During 1920-28, Maulana Maududi also translated four different books, one from Arabic and the rest from English. He also made his mark on the academic life of the Subcontinent by writing his first major book, al-Jihad fi al-Islam. This is a masterly treatise on the Islamic law of war and peace. It was first serialised in al-Jam'iyat in 1927 and was formally published in 1930. It was highly acclaimed both by the famous poet-philosopher Muhammad Iqbal (d. 1938) and Maulana Muhammad Ali Jauhar (d. 1931), the famous leader of the Khilafat Movement. Though written during his '20s, it is one of his major and most highly regarded works.
                </p>
            </div>

            <div className="mb-6">
                <h2 className="text-blue-500 font-normal mb-3 text-base dark:text-white">
                    Research and writings
                </h2>
                <div className="flex gap-4 mb-3">
                    <div className="flex-shrink-0">
                        <img 
                            src={Ed6}
                            alt="Historical Document"
                            className="w-[80px] h-[100px] object-cover"
                        />
                    </div>
                    <div className="flex-1">
                        <p className="text-black leading-normal text-sm dark:text-white">
                            After his resignation from al-Jam'iyat in 1928, Maududi moved to Hyderabad and devoted himself to research and writing. It was in this connection that he took up the editorship of the monthly Tarjuman al-Qur'an in 1933, which since then has been the main vehicle for the dissemination of Maududi's ideas. He proved to be a highly prolific writer, turning out several scores of pages every month. Initially, he concentrated on the exposition of ideas, values and basic principles of Islam. He paid special attention to the questions arising out of the conflict between the Islamic and the contemporary Western world. 
                        </p>
                    </div>
                </div>
                <div className="mb-6">
                    <p className="text-black leading-relaxed text-sm dark:text-white">
                        He also attempted to discuss some of the major problems of the modern age and sought to present Islamic solutions to those problems. He also developed a new methodology to study those problems in the context of the experience of the West and the Muslim world, judging them on the theoretical criterion of their intrinsic soundness and viability and conformity with the teachings of the Qur'an and the Sunnah. His writings revealed his erudition and scholarship, a deep perception of the significance of the teachings of the Qur'an and the Sunnah and a critical awareness of the mainstream of Western thought and history. All this brought a freshness to Muslim approach to these problems and lent a wider appeal to his message.
                    </p>
                </div>
                <div className="mb-6">
                    <p className="text-black leading-relaxed text-sm dark:text-white">
                        In the mid '30s, Maududi started writing on major political and cultural issues confronting the Muslims of India at that time and tried to examine them from the Islamic perspective rather than merely from the viewpoint of short-term political and economic interests. He relentlessly criticised the newfangled ideologies which had begun to cast a spell over the minds and hearts of his brethren-in-faith and attempted to show the hollowness of those ideologies. In this connection, the idea of nationalism received concerted attention from Maududi when he forcefully explained its dangerous potentialities as well as its incompatibility with the teachings of Islam. Maududi also emphasised that nationalism in the context of India meant the utter destruction of the separate identity of Muslims. In the meantime, an invitation from the philosopher-poet Allama Muhammad Iqbal persuaded him to leave Hyderabad and settle down at a place in the Eastern part of Punjab, in the district of Pathankot. Maududi established what was essentially an academic and research centre called Darul-Islam where, in collaboration with Allama Iqbal, he planned to train competent scholars in Islamics to produce works of outstanding quality on Islam, and above all, to carry out the reconstruction of Islamic Thought.
                    </p>
                </div>
            </div>

            <div>
                <div className="mb-6">
                    <h2 className="text-blue-600 font-normal mb-4 text-base dark:text-white">
                        Jamaat-e-Islami
                    </h2>
                    <p className="text-black leading-relaxed text-sm dark:text-white">
                        Around the year 1940, Maududi developed ideas regarding the founding of a more comprehensive and ambitious movement and this led him to launch a new organisation under the name of the Jamaat-e-Islami. Maududi was elected Jamaat's first Ameer and remained so till 1972 when he withdrew from the responsibility for reasons of health.
                    </p>
                </div>
                <div className="mb-6">
                    <h2 className="text-blue-600 font-normal mb-4 text-base dark:text-white">
                        Struggle & persecution
                    </h2>
                    <p className="text-black leading-relaxed text-sm dark:text-white">
                        After migrating to Pakistan in August 1947, Maududi concentrated his efforts on establishing a truly Islamic state and society in the country. Consistent with this objective, he wrote profusely to explain the different aspects of the Islamic way of life, especially the socio-political aspects. This concern for the implementation of the Islamic way of life led Maududi to criticise and oppose the policies pursued by the successive governments of Pakistan and to blame those in power for failing to transform Pakistan into a truly Islamic state. The rulers reacted with severe reprisal measures. Maududi was often arrested and had to face long spells in prison.
                    </p>
                </div>
                <div>
                    <p className="text-black leading-relaxed text-sm dark:text-white">
                        During these years of struggle and persecution, Maududi impressed all, including his critics and opponents, by the firmness and tenacity of his will and other outstanding qualities. In 1953, when he was sentenced to death by the martial law authorities on the charge of writing a seditious pamphlet on the Qadyani problem, he resolutely turned down the opportunity to file a petition for mercy. He cheerfully expressed his preference for death to seeking clemency from those who wanted, altogether unjustly, to hang him for upholding the right. With unshakeable faith that life and death lie solely in the hands of Allah, he told his son as well as his colleagues: "If the time of my death has come, no one can keep me from it; and if it has not come, they cannot send me to the gallows even if they hang themselves upside down in trying to do so." His family also declined to make any appeal for mercy. His firmness astonished the government which was forced, under strong public pressure both from within and without, to commute the death sentence to life imprisonment and then to cancel it.
                    </p>
                </div>
            </div>

            <div>
                <div className="mb-6">
                    <h2 className="text-blue-600 font-normal mb-4 text-base dark:text-white">
                        Intellectual contribution
                    </h2>
                    <p className="text-black leading-relaxed text-sm dark:text-white">
                        Maulana Maududi has written over 120 books and pamphlets and made over a 1000 speeches and press statements of which about 700 are available on record.
                    </p>
                </div>
                <div className="mb-6">
                    <p className="text-black leading-relaxed text-sm dark:text-white">
                        Maududi's pen was simultaneously prolific, forceful and versatile. The range of subjects he covered is unusually wide. Disciplines such as Tafsir, Hadith, law, philosophy and history, all have received the due share of his attention. He discussed a wide variety of problems — political, economic, cultural, social, theological etc. — and attempted to state how the teachings of Islam were related to those problems. Maududi has not delved into the technical world of the specialist, but has expounded the essentials of the Islamic approach in most of the fields of learning and inquiry. His main contribution, however, has been in the fields of the Qur'anic exegesis (Tafsir), ethics, social studies and the problems facing the movement of Islamic revival. His greatest work is his monumental tafsir in Urdu of the Qur'an, Tafhim al-Qur'an, a work he took 30 years to complete. Its chief characteristic lies in presenting the meaning and message of the Qur'an in a language and style that penetrates the hearts and minds of the men and women of today and shows the relevance of the Qur'an to their everyday problems, both on the individual and societal planes. He translated the Qur'an in direct and forceful modern Urdu idiom. His translation is much more readable and eloquent than ordinary literal translations of the Qur'an. He presented the Qur'an as a book of guidance for human life and as a guide-book for the movement to implement and enforce that guidance in human life. He attempted to explain the verses of the Qur'an in the context of its total message. This tafsir has made a far-reaching impact on contemporary Islamic thinking in the Subcontinent, and through its translations, even abroad.
                    </p>
                </div>
                <div>
                    <p className="text-black leading-relaxed text-sm dark:text-white">
                        The influence of Maulana Maududi is not confined to those associated with the Jamaat-e-Islami. His influence transcends the boundaries of parties and organisations. Maududi is very much like a father-figure for Muslims all over the world. As a scholar and writer, he is the most widely read Muslim writer of our time. His books have been translated into most of the major languages of the world Arabic, English, Turkish, Persian, Hindi, French, German, Swahili, Tamil, Bengali, etc. and are now increasingly becoming available in many more of the Asian, African and European languages.
                    </p>
                </div>
            </div>

            <div className="mb-6">
                <div className="bg-gray-200 rounded-lg overflow-hidden shadow-sm ">
                    <div className="aspect-video bg-gray-300 dark:bg-[#434343] flex items-center justify-center">
                        <video
                            ref={videoRef}
                            className="w-full h-full object-cover"
                            onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
                            onLoadedMetadata={(e) => setDuration(e.target.duration)}
                            onEnded={() => setIsPlaying(false)}
                        >
                            <source src="/path-to-your-video.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                    <div className="bg-gray-100 dark:bg-[#434343] px-4 py-3">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700 dark:text-white font-mono min-w-[45px]">
                                {formatTime(currentTime)}
                            </div>
                            <div className="flex-1 mx-4">
                                <div 
                                    className="w-full h-1 bg-gray-300 dark:bg-black rounded cursor-pointer"
                                    onClick={handleProgressClick}
                                >
                                    <div 
                                        className="h-full bg-gray-600 rounded transition-all duration-200"
                                        style={{ width: `${progressPercentage}%` }}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={handlePrevious}
                                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                                    aria-label="Previous"
                                >
                                    <svg className="w-5 h-5 text-gray-700 dark:text-black" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={handlePlayPause}
                                    className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                    aria-label={isPlaying ? "Pause" : "Play"}
                                >
                                    {isPlaying ? (
                                        <svg className="w-6 h-6 text-gray-700 dark:text-black" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <svg className="w-6 h-6 text-gray-700 dark:text-black" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                                    aria-label="Next"
                                >
                                    <svg className="w-5 h-5 text-gray-700 dark:text-black" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" />
                                    </svg>
                                </button>
                            </div>
                            <div className="text-sm text-gray-700 font-mono min-w-[45px] text-right">
                                {formatTime(duration)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <div className="mb-6">
                    <h2 className="text-blue-600 font-normal mb-4 text-base dark:text-white">
                        Travels & journeys abroad
                    </h2>
                    <p className="text-black leading-relaxed text-sm dark:text-white">
                        The several journeys which Maududi undertook during the years 1956-74 enabled Muslims in many parts of the world to become acquainted with him personally and appreciate many of his qualities. At the same time, these journeys were educative for Maududi himself as well as they provided to him the opportunity to gain a great deal of first-hand knowledge of the facts of life and to get acquainted with a large number of persons in different parts of the world. During these numerous tours, he lectured in Cairo, Damascus, Amman, Makkah, Madinah, Jeddah, Kuwait, Rabat, Istanbul, London, New York, Toronto and at a host of international centres. During these years, he also participated in some 10 international conferences. He also made a study tour of Saudi Arabia, Jordan (including Jerusalem), Syria and Egypt in 1959-60 in order to study the geographical aspects of the places mentioned in the Qur'an. He was also invited to serve on the Advisory Committee which prepared the scheme for the establishment of the Islamic University of Madinah and was on its Academic Council ever since the inception of the University in 1962.
                    </p>
                </div>
                <div className="mb-6">
                    <p className="text-black leading-relaxed text-sm dark:text-white">
                        He was also a member of the Foundation Committee of the Rabitah al-Alam al-Islami, Makkah, and of the Academy of Research on Islamic Law, Madinah. In short, he was a tower of inspiration for Muslims the world over and influenced the climate and pattern of thought of Muslims, as the Himalayas or the Alps influence the climate in Asia or Europe without themselves moving about.
                    </p>
                </div>
            </div>

            <div className="mb-6">
                <h2 className="text-blue-500 font-normal mb-3 text-base dark:text-white">
                    His last days
                </h2>
                <div className="flex gap-4 mb-3">
                    <div className="flex-shrink-0">
                        <img 
                            src={Ed7}
                            alt="Historical Document"
                            className="w-[120px] h-[130px] object-cover"
                        />
                    </div>
                    <div className="flex-1">
                        <p className="text-black leading-normal text-sm dark:text-white">
                            In April 1979, Maududi's long-time kidney ailment worsened and by then he also had heart problems. He went to the United States for treatment and was hospitalised in Buffalo, New York, where his second son worked as a physician. Even at Buffalo, his time was intellectually productive. He spent many hours reviewing Western works on the life of the Prophet and meeting with Muslim leaders, their followers and well-wishers. Following a few surgical operations, he died on September 22, 1979 at the age of 76. His funeral was held in Buffalo, but he was buried in an unmarked grave at his residence (Ichra) in Lahore after a very large funeral procession through the city.
                        </p>
                    </div>
                </div>
                <p className="text-black leading-normal text-sm dark:text-white">
                    May Allah bless him with His mercy for his efforts and reward him amply for the good that he has rendered for the nation of Islam (Ummah).
                </p>
            </div>

            <div className="">
                <h2 className="text-xl font-bold mb-4 dark:text-white">
                    Some of his books translated into English:
                </h2>
                <ul className="list-disc list-inside p-4 rounded-lg space-y-1 ">
                    {books.map((book, index) => (
                        <li key={index} className="text-gray-800 dark:text-white">
                            {book}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
        </div>

    );
};

export default Maududi;