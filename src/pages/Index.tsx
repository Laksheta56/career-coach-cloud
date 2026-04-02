import { useState } from "react";
import { motion } from "framer-motion";
import { FileSearch } from "lucide-react";
import { ResumeUpload } from "@/components/ResumeUpload";
import { AnalysisResults, AnalysisData } from "@/components/AnalysisResults";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Index() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AnalysisData | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async (file: File, jobRole: string) => {
    setIsLoading(true);
    try {
      // Upload PDF to storage
      const fileName = `${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(fileName, file, { contentType: "application/pdf" });

      if (uploadError) throw new Error("Upload failed: " + uploadError.message);

      // Read file as base64 for the edge function
      const arrayBuffer = await file.arrayBuffer();
      const base64 = btoa(
        new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), "")
      );

      // Call analysis edge function
      const { data, error } = await supabase.functions.invoke("analyze-resume", {
        body: { resumeBase64: base64, fileName: file.name, jobRole },
      });

      if (error) throw new Error(error.message || "Analysis failed");

      setResults({ ...data, jobRole });
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Analysis Failed",
        description: err.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="container flex items-center gap-3 h-16 px-6">
          <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <FileSearch className="h-5 w-5 text-primary" />
          </div>
          <h1 className="font-display font-bold text-lg text-foreground">ResumeIQ</h1>
        </div>
      </header>

      <main className="container px-6 py-12">
        {results ? (
          <AnalysisResults data={results} onReset={() => setResults(null)} />
        ) : (
          <div className="space-y-10">
            {/* Hero */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-2xl mx-auto space-y-4"
            >
              <h2 className="font-display font-bold text-4xl md:text-5xl tracking-tight">
                Analyze your resume
                <br />
                <span className="text-gradient">with AI precision</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Upload your resume and get instant ATS scoring, skill extraction, 
                and actionable improvement suggestions powered by AI.
              </p>
            </motion.div>

            {/* Upload */}
            <ResumeUpload onAnalyze={handleAnalyze} isLoading={isLoading} />
          </div>
        )}
      </main>
    </div>
  );
}
