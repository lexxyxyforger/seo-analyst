"use client";
import { useEffect, useRef } from "react";

interface Props {
  score: number;
  maxScore: number;
  percentage: number;
}

function getGrade(pct: number) {
  if (pct >= 90) return { grade: "A+", color: "#22c55e", label: "Excellent" };
  if (pct >= 80) return { grade: "A", color: "#4ade80", label: "Great" };
  if (pct >= 70) return { grade: "B", color: "#facc15", label: "Good" };
  if (pct >= 60) return { grade: "C", color: "#fb923c", label: "Needs Work" };
  return { grade: "D", color: "#ef4444", label: "Poor" };
}

export default function ScoreCircle({ score, maxScore, percentage }: Props) {
  const circleRef = useRef<SVGCircleElement>(null);
  const { grade, color, label } = getGrade(percentage);

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  useEffect(() => {
    const circle = circleRef.current;
    if (!circle) return;
    circle.style.strokeDashoffset = String(circumference);
    const raf = requestAnimationFrame(() => {
      circle.style.transition = "stroke-dashoffset 1.4s cubic-bezier(0.4, 0, 0.2, 1)";
      circle.style.strokeDashoffset = String(offset);
    });
    return () => cancelAnimationFrame(raf);
  }, [offset, circumference]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: 140, height: 140 }}>
        <svg width="140" height="140" viewBox="0 0 140 140" style={{ transform: "rotate(-90deg)" }}>
          {/* Track */}
          <circle
            cx="70" cy="70" r={radius}
            fill="none"
            stroke="var(--color-surface-3)"
            strokeWidth="10"
          />
          {/* Progress */}
          <circle
            ref={circleRef}
            cx="70" cy="70" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            style={{ strokeDasharray: circumference }}
          />
        </svg>
        {/* Center content */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center animate-score"
          style={{ animationDelay: "0.3s", opacity: 0 }}
        >
          <span className="text-4xl font-black leading-none" style={{ color, fontFamily: "var(--font-display)" }}>
            {grade}
          </span>
          <span className="text-xs font-bold mt-0.5" style={{ color: "var(--color-text-muted)" }}>
            {percentage}%
          </span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-bold" style={{ color: "var(--color-text)" }}>{label}</p>
        <p className="text-xs" style={{ color: "var(--color-text-subtle)" }}>
          {score} / {maxScore} poin
        </p>
      </div>
    </div>
  );
}