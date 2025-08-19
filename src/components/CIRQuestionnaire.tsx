import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { CIRFormData } from "@/pages/Index";
import { ArrowRight, Building, Calendar, Euro, Users, Target, Lightbulb } from "lucide-react";

interface CIRQuestionnaireProps {
  onComplete: (data: CIRFormData) => void;
}

export const CIRQuestionnaire = ({ onComplete }: CIRQuestionnaireProps) => {
  const [formData, setFormData] = useState<CIRFormData>({
    companyName: "",
    projectTitle: "",
    projectDescription: "",
    objectives: "",
    startDate: "",
    endDate: "",
    budget: "",
    teamSize: "",
    technicalChallenges: "",
    expectedResults: ""
  });

  const [currentSection, setCurrentSection] = useState(0);

  const sections = [
    {
      title: "Informations générales",
      icon: Building,
      fields: [
        { key: "companyName", label: "Nom de R&D Lines", type: "input", required: true },
        { key: "projectTitle", label: "Titre du projet", type: "input", required: true }
      ]
    },
    {
      title: "Description du projet",
      icon: Target,
      fields: [
        { key: "projectDescription", label: "Description du projet", type: "textarea", required: true },
        { key: "objectives", label: "Objectifs principaux", type: "textarea", required: true }
      ]
    },
    {
      title: "Planning et ressources",
      icon: Calendar,
      fields: [
        { key: "startDate", label: "Date de début", type: "date", required: true },
        { key: "endDate", label: "Date de fin", type: "date", required: true },
        { key: "budget", label: "Budget total (€)", type: "number", required: true },
        { key: "teamSize", label: "Taille de l'équipe", type: "number", required: true }
      ]
    },
    {
      title: "Aspects techniques",
      icon: Lightbulb,
      fields: [
        { key: "technicalChallenges", label: "Défis techniques", type: "textarea", required: true },
        { key: "expectedResults", label: "Résultats attendus", type: "textarea", required: true }
      ]
    }
  ];

  const handleInputChange = (key: keyof CIRFormData, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const isCurrentSectionValid = () => {
    const currentFields = sections[currentSection].fields;
    return currentFields.every(field => 
      !field.required || formData[field.key as keyof CIRFormData].trim() !== ""
    );
  };

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      onComplete(formData);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const currentSectionData = sections[currentSection];
  const Icon = currentSectionData.icon;

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-8">
        {sections.map((_, index) => (
          <div key={index} className="flex items-center">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300
              ${index === currentSection ? 'bg-primary text-primary-foreground shadow-medium' :
                index < currentSection ? 'bg-accent text-accent-foreground' :
                'bg-muted text-muted-foreground'}
            `}>
              {index + 1}
            </div>
            {index < sections.length - 1 && (
              <div className={`w-16 h-0.5 mx-2 transition-colors duration-300 ${
                index < currentSection ? 'bg-accent' : 'bg-border'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Current Section */}
      <Card className="p-6 shadow-soft">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Icon className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-foreground">{currentSectionData.title}</h3>
            <p className="text-sm text-muted-foreground">
              Section {currentSection + 1} sur {sections.length}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {currentSectionData.fields.map((field) => (
            <div key={field.key} className="space-y-2">
              <Label htmlFor={field.key} className="text-foreground font-medium">
                {field.label}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </Label>
              {field.type === "textarea" ? (
                <Textarea
                  id={field.key}
                  value={formData[field.key as keyof CIRFormData]}
                  onChange={(e) => handleInputChange(field.key as keyof CIRFormData, e.target.value)}
                  rows={4}
                  className="resize-none"
                  placeholder={`Saisissez ${field.label.toLowerCase()}...`}
                />
              ) : (
                <Input
                  id={field.key}
                  type={field.type}
                  value={formData[field.key as keyof CIRFormData]}
                  onChange={(e) => handleInputChange(field.key as keyof CIRFormData, e.target.value)}
                  placeholder={field.type === "date" ? "" : `Saisissez ${field.label.toLowerCase()}...`}
                />
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-4">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentSection === 0}
          className="transition-all duration-300"
        >
          Précédent
        </Button>

        <div className="text-sm text-muted-foreground">
          {currentSection + 1} / {sections.length}
        </div>

        <Button
          onClick={handleNext}
          disabled={!isCurrentSectionValid()}
          className="bg-gradient-primary hover:opacity-90 shadow-soft transition-all duration-300"
        >
          {currentSection === sections.length - 1 ? (
            <>
              Terminer
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          ) : (
            <>
              Suivant
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};