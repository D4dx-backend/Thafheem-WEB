import React from 'react'
import EndofProphethoodNavbar from '../components/EndofProphethoodNavbar'
import EndofProphethoodContent from '../components/EndofProphethoodContent'
import EndofProphethoodPlay from '../components/EndofProphethoodPlay'

const EndofProphethood = () => {
  return (
    <div>
        <div className='flex bg-[#FAFAFA] dark:bg-black'>
        <EndofProphethoodNavbar/>
        <EndofProphethoodContent/>
        <EndofProphethoodPlay/>
        </div>
        
    </div>
  )
}

export default EndofProphethood