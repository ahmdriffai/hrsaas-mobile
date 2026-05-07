import { useState } from "react";
import TimePicker from "../time-picker/time-picker";
import Input from "./input";

interface Props {
  label?: string;
  value?: string;
  onChange?: (val: string) => void;
  disabled?: boolean;
}

export default function InputTime({
  label = "Time",
  value,
  onChange,
  disabled,
}: Props) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="">
      <Input
        label={label}
        value={value}
        onFocus={() => setOpen(true)}
        readonly
        disabled={disabled}
      />

      {open && (
        <div
          className="fixed bg-black/30 w-full flex item-center justify-center h-screen left-0 top-0 z-50"
          onClick={() => setOpen(false)}
        >
          <div className="w-full flex items-center justify-center">
            <TimePicker
              classname="shadow-xl"
              value={value}
              onChange={(time: string) => {
                onChange?.(time);
                setOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
