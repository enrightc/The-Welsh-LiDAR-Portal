import React, { useEffect, useState, useReducer } from 'react'
import {useImmerReducer} from "use-immer"

function Testing() {
  
  const initialstate = {
    appleCount: 1,
    bananaCount: 10,
    message: "Hello",
    happy: false,
  };

  function ReducerFunction(draft, action){
    switch (action.type){
      case "addApple":
        draft.appleCount = draft.appleCount + 1;
        break
      case "changeEverything":
        draft.bananaCount = draft.bananaCount + 2;
        draft.message = action.customMessage;
        draft.happy = true;
        break // Toggle happy state
    }
  }

  const [state, dispatch] = useImmerReducer(ReducerFunction, initialstate)

  return (
    <>
      <div>Right now the count of apple is {state.appleCount}</div>
      <div>Right now the count of banana is {state.bananaCount}</div>
      <div>Right now the message is {state.message}</div>
      {state.happy ? <h1>Thank you for being happy</h1> : <h1>Be Happy!</h1>}
      <br /> 
      <button onClick={()=>dispatch({ type: "addApple"})}>Add Apple</button>
      <button onClick={()=>dispatch({ type: "changeEverything", customMessage: "The message is now coming from the dispatch"})}>Change Everything</button>
    </>
  );
}

export default Testing;