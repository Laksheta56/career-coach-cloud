import { motion } from "framer-motion";

interface ScoreGaugeProps {
  score: number;
  label: string;
  size?: "sm" | "lg";
}

export function ScoreGauge({ score, label, size = "lg" }: ScoreGaugeProps) {
  const radius = size === "lg" ? 80 : 50;
  const stroke = size === "lg" ? 10 : 7;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const dim = (radius + stroke) * 2;

  const getColor = () => {
    if (score >= 80) return "text-score-excellent";
    if (score >= 60) return "text-score-good";
    if (score >= 40) return "text-score-fair";
    return "text-score-poor";
  };

  const getStrokeColor = () => {
    if (score >= 80) return "stroke-score-excellent";
    if (score >= 60) return "stroke-score-good";
    if (score >= 40) return "stroke-score-fair";
    return "stroke-score-poor";
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: dim, height: dim }}>
        <svg width={dim} height={dim} className="-rotate-90">
          <circle
            cx={radius + stroke}
            cy={radius + stroke}
            r={radius}
            fill="none"
            strokeWidth={stroke}
            className="stroke-muted"
          />
          <motion.circle
            cx={radius + stroke}
            cy={radius + stroke}
            r={radius}
            fill="none"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
            className={getStrokeColor()}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className={`font-display font-bold ${size === "lg" ? "text-4xl" : "text-2xl"} ${getColor()}`}
          >
            {score}
          </motion.span>
          {size === "lg" && (
            <span className="text-xs text-muted-foreground font-medium">/ 100</span>
          )}
        </div>
      </div>
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
    </div>
  );
}
