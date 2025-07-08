import React from "react";

interface FilePreviewProps {
  file: File;
  className?: string;
}

export const FilePreview: React.FC<FilePreviewProps> = ({ file, className }) => {
  return (
    <div className={`p-2 border rounded ${className}`}>
      <p className="text-sm text-muted-foreground">File: {file.name}</p>
    </div>
  );
}; 