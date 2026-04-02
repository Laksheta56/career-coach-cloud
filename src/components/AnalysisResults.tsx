import { motion } from "framer-motion";
import { ScoreGauge } from "./ScoreGauge";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowLeft,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface AnalysisData {
  resumeScore: number;
  jobMatchPercentage: number;
  extractedSkills: { technical: string[]; soft: string[] };
  missingSkills: string[];
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  jobRole: string;
}

interface AnalysisResultsProps {
  data: AnalysisData;
  onReset: () => void;
}

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

function SectionCard({
  title,
  icon: Icon,
  children,
  delay = 0,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.4, delay }}
      className="rounded-2xl bg-card border border-border p-6 shadow-card"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <h3 className="font-display font-semibold text-lg text-card-foreground">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}

export function AnalysisResults({ data, onReset }: AnalysisResultsProps) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-between"
      >
        <Button
          variant="ghost"
          onClick={onReset}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Analyze Another
        </Button>
        <Badge variant="secondary" className="font-display">
          Target: {data.jobRole}
        </Badge>
      </motion.div>

      {/* Score Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-wrap justify-center gap-8 p-8 rounded-2xl bg-card border border-border shadow-card"
      >
        <ScoreGauge score={data.resumeScore} label="ATS Score" size="lg" />
        <ScoreGauge score={data.jobMatchPercentage} label="Job Match" size="lg" />
      </motion.div>

      {/* Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SectionCard title="Technical Skills" icon={Sparkles} delay={0.1}>
          <div className="flex flex-wrap gap-2">
            {data.extractedSkills.technical.map((skill) => (
              <Badge key={skill} className="bg-primary/10 text-primary border-0 font-medium">
                {skill}
              </Badge>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Soft Skills" icon={Target} delay={0.15}>
          <div className="flex flex-wrap gap-2">
            {data.extractedSkills.soft.map((skill) => (
              <Badge key={skill} variant="secondary" className="font-medium">
                {skill}
              </Badge>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Missing Skills */}
      {data.missingSkills.length > 0 && (
        <SectionCard title="Missing Skills" icon={TrendingUp} delay={0.2}>
          <div className="flex flex-wrap gap-2">
            {data.missingSkills.map((skill) => (
              <Badge
                key={skill}
                variant="outline"
                className="border-destructive/30 text-destructive font-medium"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SectionCard title="Strengths" icon={CheckCircle2} delay={0.25}>
          <ul className="space-y-3">
            {data.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-card-foreground">
                <CheckCircle2 className="h-4 w-4 text-score-excellent mt-0.5 shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Weaknesses" icon={AlertTriangle} delay={0.3}>
          <ul className="space-y-3">
            {data.weaknesses.map((w, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-card-foreground">
                <AlertTriangle className="h-4 w-4 text-score-fair mt-0.5 shrink-0" />
                {w}
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      {/* Suggestions */}
      <SectionCard title="Actionable Suggestions" icon={Lightbulb} delay={0.35}>
        <ol className="space-y-3">
          {data.suggestions.map((s, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-card-foreground">
              <span className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                {i + 1}
              </span>
              {s}
            </li>
          ))}
        </ol>
      </SectionCard>
    </div>
  );
}
