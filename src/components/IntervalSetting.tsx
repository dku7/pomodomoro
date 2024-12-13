import { useEffect, useState } from "react";
import IntervalSettingButton from "./IntervalSettingButton";
import Time from "./Time";
import { IntervalType } from "../types/types";
import { getIntervalSeconds, saveIntervalSeconds } from "../utils/utils";
import { defaultIntervalChange } from "../constants/constants";

interface IntervalSettingProps {
  type: IntervalType;
}

export default function IntervalSetting({ type }: IntervalSettingProps) {
  const [intervalSeconds, setIntervalSeconds] = useState<number>(0);

  useEffect(() => {
    setIntervalSeconds(getIntervalSeconds(type));
  }, [type]);

  const handleAddSeconds = () => {
    const seconds = intervalSeconds + defaultIntervalChange;

    setIntervalSeconds(() => seconds);
    saveIntervalSeconds(type, seconds);
  };

  const handleMinusSeconds = () => {
    const seconds = intervalSeconds - defaultIntervalChange;

    setIntervalSeconds((current) => (current === 0 ? current : seconds));
    saveIntervalSeconds(type, seconds);
  };

  return (
    <div className="my-2">
      <p className="font-semibold">{type}</p>
      <div className="flex items-center justify-center">
        <span>
          <Time seconds={intervalSeconds} />
        </span>

        <IntervalSettingButton type={"Add"} handleClick={handleAddSeconds} />
        <IntervalSettingButton
          type={"Minus"}
          handleClick={handleMinusSeconds}
        />
      </div>
    </div>
  );
}
