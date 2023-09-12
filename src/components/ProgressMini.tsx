import "./ProgressMini.scss";

import React from "react";

type Props = {
  label: string;
  initialValue?: number;
  value: number;
  target: number;
};

export default function ProgressMini({ label, initialValue = 0, value, target }: Props) {
  const r = 10;
  const l = 2 * Math.PI * r;

  const circleProps: React.SVGProps<SVGCircleElement> = {
    cx: 16,
    cy: 16,
    r,
    fill: "none",
    strokeWidth: 5,
    strokeDasharray: l,
  };

  return (
    <div className="ProgressMini">
      <svg className="gauge" viewBox="0 0 32 32">
        <circle {...circleProps} stroke="hsl(210, 47%, 21%)" />
        <circle
          {...circleProps}
          stroke="hsl(210, 83%, 53%)"
          style={{ strokeDashoffset: offset(value, target, l) }}
        />
        <circle
          {...circleProps}
          stroke="hsl(204, 100%, 86%)"
          style={{ strokeDashoffset: offset(initialValue, target, l) }}
        />
      </svg>

      <label>
        <span className="name">{label}</span>
        <span>
          {value}
          <span className="divider">/</span>
          {target}
        </span>
      </label>
    </div>
  );
}

function offset(value: number, target: number, arcLength: number): number {
  if (target === 0) return arcLength;
  let p = Math.floor((value / target) * 100) / 100;
  p = Math.max(0, Math.min(1, p));
  return (1 - p) * arcLength;
}
