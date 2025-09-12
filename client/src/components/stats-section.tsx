interface StatsData {
  totalUploaded: number;
  totalConverted: number;
  avgProcessingTime: string;
}

interface StatsSectionProps {
  stats?: StatsData;
}

export function StatsSection({ stats }: StatsSectionProps) {
  const defaultStats = {
    totalUploaded: 0,
    totalConverted: 0,
    avgProcessingTime: "--",
  };

  const currentStats = stats || defaultStats;

  return (
    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6" data-testid="stats-section">
      <div className="bg-card border border-border rounded-lg p-6 text-center">
        <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-1" data-testid="stat-total-uploaded">
          {currentStats.totalUploaded}
        </h3>
        <p className="text-sm text-muted-foreground">Files Uploaded</p>
      </div>

      <div className="bg-card border border-border rounded-lg p-6 text-center">
        <div className="bg-green-100 text-green-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-1" data-testid="stat-total-converted">
          {currentStats.totalConverted}
        </h3>
        <p className="text-sm text-muted-foreground">Successfully Converted</p>
      </div>

      <div className="bg-card border border-border rounded-lg p-6 text-center">
        <div className="bg-amber-100 text-amber-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-1" data-testid="stat-avg-processing-time">
          {currentStats.avgProcessingTime}
        </h3>
        <p className="text-sm text-muted-foreground">Avg Processing Time</p>
      </div>
    </div>
  );
}
