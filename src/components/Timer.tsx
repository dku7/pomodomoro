import { useState, useEffect, useRef, useReducer, useCallback } from "react";
import useSound from "use-sound";
import Time from "./Time";
import { TimerButton } from "./TimerButton";
import gong from "../assets/gong.mp3";
import { IntervalType, TimerType } from "../types/types";
import {
  getStoredIntervals,
  getIntervalSeconds,
  incrementStoredIntervals,
  resetStoredIntervals,
  getNotificationSettings,
} from "../utils/utils";
import { timerReducer } from "../reducers/timer-reducer";
import { ResetButton } from "./ResetButton";

const initialTimer: TimerType = {
  seconds: 0,
  intervalType: "Focus",
  status: "Not Started",
};

export default function Timer() {
  const [timer, dispatchTimer] = useReducer(timerReducer, initialTimer);
  const [intervalsCompleted, setIntervalsCompleted] = useState<number>(0);
  const [playNotification] = useSound(gong);
  const intervalRef = useRef<number>(-1);

  const handleClick = useCallback(() => {
    if (timer.status === "Not Started") {
      const secondsToUse = getIntervalSeconds(timer.intervalType);
      dispatchTimer({ type: "SET_SECONDS", payload: secondsToUse });
    }

    dispatchTimer({ type: "TOGGLE_STATUS" });
  }, [timer.intervalType, timer.status]);

  const handleResetIntervals = useCallback(() => {
    resetStoredIntervals();
    setIntervalsCompleted(0);
  }, []);

  const setNewIntervalType = useCallback(() => {
    console.log("generating setNewIntervalType");
    let newIntervalType: IntervalType = timer.intervalType;
    if (timer.intervalType === "Focus") {
      const newIntervals = incrementStoredIntervals();

      setIntervalsCompleted(newIntervals);

      if (newIntervals % 4 === 0) newIntervalType = "Long Break";
      else newIntervalType = "Short Break";
    } else newIntervalType = "Focus";

    dispatchTimer({ type: "SET_TYPE", payload: newIntervalType });
  }, [timer.intervalType]);

  useEffect(() => {
    setIntervalsCompleted(getStoredIntervals());
  }, []);

  // start countdown
  useEffect(() => {
    if (timer.status == "Started") {
      intervalRef.current = setInterval(() => {
        dispatchTimer({ type: "COUNTDOWN" });
      }, 1000);
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [timer]);

  // detect countdown finished
  useEffect(() => {
    if (!timer.seconds && timer.status === "Started") {
      const notificationEnabled = getNotificationSettings();
      clearInterval(intervalRef.current);
      dispatchTimer({ type: "STOP_TIMER" });

      if (notificationEnabled) playNotification();

      setNewIntervalType();
    }
  }, [playNotification, setNewIntervalType, timer.seconds, timer.status]);

  // set new interval length when switch types
  useEffect(() => {
    const seconds = getIntervalSeconds(timer.intervalType);

    dispatchTimer({ type: "SET_SECONDS", payload: seconds });
  }, [timer.intervalType]);

  return (
    <>
      <header>
        <h2 className="text-xl font-bold">{timer.intervalType}</h2>
      </header>
      <div className="text-8xl font-extrabold text-slate-700 md:text-9xl">
        <Time seconds={timer.seconds} />
      </div>
      <div>
        <progress
          className="w-80 [&::-moz-progress-bar]:bg-slate-400 [&::-webkit-progress-bar]:rounded [&::-webkit-progress-bar]:bg-slate-400 [&::-webkit-progress-value]:rounded [&::-webkit-progress-value]:bg-slate-700"
          max={getIntervalSeconds(timer.intervalType)}
          value={timer.seconds}
        />
      </div>
      <div className="my-4">
        <TimerButton status={timer.status} handleClick={handleClick} />
      </div>
      <div className="flex items-center justify-center">
        <span className="mr-4">Completed intervals: {intervalsCompleted}</span>
        <ResetButton
          buttonTitle={"Reset completed intervals"}
          iconOnly={true}
          handleClick={handleResetIntervals}
        />
      </div>
    </>
  );
}
