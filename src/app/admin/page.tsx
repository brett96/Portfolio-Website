import Link from "next/link";
import { getProjects, getExperience, getEducation } from "@/lib/firebase/admin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderOpen, Briefcase, GraduationCap, ArrowRight, FileText, Type, FileDown } from "lucide-react";

export default async function AdminDashboardPage() {
  const [projects, experience, education] = await Promise.all([
    getProjects(),
    getExperience(),
    getEducation(),
  ]);

  const links = [
    { href: "/admin/hero", label: "Site header", count: null, icon: Type },
    { href: "/admin/projects", label: "Projects", count: projects.length, icon: FolderOpen },
    { href: "/admin/experience", label: "Experience", count: experience.length, icon: Briefcase },
    { href: "/admin/education", label: "Education", count: education.length, icon: GraduationCap },
    { href: "/admin/about", label: "About", count: null, icon: FileText },
    { href: "/admin/resume", label: "Resume", count: null, icon: FileDown },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          Dashboard
        </h1>
        <p className="mt-1 text-muted-foreground">
          Manage your portfolio content. Changes appear on the public site after revalidation (up to 1 hour) or on next load.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {links.map(({ href, label, count, icon: Icon }) => (
          <Card key={href} className="border-border/80 transition-shadow hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">{label}</CardTitle>
              <Icon className="size-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {count !== null ? (
                <>
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-xs text-muted-foreground">entries</p>
                </>
              ) : (
                <p className="text-xs text-muted-foreground">Home page section</p>
              )}
              <Link
                href={href}
                className="mt-4 flex h-7 w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-2.5 text-[0.8rem] font-medium hover:bg-muted hover:text-foreground"
              >
                Manage
                <ArrowRight className="size-3.5" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
