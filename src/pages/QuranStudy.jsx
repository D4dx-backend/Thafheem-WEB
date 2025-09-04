import React from 'react'
import QuranStudyNavbar from '../components/QuranStudyNavbar'
import QuranStudyContent from '../components/QuranStudyContent'
import QuranStudyPlay from '../components/QuranStudyPlay'

const QuranStudy = () => {
  return (
    <div>
      <div className='flex bg-[#FAFAFA] dark:bg-black'>
      <QuranStudyNavbar/>
      <QuranStudyContent/>
      </div>
      <QuranStudyPlay/>
      
    </div>
  )
}

export default QuranStudy