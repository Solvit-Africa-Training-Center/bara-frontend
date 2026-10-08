import { ReportsSkeleton } from "./_components/reports-skeleton"

export default function ReportsLoading() {
  return (
    <div className="w-full">
      <ReportsSkeleton includeHeaderAndFilters={true} />
    </div>
  )
}
