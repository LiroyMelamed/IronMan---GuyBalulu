"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageField } from "@/components/admin/ImageField";
import { mergeContentItems, type SiteContentItem } from "@/lib/content";
import {
  updateAllContent,
  updateSeoMetadata,
  upsertMaterial,
  deleteMaterial,
  upsertProject,
  deleteProject,
} from "@/actions/content-actions";

interface MaterialItem {
  id: string;
  title: string;
  description: string;
  keyword: string;
  icon: string;
  imageUrl?: string | null;
  sortOrder: number;
  isActive: boolean;
}

interface ProjectItem {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl?: string | null;
  sortOrder: number;
  isActive: boolean;
}

interface SeoData {
  pageTitle: string;
  metaDescription: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  canonicalUrl: string;
  businessName: string;
  businessPhone: string;
  businessEmail: string;
  businessAddress: string;
  businessCity: string;
  businessRegion: string;
  businessPostal: string;
}

interface AdminDashboardProps {
  contentItems: SiteContentItem[];
  materials: MaterialItem[];
  projects: ProjectItem[];
  seo: SeoData;
}

const GROUP_LABELS: Record<string, string> = {
  hero: "Hero",
  media: "מדיה",
  materials: "מתכות",
  services: "שירותים",
  projects: "פרויקטים",
  contact: "יצירת קשר",
  contacts: "טלפונים ומנהלים",
  footer: "פוטר",
  nav: "ניווט",
};

const MEDIA_KEYS = new Set(["hero_image", "logo_image"]);

export function AdminDashboard({
  contentItems,
  materials: initialMaterials,
  projects: initialProjects,
  seo: initialSeo,
}: AdminDashboardProps) {
  const [content, setContent] = useState(() => mergeContentItems(contentItems));
  const [materials, setMaterials] = useState(initialMaterials);
  const [projects, setProjects] = useState(initialProjects);
  const [seo, setSeo] = useState(initialSeo);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const updateContentKey = (key: string, value: string) => {
    setContent((prev) => prev.map((c) => (c.key === key ? { ...c, value } : c)));
  };

  const handleSaveContent = () => {
    startTransition(async () => {
      await updateAllContent(content.map((c) => ({ key: c.key, value: c.value })));
      showMessage("התוכן נשמר בהצלחה");
    });
  };

  const handleSaveSeo = () => {
    startTransition(async () => {
      await updateSeoMetadata(seo);
      showMessage("נתוני SEO נשמרו בהצלחה");
    });
  };

  const groupedContent = content
    .filter((item) => !MEDIA_KEYS.has(item.key))
    .reduce<Record<string, SiteContentItem[]>>((acc, item) => {
      if (!acc[item.group]) acc[item.group] = [];
      acc[item.group].push(item);
      return acc;
    }, {});

  const mediaItems = content.filter((item) => MEDIA_KEYS.has(item.key));

  return (
    <div className="space-y-6">
      {message && (
        <div
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-md bg-green-900/80 text-green-200 text-sm border border-green-700/50"
          role="status"
        >
          {message}
        </div>
      )}

      <Tabs defaultValue="content" dir="rtl">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="content">תוכן</TabsTrigger>
          <TabsTrigger value="media">מדיה</TabsTrigger>
          <TabsTrigger value="materials">מתכות</TabsTrigger>
          <TabsTrigger value="projects">פרויקטים</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>עריכת תוכן האתר</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {Object.entries(groupedContent).map(([group, items]) => (
                <div key={group} className="space-y-4">
                  <h3 className="text-lg font-semibold text-terex-charcoal border-b border-terex-gray pb-2">
                    {GROUP_LABELS[group] ?? group}
                  </h3>
                  {items.map((item) => (
                    <div key={item.key} className="space-y-2">
                      <Label htmlFor={item.key}>{item.label}</Label>
                      {item.value.length > 100 ? (
                        <Textarea
                          id={item.key}
                          value={item.value}
                          onChange={(e) => updateContentKey(item.key, e.target.value)}
                          rows={3}
                        />
                      ) : (
                        <Input
                          id={item.key}
                          value={item.value}
                          onChange={(e) => updateContentKey(item.key, e.target.value)}
                          dir={
                            item.key.includes("phone") || item.key.includes("whatsapp")
                              ? "ltr"
                              : undefined
                          }
                          className={
                            item.key.includes("phone") || item.key.includes("whatsapp")
                              ? "text-left"
                              : undefined
                          }
                        />
                      )}
                    </div>
                  ))}
                </div>
              ))}
              <Button onClick={handleSaveContent} variant="solid" disabled={isPending}>
                {isPending ? "שומר..." : "שמור תוכן"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media">
          <Card>
            <CardHeader>
              <CardTitle>תמונות ולוגו</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {mediaItems.map((item) => (
                <ImageField
                  key={item.key}
                  id={item.key}
                  label={item.label}
                  value={item.value}
                  onChange={(url) => updateContentKey(item.key, url)}
                />
              ))}
              <Button onClick={handleSaveContent} variant="solid" disabled={isPending}>
                {isPending ? "שומר..." : "שמור מדיה"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="materials">
          <Card>
            <CardHeader>
              <CardTitle>ניהול מתכות</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {materials.map((material, index) => (
                <div key={material.id} className="p-4 border border-terex-gray space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>כותרת</Label>
                      <Input
                        value={material.title}
                        onChange={(e) =>
                          setMaterials((prev) =>
                            prev.map((m, i) => (i === index ? { ...m, title: e.target.value } : m))
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>מילת מפתח</Label>
                      <Input
                        value={material.keyword}
                        onChange={(e) =>
                          setMaterials((prev) =>
                            prev.map((m, i) =>
                              i === index ? { ...m, keyword: e.target.value } : m
                            )
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>תיאור</Label>
                    <Textarea
                      value={material.description}
                      onChange={(e) =>
                        setMaterials((prev) =>
                          prev.map((m, i) =>
                            i === index ? { ...m, description: e.target.value } : m
                          )
                        )
                      }
                      rows={2}
                    />
                  </div>
                  <ImageField
                    id={`material-${material.id}`}
                    label="תמונה"
                    value={material.imageUrl ?? ""}
                    onChange={(url) =>
                      setMaterials((prev) =>
                        prev.map((m, i) => (i === index ? { ...m, imageUrl: url } : m))
                      )
                    }
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="solid"
                      disabled={isPending}
                      onClick={() =>
                        startTransition(async () => {
                          await upsertMaterial(material);
                          showMessage("המתכת נשמרה");
                        })
                      }
                    >
                      שמור
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isPending}
                      onClick={() =>
                        startTransition(async () => {
                          await deleteMaterial(material.id);
                          setMaterials((prev) => prev.filter((_, i) => i !== index));
                          showMessage("המתכת נמחקה");
                        })
                      }
                    >
                      מחק
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle>ניהול פרויקטים</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {projects.map((project, index) => (
                <div key={project.id} className="p-4 border border-terex-gray space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>כותרת</Label>
                      <Input
                        value={project.title}
                        onChange={(e) =>
                          setProjects((prev) =>
                            prev.map((p, i) => (i === index ? { ...p, title: e.target.value } : p))
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>קטגוריה</Label>
                      <Input
                        value={project.category}
                        onChange={(e) =>
                          setProjects((prev) =>
                            prev.map((p, i) =>
                              i === index ? { ...p, category: e.target.value } : p
                            )
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>תיאור</Label>
                    <Textarea
                      value={project.description}
                      onChange={(e) =>
                        setProjects((prev) =>
                          prev.map((p, i) =>
                            i === index ? { ...p, description: e.target.value } : p
                          )
                        )
                      }
                      rows={2}
                    />
                  </div>
                  <ImageField
                    id={`project-${project.id}`}
                    label="תמונה"
                    value={project.imageUrl ?? ""}
                    onChange={(url) =>
                      setProjects((prev) =>
                        prev.map((p, i) => (i === index ? { ...p, imageUrl: url } : p))
                      )
                    }
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="solid"
                      disabled={isPending}
                      onClick={() =>
                        startTransition(async () => {
                          await upsertProject(project);
                          showMessage("הפרויקט נשמר");
                        })
                      }
                    >
                      שמור
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isPending}
                      onClick={() =>
                        startTransition(async () => {
                          await deleteProject(project.id);
                          setProjects((prev) => prev.filter((_, i) => i !== index));
                          showMessage("הפרויקט נמחק");
                        })
                      }
                    >
                      מחק
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle>ניהול SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(
                [
                  ["pageTitle", "כותרת דף"],
                  ["metaDescription", "תיאור מטא"],
                  ["keywords", "מילות מפתח"],
                  ["ogTitle", "כותרת OG"],
                  ["ogDescription", "תיאור OG"],
                  ["canonicalUrl", "URL קנוני"],
                  ["businessName", "שם העסק"],
                  ["businessPhone", "טלפון"],
                  ["businessEmail", "אימייל"],
                  ["businessAddress", "כתובת"],
                  ["businessCity", "עיר"],
                  ["businessRegion", "אזור"],
                  ["businessPostal", "מיקוד"],
                ] as const
              ).map(([key, label]) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={`seo-${key}`}>{label}</Label>
                  {key === "metaDescription" || key === "ogDescription" || key === "keywords" ? (
                    <Textarea
                      id={`seo-${key}`}
                      value={seo[key]}
                      onChange={(e) => setSeo((prev) => ({ ...prev, [key]: e.target.value }))}
                      rows={2}
                    />
                  ) : (
                    <Input
                      id={`seo-${key}`}
                      value={seo[key]}
                      onChange={(e) => setSeo((prev) => ({ ...prev, [key]: e.target.value }))}
                      dir={
                        key.includes("Url") || key.includes("Phone") || key.includes("Email")
                          ? "ltr"
                          : undefined
                      }
                      className={
                        key.includes("Url") || key.includes("Phone") || key.includes("Email")
                          ? "text-left"
                          : undefined
                      }
                    />
                  )}
                </div>
              ))}
              <Button onClick={handleSaveSeo} variant="solid" disabled={isPending}>
                {isPending ? "שומר..." : "שמור SEO"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
