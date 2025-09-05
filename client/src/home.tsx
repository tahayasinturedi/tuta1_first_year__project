import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UploadZone } from "@/components/upload-zone";
import { ProcessingQueue } from "@/components/processing-queue";
import { StatsSection } from "@/components/stats-section";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Conversion } from "@shared/schema";

export default function Home() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch conversions
  const { data: conversions = [], isLoading: conversionsLoading } = useQuery<Conversion[]>({
    queryKey: ["/api/conversions"],
    refetchInterval: 2000, // Poll every 2 seconds for status updates
  });

  // Fetch stats
  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
    refetchInterval: 5000, // Poll every 5 seconds
  });

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (files: FileList) => {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append("files", file);
      });

      const response = await apiRequest("POST", "/api/upload", formData);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Upload Successful",
        description: `${data.conversions.length} file(s) uploaded and queued for conversion`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/conversions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
    onError: (error) => {
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload files",
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/conversions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
    onError: (error) => {
      toast({
        title: "Delete Failed",
        description: error instanceof Error ? error.message : "Failed to delete conversion",
        variant: "destructive",
      });
    },
  });

  // Retry mutation
  const retryMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("POST", `/api/conversions/${id}/retry`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Retry Started",
        description: "File has been queued for conversion again",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/conversions"] });
    },
    onError: (error) => {
      toast({
        title: "Retry Failed",
        description: error instanceof Error ? error.message : "Failed to retry conversion",
        variant: "destructive",
      });
    },
  });

  // Download function
  const handleDownload = async (id: string) => {
    try {
      const response = await apiRequest("GET", `/api/download/${id}`);
      const data = await response.json();
      
      // Open download URL in new tab
      window.open(data.downloadUrl, "_blank");
    } catch (error) {
      toast({
        title: "Download Failed",
        description: error instanceof Error ? error.message : "Failed to generate download link",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = (files: FileList) => {
    // Validate files
    const validFiles = Array.from(files).filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: `${file.name} exceeds 10MB limit`,
          variant: "destructive",
        });
        return false;
      }
      if (!file.name.toLowerCase().endsWith('.docx')) {
        toast({
          title: "Invalid File Type",
          description: `${file.name} is not a .docx file`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      const fileList = new DataTransfer();
      validFiles.forEach(file => fileList.items.add(file));
      uploadMutation.mutate(fileList.files);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm" data-testid="header">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">DocX to PDF Converter</h1>
                <p className="text-muted-foreground text-sm">Convert your Word documents to PDF format</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Upload Section */}
        <div className="mb-8">
          <UploadZone
            onFileUpload={handleFileUpload}
            isUploading={uploadMutation.isPending}
          />
        </div>

        {/* Processing Queue */}
        <ProcessingQueue
          conversions={conversions}
          isLoading={conversionsLoading}
          onDownload={handleDownload}
          onDelete={(id) => deleteMutation.mutate(id)}
          onRetry={(id) => retryMutation.mutate(id)}
          isDeleting={deleteMutation.isPending}
          isRetrying={retryMutation.isPending}
        />

        {/* Stats Section */}
        <StatsSection stats={stats} />

        {/* Info Section */}
        <div className="mt-12 bg-muted rounded-lg p-8" data-testid="info-section">
          <h3 className="text-lg font-semibold text-foreground mb-4">How it works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center mb-3 font-bold">1</div>
              <h4 className="font-medium text-foreground mb-2">Upload</h4>
              <p className="text-sm text-muted-foreground">Select and upload your DOCX files using the drag & drop interface</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center mb-3 font-bold">2</div>
              <h4 className="font-medium text-foreground mb-2">Convert</h4>
              <p className="text-sm text-muted-foreground">Our AWS Lambda functions process your files securely in the cloud</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center mb-3 font-bold">3</div>
              <h4 className="font-medium text-foreground mb-2">Download</h4>
              <p className="text-sm text-muted-foreground">Download your converted PDF files instantly when processing is complete</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}