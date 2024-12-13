import { useEffect, useState } from "react";
import DurationSettingButton from "./DurationSettingButton";
import Time from "./Time";
import { SegmentType } from "../types/types";
import { getIntervalSeconds, saveIntervalSeconds } from "../utils/utils";
import { defaultIntervalChange } from "../constants/constants";

interface IntervalSettingProps {
  type: SegmentType;
  reloadFlag: number;
}

export default function IntervalSetting({
  type,
  reloadFlag,
}: IntervalSettingProps) {
  const [intervalSeconds, setIntervalSeconds] = useState<number>(0);

  useEffect(() => {
    setIntervalSeconds(getIntervalSeconds(type));
  }, [type, reloadFlag]);

  const handleAddSeconds = () => {
    const seconds = intervalSeconds + defaultIntervalChange;

    setIntervalSeconds(() => seconds);
    saveIntervalSeconds(type, seconds);
  };

  const handleMinusSeconds = () => {
    const seconds =
      intervalSeconds <= defaultIntervalChange
        ? defaultIntervalChange
        : intervalSeconds - defaultIntervalChange;

    setIntervalSeconds((current) => (current === 0 ? current : seconds));
    saveIntervalSeconds(type, seconds);
  };

  return (
    <div className="my-2">
      <p className="font-semibold">{type}</p>
      <div className="flex items-center justify-center">
        <div className="mr-4 flex items-center md:mr-10">
          <span>
            <Time seconds={intervalSeconds} />
          </span>

          <DurationSettingButton type={"Add"} handleClick={handleAddSeconds} />
          <DurationSettingButton
            type={"Minus"}
            handleClick={handleMinusSeconds}
          />
        </div>
      </div>
    </div>
  );
}