import { useEffect, useState } from "react";

export enum TimeFormat {
  H12 = "h12",
  H24 = "h24",
}

interface DateTimeProps {
  format: TimeFormat;
}

export default function DateTime({ format }: DateTimeProps) {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const dateString = date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const time =
    format === TimeFormat.H12
      ? date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      : date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });

  return (
    <div className="flex items-center justify-center gap-4 text-sm font-bold cursor-default select-none">
      <div>{dateString}</div>
      <div>{time}</div>
    </div>
  );
}
