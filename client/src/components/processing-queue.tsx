import { Button } from "@/components/ui/button";
import type { Conversion } from "@shared/schema";

interface ProcessingQueueProps {
  conversions: Conversion[];
  isLoading: boolean;
  onDownload: (id: string) => void;
  onDelete: (id: string) => void;
  onRetry: (id: string) => void;
  isDeleting: boolean;
  isRetrying: boolean;
}

export function ProcessingQueue({
  conversions,
  isLoading,
  onDownload,
  onDelete,
  onRetry,
  isDeleting,
  isRetrying,
}: ProcessingQueueProps) {
  if (isLoading) {
    return (
      <div className="space-y-4" data-testid="processing-queue-loading">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-6 animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="bg-muted w-12 h-12 rounded-lg" />
              <div className="flex-1">
                <div className="bg-muted h-4 rounded w-48 mb-2" />
                <div className="bg-muted h-3 rounded w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (conversions.length === 0) {
    return (
      <div className="text-center py-12" data-testid="no-conversions">
        <div className="bg-muted rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">No files uploaded yet</h3>
        <p className="text-muted-foreground">Upload some DOCX files to get started</p>
      </div>
    );
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading':
        return (
          <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'converting':
        return (
          <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'completed':
        return (
          <div className="bg-green-100 text-green-600 p-2 rounded-lg">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'failed':
        return (
          <div className="bg-red-100 text-red-600 p-2 rounded-lg">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="bg-gray-100 text-gray-600 p-2 rounded-lg">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
            </svg>
          </div>
        );
    }
  };

  const getStatusText = (conversion: Conversion) => {
    switch (conversion.status) {
      case 'uploading':
        return 'Uploading...';
      case 'converting':
        return 'Converting...';
      case 'completed':
        return 'Converted successfully';
      case 'failed':
        return conversion.error || 'Conversion failed';
      default:
        return conversion.status;
    }
  };

  return (
    <div className="space-y-4" data-testid="processing-queue">
      {conversions.map((conversion) => (
        <div
          key={conversion.id}
          className={`status-card bg-card border rounded-lg p-6 transition-all duration-300 ${
            conversion.status === 'failed' ? 'border-destructive/20' : 'border-border'
          }`}
          data-testid={`conversion-card-${conversion.id}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {getStatusIcon(conversion.status)}
              <div>
                <h4 className="font-medium text-foreground" data-testid={`text-filename-${conversion.id}`}>
                  {conversion.filename}
                </h4>
                <div className="text-sm text-muted-foreground">
                  <span data-testid={`text-filesize-${conversion.id}`}>
                    {formatFileSize(conversion.originalSize)}
                  </span>
                  {conversion.status !== 'failed' && (
                    <>
                      {" • "}
                      <span className={
                        conversion.status === 'completed' ? 'text-green-600' :
                        conversion.status === 'failed' ? 'text-destructive' :
                        'text-primary'
                      }>
                        {getStatusText(conversion)}
                      </span>
                    </>
                  )}
                  {conversion.status === 'failed' && (
                    <p className="text-destructive text-sm mt-1">
                      {conversion.error || 'Unknown error occurred'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {(conversion.status === 'uploading' || conversion.status === 'converting') && (
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm font-medium text-primary">
                      {conversion.status === 'uploading' ? 'Uploading...' : 'Converting...'}
                    </span>
                  </div>
                  <div className="mt-1">
                    <div className="bg-muted rounded-full h-2 w-32">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-500 ease-in-out"
                        style={{ width: `${conversion.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                {conversion.status === 'completed' && (
                  <Button
                    onClick={() => onDownload(conversion.id)}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium"
                    data-testid={`button-download-${conversion.id}`}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-4-4m4 4l4-4m-4-6V4a2 2 0 00-2-2H8a2 2 0 00-2 2v2" />
                    </svg>
                    Download PDF
                  </Button>
                )}

                {conversion.status === 'failed' && (
                  <Button
                    onClick={() => onRetry(conversion.id)}
                    disabled={isRetrying}
                    className="font-medium"
                    data-testid={`button-retry-${conversion.id}`}
                  >
                    {isRetrying ? (
                      <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    )}
                    Retry
                  </Button>
                )}

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onDelete(conversion.id)}
                  disabled={isDeleting}
                  title="Remove"
                  data-testid={`button-delete-${conversion.id}`}
                >
                  {isDeleting ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
