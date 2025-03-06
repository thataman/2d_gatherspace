import React, { useState } from 'react'
import { NavigationMenuDemo } from '../components/components/NavigationMenuDemo'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'


const Home = () => {
 const [aman,setaman] = useState(false)
  const clickup = ()=>{
    console.log("hy");
    setaman(!aman)
    
  }
  return (
    <div className='w-screen h-screen flex'>
     <div className='grid grid-cols-3 justify-center w-screen h-fit mt-[1.2%] mb-[1.2%]'>
      <div className='col-span-2 flex justify-center'>
        <span className='mr-2'>home</span>
      <span className=''><NavigationMenuDemo/></span>
      </div>
      <div className='col-span-1 flex justify-center'>
     {aman ? (<Link to={"/signin"}><button className='mr-1 text-sm bg-[#F3F2FF] text-[#6758FF]'>Sign in</button> </Link> ):(<Link to={"/"}><button onClick={clickup} className='mr-1 text-sm bg-[#F3F2FF] text-[#6758FF]'>Sign out</button> </Link> )}
     <Link to={"/signup"}> <button className='ml-1 text-sm w-[110px] p-[0.1%] h-[38.4px] bg-[#6758FF] text-[#F3F2FF]'>Start for Free</button> </Link>
      </div>
      </div>
    </div>
    
  )
}

export default Home