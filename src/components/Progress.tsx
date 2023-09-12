import "./Progress.scss";

type Props = {
  label: string;
  initialValue?: number;
  value: number;
  target: number;
};

export default function Progress({ label, initialValue = 0, value, target }: Props) {
  return (
    <div className="Progress">
      <label>
        <span className="name">
          <span>{label}</span>
          <span>{initialValue > 0 && `(Base: ${initialValue})`}</span>
        </span>
        <span>
          {value} / {target}
        </span>
      </label>

      <div className="bar">
        <div className="fill" style={{ width: percentage(value, target) }} />
        <div className="fill initial" style={{ width: percentage(initialValue, target) }} />
      </div>
    </div>
  );
}

function percentage(value: number, target: number): string {
  if (target === 0) return "0";
  // this is an unrelenting world where progress is (visibly) rounded down at 2 digits
  let p = Math.floor((value / target) * 100) / 100;
  // make sure p is bounded 0 <= p <= 1
  p = Math.max(0, Math.min(1, p));
  return `${p * 100}%`;
}
