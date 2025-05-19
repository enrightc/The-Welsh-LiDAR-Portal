import React, { useEffect, useState } from 'react'

function Testing() {
  const [count, setCount] = useState(1);
    // useEffect(()=>{
    //     console.log('Testing component mounted');
    // },[]);

    useEffect(()=>{
        console.log(`The current Count is : ${count}`);
    },[count]);

    function IncreaseCount() {
        setCount((current)=> current + 1);
    }

    function DecreaseCount(){
      setCount((current)=> current - 1);
  }

  return (
    <>
    <h1>The current Count is : {count}</h1>
    <br />
    <button onClick={IncreaseCount}>Increase</button>
    <br />
    <button onClick={DecreaseCount}>Decrese</button>
    </>
  )
}

export default Testing;