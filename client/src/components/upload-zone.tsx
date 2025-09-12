import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  onFileUpload: (files: FileList) => void;
  isUploading?: boolean;
}

export function UploadZone({ onFileUpload, isUploading }: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileUpload(files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileUpload(files);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={cn(
        "upload-zone bg-card border-2 border-dashed border-border rounded-xl p-12 text-center cursor-pointer transition-all duration-300 hover:border-primary hover:-translate-y-0.5 hover:shadow-lg",
        isDragOver && "border-primary bg-accent",
        isUploading && "opacity-50 cursor-not-allowed"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={!isUploading ? handleClick : undefined}
      data-testid="upload-zone"
    >
      <div className="space-y-4">
        <div className="bg-muted rounded-full w-16 h-16 flex items-center justify-center mx-auto">
          {isUploading ? (
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {isUploading ? "Uploading files..." : "Drop your DOCX files here"}
          </h3>
          <p className="text-muted-foreground mb-4">
            {isUploading ? "Please wait while your files are being uploaded" : "or click to browse and select files"}
          </p>
          {!isUploading && (
            <Button 
              className="font-medium"
              data-testid="button-choose-files"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
              </svg>
              Choose Files
            </Button>
          )}
        </div>
        <div className="text-xs text-muted-foreground">
          <p>Supported format: .docx files up to 10MB</p>
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".docx"
        multiple
        className="hidden"
        onChange={handleFileSelect}
        disabled={isUploading}
        data-testid="input-file"
      />
    </div>
  );
}
