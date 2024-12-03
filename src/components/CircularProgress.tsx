import { FC } from "react";

type CircularProgressProps = {
  progress: number;
  size?: number;
  strokeWidth?: number;
};

const CircularProgress: FC<CircularProgressProps> = ({
  progress,
  size = 100,
  strokeWidth = 10,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="-rotate-90 transform" width={size} height={size}>
        <circle
          className="stroke-primary/20"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />

        <circle
          className="stroke-primary transition-transform duration-300 ease-in-out"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
    </div>
  );
};

export default CircularProgress;
