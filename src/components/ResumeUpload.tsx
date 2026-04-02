import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, X, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const JOB_ROLES = [
  "Software Engineer",
  "Data Analyst",
  "Product Manager",
  "UX Designer",
  "DevOps Engineer",
  "Data Scientist",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Machine Learning Engineer",
];

interface ResumeUploadProps {
  onAnalyze: (file: File, jobRole: string) => void;
  isLoading: boolean;
}

export function ResumeUpload({ onAnalyze, isLoading }: ResumeUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [jobRole, setJobRole] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === "application/pdf") setFile(dropped);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected?.type === "application/pdf") setFile(selected);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto space-y-6"
    >
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300 cursor-pointer ${
          isDragging
            ? "border-primary bg-primary/5 scale-[1.02]"
            : file
            ? "border-primary/40 bg-primary/5"
            : "border-border hover:border-primary/40 hover:bg-muted/50"
        }`}
        onClick={() => !file && document.getElementById("file-input")?.click()}
      >
        <input
          id="file-input"
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
        />

        <AnimatePresence mode="wait">
          {file ? (
            <motion.div
              key="file"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center justify-center gap-4"
            >
              <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="h-7 w-7 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-display font-semibold text-foreground">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                className="ml-4 p-2 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="font-display font-semibold text-lg text-foreground">
                  Drop your resume here
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  or click to browse · PDF format only
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Job role */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Briefcase className="h-4 w-4 text-primary" />
          Target Job Role
        </label>
        <Input
          value={jobRole}
          onChange={(e) => setJobRole(e.target.value)}
          placeholder="e.g. Software Engineer"
          list="job-roles"
          className="h-12 rounded-xl bg-card border-border"
        />
        <datalist id="job-roles">
          {JOB_ROLES.map((role) => (
            <option key={role} value={role} />
          ))}
        </datalist>
      </div>

      {/* Analyze button */}
      <Button
        size="lg"
        disabled={!file || isLoading}
        onClick={() => file && onAnalyze(file, jobRole || "General")}
        className="w-full h-14 rounded-xl text-base font-display font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-elevated disabled:opacity-50"
      >
        {isLoading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
          />
        ) : (
          "Analyze Resume"
        )}
      </Button>
    </motion.div>
  );
}
