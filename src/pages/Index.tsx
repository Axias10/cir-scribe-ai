import { useState } from "react";
import { CIRQuestionnaire } from "@/components/CIRQuestionnaire";
import { FileUpload } from "@/components/FileUpload";
import { ReportGenerator } from "@/components/ReportGenerator";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, MessageSquare, Upload, Download } from "lucide-react";

export type CIRFormData = {
  companyName: string;
  projectTitle: string;
  projectDescription: string;
  objectives: string;
  startDate: string;
  endDate: string;
  budget: string;
  teamSize: string;
  technicalChallenges: string;
  expectedResults: string;
};

export type UploadedFile = {
  id: string;
  name: string;
  size: number;
  type: string;
  file: File;
};

const Index = () => {
  const [currentStep, setCurrentStep] = useState<'questionnaire' | 'upload' | 'generate'>('questionnaire');
  const [formData, setFormData] = useState<CIRFormData | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleQuestionnaireComplete = (data: CIRFormData) => {
    setFormData(data);
    setCurrentStep('upload');
  };

  const handleFilesUploaded = (files: UploadedFile[]) => {
    setUploadedFiles(files);
  };

  const handleGenerateReport = async () => {
    if (!formData || uploadedFiles.length === 0) return;
    
    setIsGenerating(true);
    setCurrentStep('generate');
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsGenerating(false);
  };

  const steps = [
    { id: 'questionnaire', label: 'Questionnaire', icon: MessageSquare, completed: !!formData },
    { id: 'upload', label: 'Documents', icon: Upload, completed: uploadedFiles.length > 0 },
    { id: 'generate', label: 'Rapport CIR', icon: Download, completed: false }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/5">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Assistant CIR</h1>
              <p className="text-muted-foreground">Générateur automatique de rapport CIR</p>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = step.completed;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300
                    ${isActive ? 'bg-primary text-primary-foreground shadow-medium' : 
                      isCompleted ? 'bg-accent text-accent-foreground' : 
                      'bg-muted text-muted-foreground'}
                  `}>
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{step.label}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-2 transition-colors duration-300 ${
                      isCompleted ? 'bg-accent' : 'bg-border'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {currentStep === 'questionnaire' && (
            <Card className="p-8 shadow-medium">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Informations sur votre projet CIR
                </h2>
                <p className="text-muted-foreground">
                  Répondez à ces questions pour personnaliser votre rapport CIR
                </p>
              </div>
              <CIRQuestionnaire onComplete={handleQuestionnaireComplete} />
            </Card>
          )}

          {currentStep === 'upload' && formData && (
            <Card className="p-8 shadow-medium">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Téléversement des documents
                </h2>
                <p className="text-muted-foreground">
                  Ajoutez vos documents techniques (PDF, DOCX, PPTX) pour enrichir le rapport
                </p>
              </div>
              <FileUpload onFilesUploaded={handleFilesUploaded} />
              
              {uploadedFiles.length > 0 && (
                <div className="mt-8 pt-8 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">
                        {uploadedFiles.length} document(s) téléversé(s)
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Prêt à générer votre rapport CIR
                      </p>
                    </div>
                    <Button 
                      onClick={handleGenerateReport}
                      className="bg-gradient-hero hover:opacity-90 shadow-medium transition-all duration-300"
                      size="lg"
                    >
                      <FileText className="w-5 h-5 mr-2" />
                      Générer le rapport
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          )}

          {currentStep === 'generate' && (
            <ReportGenerator 
              formData={formData!}
              uploadedFiles={uploadedFiles}
              isGenerating={isGenerating}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;