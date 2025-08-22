import React from 'react';

const EndofProphethoodContent = () => {
  const handlePlayAudio = () => {
    // Audio play functionality can be implemented here
    console.log('Play audio clicked');
  };

  return (
    <div className="flex-1 bg-white h-screen overflow-y-auto">
      {/* Content Header */}
      <div className="border-b border-gray-300 px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-black">Note</h1>
          <button
            onClick={handlePlayAudio}
            className="flex items-center space-x-2 px-4 py-2 text-[#2AA0BF] hover:bg-teal-50 transition-colors duration-200 rounded"
          >
            <svg 
              className="w-4 h-4" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">Play Audio</span>
          </button>
        </div>
      </div>

      {/* Content Body */}
      <div className="px-6 py-6">
        <div className="max-w-4xl">
          <p className="text-black text-base leading-relaxed">
            The party that has created the 'Great Tribulation', which is the new Prophethood in this era, has given the word 
            'Khatam-un-Nabiyyin' the meaning of 'seal of the prophets'. That is, the prophets who come after Prophet 
            Muhammad (peace be upon Him) become prophets with the seal of that prophethood. In other words, whoever 
            does not have the seal of that prophethood he cannot become a prophet. This is the definition of Khatam-un-
            Nabiyyin! However, when considering the context of the verse in question (2:15), there is no room for giving this 
            definition to the word. Moreover, if this is the definition, the word would be out of place and contrary to the intention 
            of the word. The above statement was made in response to the allegations of the opposing party regarding the 
            meaning of Ziyarah (may Allah be pleased with her) and the confusion they created. If we were to say that 
            Muhammad is the seal of the prophets and that any future prophet will become a prophet only after his seal is 
            imprinted, how would that fit into the context? Not only would it not fit into the context at all, but it would also 
            significantly undermine the reasoning that had been established from above in response to the critics. Yes, the 
            critics would have an opportunity to say: 'If this act had not been done now, there would have been no danger. If it 
            were so necessary to abolish this custom, then some of the prophets who would come later would have done it by 
            imprinting the seal of Muhammad.' The said party also gives another interpretation of 'Khatam-un-Nabiyyin' as 
            'Afzal-un-Nabiyyin' (the best of the prophets). That is, the door to prophethood remains open. But its perfections 
            have ended with the Holy Prophet. However, this interpretation also has the evil that we mentioned earlier. This not 
            only contradicts the original structure of the texts, but also contradicts their very purpose. Even then, the infidels 
            and hypocrites can say: 'O Prophet! Even though they are of low rank, prophets will continue to come to you. So 
            why are you in such a hurry to end this practice yourself?'
          </p>
        </div>
      </div>
    </div>
  );
};

export default EndofProphethoodContent;