import { useEffect } from "react";

const Timer =({dispatch,  theSecondsRemaining})=> {
    const min = Math.floor(theSecondsRemaining / 60);
    const seconds = theSecondsRemaining % 60;

    useEffect(() => {
        const id = setInterval(()=> {
            dispatch({type: 'tick'})
        }, 1000)
        return () => clearInterval(id);
    },
     [dispatch]);

    return(
    <div className="timer">
        {min < 10 && '0'}
        { min}:  {seconds < 10 && '0'}
        {seconds}</div>
    )
}

export default Timer;