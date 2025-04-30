import { useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { usePage } from "@/hooks/use-pages";
import { Helmet } from "react-helmet";
import { Loader2 } from "lucide-react";

const StaticPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: page, isLoading, error } = usePage(slug);
  const [_, setLocation] = useLocation();

  useEffect(() => {
    // إذا كان هناك خطأ (مثل الصفحة غير موجودة)، قم بالتوجيه إلى الصفحة الرئيسية
    if (error && !isLoading) {
      setLocation("/404");
    }
  }, [error, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!page) {
    return null; // سيتم توجيهنا بواسطة useEffect إلى صفحة الخطأ
  }

  return (
    <div className="bg-background">
      <Helmet>
        <title>{page.metaTitle || `${page.title} | FULLSCO`}</title>
        {page.metaDescription && <meta name="description" content={page.metaDescription} />}
      </Helmet>

      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* عنوان الصفحة */}
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">{page.title}</h1>
          
          {/* محتوى الصفحة */}
          <div 
            className="prose prose-lg dark:prose-invert prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:text-foreground/90 max-w-none"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </div>
      </div>
    </div>
  );
};

export default StaticPage;