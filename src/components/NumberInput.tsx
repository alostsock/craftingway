import React, { useEffect, useState, useRef } from "react";

interface Props extends React.ComponentPropsWithoutRef<"input"> {
  isFloatingPoint?: boolean;
  step?: number;
  min?: number;
  max?: number;
  numberValue: number;
  onNumberChange: (value: number) => void;
}

/**
 * Buffers text inputs so that only valid numbers are emitted on change.
 */
export default function NumberInput({
  isFloatingPoint = false,
  step,
  min,
  max,
  numberValue,
  onNumberChange,
  ...props
}: Props) {
  const previousNumberValue = useRef<number>(numberValue);
  const [textValue, setTextValue] = useState<string>(numberValue.toString());
  const [isFinal, setIsFinal] = useState(false);

  useEffect(() => {
    if (previousNumberValue.current !== numberValue) {
      // the number was changed outside of this component; update this component
      previousNumberValue.current = numberValue;
      setTextValue(numberValue.toString());
      return;
    }

    if (textValue.length > 0 && !textValue.endsWith(".")) {
      const value = isFloatingPoint ? parseFloat(textValue) : parseInt(textValue);

      if (value === numberValue) return;

      // Only call onNumberChange on valid numbers, and clamp the value only on
      // blur (when the user has finished editing the number). Setting the text
      // value here is a bit inefficient and causes this effect to rerun, but it
      // feels more robust since the text should be the source of truth.
      if (min && value < min) {
        if (isFinal) setTextValue(min.toString());
      } else if (max && value > max) {
        if (isFinal) setTextValue(max.toString());
      } else {
        previousNumberValue.current = value;
        onNumberChange(value);
      }
    }
  }, [textValue, numberValue, isFloatingPoint, min, max, isFinal, onNumberChange]);

  const resolveTextValue = () => {
    if (textValue.trim().length === 0) {
      setTextValue(min?.toString() || "0");
    } else if ((isFloatingPoint && textValue.endsWith(".")) || !isFloatingPoint) {
      // handle cases like "123." and "0123"
      setTextValue(parseInt(textValue).toString());
    } else {
      setTextValue(textValue);
    }
  };

  return (
    <input
      {...props}
      type="text"
      inputMode="numeric"
      step={step}
      value={textValue}
      onChange={(e) => {
        setIsFinal(false);
        setTextValue(sanitizeTextInput(e.target.value, isFloatingPoint));
      }}
      onBlur={() => {
        setIsFinal(true);
        resolveTextValue();
      }}
    />
  );
}

function sanitizeTextInput(text: string, isFloatingPoint: boolean) {
  const pattern = isFloatingPoint ? /[^0-9.]/g : /[^0-9]/g;

  return text.replace(pattern, "").split(".", 2).join(".");
}
