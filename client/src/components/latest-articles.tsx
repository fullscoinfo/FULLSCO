import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { ArrowRight, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDate, getInitials } from '@/lib/utils';
import { Post, User } from '@shared/schema';

const LatestArticles = () => {
  const { data: posts, isLoading, error } = useQuery<Post[]>({
    queryKey: ['/api/posts'],
  });

  const { data: users } = useQuery<User[]>({
    queryKey: ['/api/users'],
  });

  const getAuthorName = (authorId?: number) => {
    if (!authorId || !users) return 'فريق FULLSCO';
    const author = users.find(u => u.id === authorId);
    return author?.fullName || 'فريق FULLSCO';
  };

  if (isLoading) {
    return (
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold sm:text-3xl">أحدث المقالات والإرشادات</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-muted"></div>
                <div className="p-5">
                  <div className="h-4 w-20 bg-muted mb-2 rounded"></div>
                  <div className="h-6 w-3/4 bg-muted mb-2 rounded"></div>
                  <div className="h-20 bg-muted mb-4 rounded"></div>
                  <div className="h-8 w-32 bg-muted rounded"></div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !posts) {
    return (
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold sm:text-3xl mb-4">أحدث المقالات والإرشادات</h2>
            <p className="text-destructive">فشل في تحميل المقالات. يرجى المحاولة مرة أخرى لاحقاً.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold sm:text-3xl">أحدث المقالات والإرشادات</h2>
          <Link href="/articles">
            <span className="text-primary hover:text-primary/90 font-medium flex items-center gap-2">
              عرض الكل <ArrowRight className="h-4 w-4 rotate-180" />
            </span>
          </Link>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, 3).map((post) => (
            <Card key={post.id} className="overflow-hidden transition-all hover:shadow-md">
              <img 
                src={post.imageUrl || "https://images.unsplash.com/photo-1517486808906-6ca8b3f8e1c1"}
                alt={post.title}
                className="h-48 w-full object-cover article-card-image"
              />
              <div className="p-5">
                <div className="mb-2 flex items-center">
                  <Badge variant="secondary" className="rounded-full">دليل</Badge>
                  <span className="mx-2 text-xs text-muted-foreground">{formatDate(post.createdAt)}</span>
                  <span className="text-xs text-muted-foreground flex items-center">
                    <Eye className="ml-1 h-3 w-3" /> {post.views || 0}
                  </span>
                </div>
                <h3 className="mb-2 text-xl font-bold">
                  <Link href={`/articles/${post.slug}`}>
                    <span className="hover:text-primary">{post.title}</span>
                  </Link>
                </h3>
                <p className="mb-4 text-sm text-muted-foreground line-clamp-3">
                  {post.excerpt || post.content}
                </p>
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 ml-2">
                    <AvatarImage src="https://randomuser.me/api/portraits/men/1.jpg" alt={getAuthorName(post.authorId)} />
                    <AvatarFallback>{getInitials(getAuthorName(post.authorId))}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{getAuthorName(post.authorId)}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestArticles;
