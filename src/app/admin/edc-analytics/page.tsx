import { getEdcAnalyticsDaily } from "@/lib/firebase/admin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const DAYS = 30;

function sumPageViews(rows: { pageViews: number }[], lastN: number) {
  return rows.slice(-lastN).reduce((acc, r) => acc + r.pageViews, 0);
}

export default async function AdminEdcAnalyticsPage() {
  const rows = await getEdcAnalyticsDaily(DAYS);
  const last7 = sumPageViews(rows, 7);
  const last30 = sumPageViews(rows, DAYS);
  const maxPv = Math.max(...rows.map((r) => r.pageViews), 0);
  const ingestConfigured = Boolean(process.env.EDC_ANALYTICS_INGEST_SECRET?.length);

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          EDC analytics
        </h1>
        <p className="mt-1 text-muted-foreground">
          Traffic to <span className="font-medium text-foreground">/edc</span> (proxied app). Page
          views are counted once per full document load of{" "}
          <span className="font-medium text-foreground">/edc/</span> (bots filtered loosely).
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Last 7 days</CardTitle>
            <CardDescription>UTC calendar days</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tabular-nums">{last7}</p>
            <p className="text-xs text-muted-foreground">EDC page loads</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Last 30 days</CardTitle>
            <CardDescription>UTC calendar days</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tabular-nums">{last30}</p>
            <p className="text-xs text-muted-foreground">EDC page loads</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Daily page loads</CardTitle>
          <CardDescription>Each bar is one UTC day (Firestore doc id yyyy-mm-dd)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-36 items-end gap-px sm:gap-0.5">
            {rows.map((r) => (
              <div
                key={r.date}
                title={`${r.date}: ${r.pageViews} views`}
                className="min-w-0 flex-1 rounded-t-sm bg-chart-1/90 transition-opacity hover:opacity-80"
                style={{
                  height:
                    maxPv === 0
                      ? "4px"
                      : `${Math.max(8, (r.pageViews / maxPv) * 100)}%`,
                }}
              />
            ))}
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Oldest ← {rows[0]?.date} … {rows[rows.length - 1]?.date} → Newest
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Configuration</CardTitle>
          <CardDescription>
            {ingestConfigured ? (
              <>
                <span className="text-foreground">
                  Ingest secret is present on this deployment
                </span>{" "}
                (the value is never shown here). Page loads are recorded when visitors open{" "}
                <code className="text-foreground">/edc/</code>. If counts stay at zero after
                traffic, trigger a new production deploy after saving env vars and confirm the
                variable applies to <span className="font-medium">Production</span>, not only
                Preview.
              </>
            ) : (
              <>
                Add{" "}
                <code className="text-foreground">EDC_ANALYTICS_INGEST_SECRET</code> in this
                project&apos;s Vercel environment variables, then redeploy. Only the portfolio app
                needs it—not the EDC app.
              </>
            )}
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
