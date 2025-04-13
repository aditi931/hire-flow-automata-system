
import React, { useState, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Check, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ResumeUploadProps {
  onUploadComplete: (files: File[]) => void;
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({ onUploadComplete }) => {
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      file => file.type === 'application/pdf' || 
              file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
              file.name.endsWith('.zip')
    );
    
    if (droppedFiles.length === 0) {
      toast({
        title: "Invalid files",
        description: "Please upload PDF, DOCX, or ZIP files containing resumes.",
        variant: "destructive",
      });
      return;
    }
    
    handleFilesSelected(droppedFiles);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files).filter(
        file => file.type === 'application/pdf' || 
                file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                file.name.endsWith('.zip')
      );
      
      if (selectedFiles.length === 0) {
        toast({
          title: "Invalid files",
          description: "Please upload PDF, DOCX, or ZIP files containing resumes.",
          variant: "destructive",
        });
        return;
      }
      
      handleFilesSelected(selectedFiles);
    }
  };

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    toast({
      title: "Files added",
      description: `${selectedFiles.length} ${selectedFiles.length === 1 ? 'file' : 'files'} selected.`,
    });
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select files to upload first.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onUploadComplete(files);
    toast({
      title: "Upload complete",
      description: `${files.length} ${files.length === 1 ? 'resume' : 'resumes'} uploaded successfully.`,
    });
    
    setUploading(false);
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div 
          className={`border-2 border-dashed rounded-lg p-6 text-center ${dragging ? 'border-primary bg-primary/5' : 'border-gray-300'}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">Upload Resumes</h3>
          <p className="text-sm text-gray-500 mb-4">
            Drag and drop resume files here, or click to browse
          </p>
          <p className="text-xs text-gray-400 mb-4">
            Supports PDF, DOCX, or ZIP (containing multiple resumes)
          </p>
          <Button 
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="mx-auto"
          >
            Browse Files
          </Button>
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden"
            accept=".pdf,.docx,.zip"
            multiple
            onChange={handleFileInputChange}
          />
        </div>

        {files.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium mb-2">Selected Files ({files.length})</h4>
            <div className="max-h-40 overflow-y-auto border rounded-md p-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center text-sm py-1">
                  <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{file.name}</span>
                  <span className="ml-auto text-xs text-gray-400">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                </div>
              ))}
            </div>
            <Button 
              className="mt-4 w-full"
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? (
                <>Processing...</>
              ) : (
                <>Upload Resumes</>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResumeUpload;
