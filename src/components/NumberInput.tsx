import React, { useEffect, useState } from "react";

interface Props extends React.ComponentPropsWithoutRef<"input"> {
  isFloatingPoint?: boolean;
  step?: number;
  min?: number;
  max?: number;
  numberValue: number;
  onNumberChange: (value: number) => void;
}

export default function NumberInput({
  isFloatingPoint = false,
  step,
  min,
  max,
  numberValue,
  onNumberChange,
  ...props
}: Props) {
  const [textValue, setTextValue] = useState<string>(numberValue.toString());

  useEffect(() => {
    if (parseFloat(textValue) === numberValue) return;

    setTextValue(numberValue.toString() || "0");
  }, [numberValue]);

  useEffect(() => {
    if (textValue.length > 0 && !textValue.endsWith(".")) {
      const value = isFloatingPoint ? parseFloat(textValue) : parseInt(textValue);

      if (value === numberValue) return;

      if (min && value < min) {
        onNumberChange(min);
      } else if (max && value > max) {
        onNumberChange(max);
      } else {
        onNumberChange(value);
      }
    }
  }, [textValue]);

  const resolveTextValue = () => {
    if (textValue.trim().length === 0) {
      setTextValue(min?.toString() || "0");
    } else if ((isFloatingPoint && textValue.endsWith(".")) || !isFloatingPoint) {
      // handle cases like "123." and "0123"
      setTextValue(parseInt(textValue).toString());
    }
  };

  return (
    <input
      {...props}
      type="text"
      inputMode="numeric"
      step={step}
      value={textValue}
      onChange={(e) => setTextValue(sanitizeTextInput(e.target.value, isFloatingPoint))}
      onBlur={() => resolveTextValue()}
    />
  );
}

function sanitizeTextInput(text: string, isFloatingPoint: boolean) {
  return text
    .replace(isFloatingPoint ? /[^0-9\.]/g : /[^0-9]/g, "")
    .split(".", 2)
    .join(".");
}
