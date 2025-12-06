interface PeopleCounterProps {
  value: number;
  onChange: (value: number) => void;
}

export default function PeopleCounter({ value, onChange }: PeopleCounterProps) {
  const decrement = () => onChange(Math.max(1, value - 1));
  const increment = () => onChange(value + 1);

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={decrement}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-2xl text-white transition hover:border-white/40"
      >
        -
      </button>
      <span className="min-w-[5rem] text-center text-xl font-semibold text-white">
        {value} 人
      </span>
      <button
        type="button"
        onClick={increment}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-2xl text-white transition hover:border-white/40"
      >
        +
      </button>
    </div>
  );
}
