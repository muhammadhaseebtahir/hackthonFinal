import React,{useState,useEffect} from 'react'
import dayjs from 'dayjs'
export default function Topbar() {
    const [currentTime,setCurrentTime]= useState("");
    useEffect(()=>{
setInterval(()=>{
    setCurrentTime(dayjs().format("dddd, DD,MMMM,YYYY, hh:mm:ss A"))
})
    },[] )
  return (
    <>
      <div className="container-fluid">
        <div className="row py-2 bg-primary">
            <div className="col">
                <p className='text-center text-light mb-0' >{currentTime}</p>
            </div>
        </div>
      </div>
    </>
  )
}
