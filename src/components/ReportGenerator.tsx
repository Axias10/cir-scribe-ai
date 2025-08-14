import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CIRFormData, UploadedFile } from "@/pages/Index";
import { 
  FileText, Download, Eye, CheckCircle, Clock, 
  Loader2, Sparkles, RefreshCw 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReportGeneratorProps {
  formData: CIRFormData;
  uploadedFiles: UploadedFile[];
  isGenerating: boolean;
}

type GenerationStep = {
  id: string;
  label: string;
  description: string;
  completed: boolean;
  progress: number;
};

export const ReportGenerator = ({ formData, uploadedFiles, isGenerating }: ReportGeneratorProps) => {
  const [steps, setSteps] = useState<GenerationStep[]>([
    {
      id: 'analysis',
      label: 'Analyse des documents',
      description: 'Extraction et analyse du contenu des fichiers téléversés...',
      completed: false,
      progress: 0
    },
    {
      id: 'contextualization',
      label: 'Contextualisation',
      description: 'Intégration des informations du questionnaire...',
      completed: false,
      progress: 0
    },
    {
      id: 'generation',
      label: 'Génération du rapport',
      description: 'Création du document CIR structuré...',
      completed: false,
      progress: 0
    },
    {
      id: 'formatting',
      label: 'Mise en forme',
      description: 'Application du template et finalisation...',
      completed: false,
      progress: 0
    }
  ]);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const [reportReady, setReportReady] = useState(false);
  const { toast } = useToast();

  // Simulate the generation process
  useEffect(() => {
    if (!isGenerating) return;

    const simulateStep = (stepIndex: number) => {
      if (stepIndex >= steps.length) {
        setReportReady(true);
        toast({
          title: "Rapport généré !",
          description: "Votre rapport CIR est prêt à être téléchargé.",
          variant: "default"
        });
        return;
      }

      setCurrentStepIndex(stepIndex);
      
      // Simulate progress for current step
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          
          // Mark step as completed
          setSteps(prev => prev.map((step, index) => 
            index === stepIndex 
              ? { ...step, completed: true, progress: 100 }
              : step
          ));
          
          // Update overall progress
          setOverallProgress(((stepIndex + 1) / steps.length) * 100);
          
          // Move to next step after delay
          setTimeout(() => simulateStep(stepIndex + 1), 500);
        } else {
          setSteps(prev => prev.map((step, index) => 
            index === stepIndex 
              ? { ...step, progress }
              : step
          ));
        }
      }, 100);
    };

    simulateStep(0);
  }, [isGenerating, steps.length, toast]);

  const handleDownload = () => {
    // Create a mock report document
    const reportContent = generateMockReport();
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Rapport_CIR_${formData.companyName.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Téléchargement commencé",
      description: "Votre rapport CIR est en cours de téléchargement.",
      variant: "default"
    });
  };

  const generateMockReport = () => {
    return `
RAPPORT CIR - ${formData.companyName}
=====================================

PROJET: ${formData.projectTitle}

1. CONTEXT/OBJECTIVES
${formData.objectives}

2. DESCRIPTION DU PROJET
${formData.projectDescription}

3. PÉRIODE ET BUDGET
- Début: ${formData.startDate}
- Fin: ${formData.endDate}
- Budget: ${formData.budget}€
- Équipe: ${formData.teamSize} personnes

4. DÉFIS TECHNIQUES
${formData.technicalChallenges}

5. RÉSULTATS ATTENDUS
${formData.expectedResults}

6. DOCUMENTS ANALYSÉS
${uploadedFiles.map(file => `- ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`).join('\n')}

---
Rapport généré automatiquement par l'Assistant CIR
Date de génération: ${new Date().toLocaleDateString('fr-FR')}
    `.trim();
  };

  const handlePreview = () => {
    toast({
      title: "Prévisualisation",
      description: "Fonctionnalité bientôt disponible.",
      variant: "default"
    });
  };

  const handleRegenerate = () => {
    // Reset states
    setSteps(prev => prev.map(step => ({ ...step, completed: false, progress: 0 })));
    setCurrentStepIndex(0);
    setOverallProgress(0);
    setReportReady(false);
    
    toast({
      title: "Régénération en cours",
      description: "Le rapport va être régénéré avec les dernières données.",
      variant: "default"
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="p-6 shadow-medium">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Génération du rapport CIR</h2>
              <p className="text-muted-foreground">
                {reportReady ? "Rapport prêt !" : isGenerating ? "Traitement en cours..." : "En attente"}
              </p>
            </div>
          </div>
          
          {reportReady && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handlePreview}>
                <Eye className="w-4 h-4 mr-2" />
                Prévisualiser
              </Button>
              <Button onClick={handleDownload} className="bg-gradient-hero hover:opacity-90">
                <Download className="w-4 h-4 mr-2" />
                Télécharger
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Progress Card */}
      <Card className="p-6 shadow-soft">
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Progression générale</span>
              <span className="text-sm text-muted-foreground">{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>

          {/* Steps */}
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={step.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                      ${step.completed ? 'bg-accent text-accent-foreground' :
                        index === currentStepIndex && isGenerating ? 'bg-primary text-primary-foreground' :
                        'bg-muted text-muted-foreground'}
                    `}>
                      {step.completed ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : index === currentStepIndex && isGenerating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Clock className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{step.label}</p>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                  {(index === currentStepIndex && isGenerating) || step.completed ? (
                    <span className="text-sm font-medium text-foreground">
                      {Math.round(step.progress)}%
                    </span>
                  ) : null}
                </div>
                
                {(index === currentStepIndex && isGenerating) || step.completed ? (
                  <Progress value={step.progress} className="h-1 ml-11" />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Summary Card */}
      <Card className="p-6 shadow-soft">
        <h3 className="text-lg font-semibold text-foreground mb-4">Résumé du projet</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Entreprise</p>
            <p className="font-medium text-foreground">{formData.companyName}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Projet</p>
            <p className="font-medium text-foreground">{formData.projectTitle}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Période</p>
            <p className="font-medium text-foreground">
              {formData.startDate} - {formData.endDate}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Documents</p>
            <p className="font-medium text-foreground">{uploadedFiles.length} fichier(s)</p>
          </div>
        </div>

        {reportReady && (
          <div className="mt-6 pt-6 border-t">
            <Button 
              variant="outline" 
              onClick={handleRegenerate}
              className="w-full"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Régénérer le rapport
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};