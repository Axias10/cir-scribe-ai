import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UploadedFile } from "@/pages/Index";
import { Upload, X, File, FileText, FileImage, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onFilesUploaded: (files: UploadedFile[]) => void;
}

export const FileUpload = ({ onFilesUploaded }: FileUploadProps) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const acceptedTypes = {
    'application/pdf': '.pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx'
  };

  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const validateFile = (file: File): string | null => {
    if (!Object.keys(acceptedTypes).includes(file.type)) {
      return 'Type de fichier non supporté. Utilisez PDF, DOCX ou PPTX.';
    }
    if (file.size > maxFileSize) {
      return 'Fichier trop volumineux. Taille maximale: 10MB.';
    }
    return null;
  };

  const handleFileAdd = (newFiles: FileList | File[]) => {
    const validFiles: UploadedFile[] = [];
    const errors: string[] = [];

    Array.from(newFiles).forEach((file) => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else if (!files.find(f => f.name === file.name)) {
        validFiles.push({
          id: Date.now().toString() + Math.random().toString(36),
          name: file.name,
          size: file.size,
          type: file.type,
          file
        });
      }
    });

    if (errors.length > 0) {
      toast({
        title: "Erreurs de téléversement",
        description: errors.join(', '),
        variant: "destructive"
      });
    }

    if (validFiles.length > 0) {
      const updatedFiles = [...files, ...validFiles];
      setFiles(updatedFiles);
      onFilesUploaded(updatedFiles);
      
      toast({
        title: "Fichiers ajoutés",
        description: `${validFiles.length} fichier(s) téléversé(s) avec succès.`,
        variant: "default"
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files) {
      handleFileAdd(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileAdd(e.target.files);
    }
  };

  const removeFile = (fileId: string) => {
    const updatedFiles = files.filter(f => f.id !== fileId);
    setFiles(updatedFiles);
    onFilesUploaded(updatedFiles);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className="w-6 h-6 text-destructive" />;
    if (type.includes('document')) return <File className="w-6 h-6 text-primary" />;
    if (type.includes('presentation')) return <FileImage className="w-6 h-6 text-accent" />;
    return <File className="w-6 h-6 text-muted-foreground" />;
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <Card 
        className={`
          relative p-8 border-2 border-dashed transition-all duration-300 cursor-pointer
          ${isDragging ? 'border-primary bg-primary/5 shadow-medium' : 'border-border hover:border-primary/50'}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleFileSelect}
      >
        <div className="flex flex-col items-center text-center space-y-4">
          <div className={`
            w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300
            ${isDragging ? 'bg-primary text-primary-foreground scale-110' : 'bg-muted text-muted-foreground'}
          `}>
            <Upload className="w-8 h-8" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Glissez-déposez vos fichiers ici
            </h3>
            <p className="text-muted-foreground mb-4">
              ou cliquez pour sélectionner des fichiers
            </p>
            <Button variant="outline" type="button" className="transition-all duration-300">
              Parcourir les fichiers
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground space-y-1">
            <p>Formats acceptés: PDF, DOCX, PPTX</p>
            <p>Taille maximale: 10MB par fichier</p>
          </div>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.pptx"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <Card className="p-6 shadow-soft">
          <h4 className="text-lg font-semibold text-foreground mb-4">
            Documents téléversés ({files.length})
          </h4>
          
          <div className="space-y-3">
            {files.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getFileIcon(file.type)}
                  <div>
                    <p className="font-medium text-foreground">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(file.id);
                  }}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Help Text */}
      <Card className="p-4 bg-accent/5 border-accent/20">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-accent mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-accent mb-1">Conseil</p>
            <p className="text-muted-foreground">
              Téléversez vos documents techniques, rapports de recherche, présentations et autres 
              fichiers pertinents pour enrichir automatiquement votre rapport CIR.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};