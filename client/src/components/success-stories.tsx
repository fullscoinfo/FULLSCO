import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SuccessStory } from '@shared/schema';

const SuccessStories = () => {
  const { data: stories, isLoading, error } = useQuery<SuccessStory[]>({
    queryKey: ['/api/success-stories'],
  });

  if (isLoading) {
    return (
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold sm:text-3xl mb-4">قصص النجاح</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">اقرأ عن كيف تمكن الطلاب الآخرين من الحصول على المنح الدراسية والسعي لتحقيق أحلامهم الأكاديمية.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {[1, 2].map((i) => (
              <div key={i} className="bg-card rounded-lg overflow-hidden shadow-soft border border-border flex flex-col md:flex-row animate-pulse">
                <div className="md:w-2/5 bg-muted h-64"></div>
                <div className="p-6 md:w-3/5">
                  <div className="h-4 w-24 bg-muted mb-2 rounded"></div>
                  <div className="h-6 w-48 bg-muted mb-2 rounded"></div>
                  <div className="h-4 w-40 bg-muted mb-3 rounded"></div>
                  <div className="h-24 bg-muted mb-4 rounded"></div>
                  <div className="h-4 w-32 bg-muted rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !stories || stories.length === 0) {
    return (
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold sm:text-3xl mb-4">قصص النجاح</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-4">اقرأ عن كيف تمكن الطلاب الآخرين من الحصول على المنح الدراسية والسعي لتحقيق أحلامهم الأكاديمية.</p>
            {error && <p className="text-destructive">فشل في تحميل قصص النجاح. يرجى المحاولة مرة أخرى لاحقاً.</p>}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold sm:text-3xl mb-4">قصص النجاح</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">اقرأ عن كيف تمكن الطلاب الآخرين من الحصول على المنح الدراسية والسعي لتحقيق أحلامهم الأكاديمية.</p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2">
          {stories.slice(0, 2).map((story) => (
            <div key={story.id} className="bg-card rounded-lg overflow-hidden shadow-soft border border-border flex flex-col md:flex-row">
              <div className="md:w-2/5">
                <img 
                  src={story.imageUrl || "https://randomuser.me/api/portraits/men/75.jpg"}
                  alt={story.name}
                  className="h-64 w-full object-cover md:h-full success-story-image"
                />
              </div>
              <div className="p-6 md:w-3/5">
                <Badge variant="primary" className="inline-block mb-2 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  {story.scholarshipName}
                </Badge>
                <h3 className="text-xl font-bold mb-2">{story.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{story.title}</p>
                <p className="text-muted-foreground mb-4 line-clamp-4">
                  {story.content}
                </p>
                <Link href={`/success-stories/${story.slug}`}>
                  <span className="text-primary hover:text-primary/90 font-medium flex items-center gap-2 text-sm">
                    اقرأ القصة كاملة <ArrowRight className="h-4 w-4 rotate-180" />
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <Link href="/success-stories">
            <Button>
              عرض المزيد من قصص النجاح
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;
