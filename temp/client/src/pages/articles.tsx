import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { Eye, Calendar, UserCircle, Tag, Bookmark, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import SearchBar from '@/components/search-bar';
import { formatDate } from '@/lib/utils';
import { Post, User } from '@shared/schema';
import { Helmet } from 'react-helmet';

const Articles = () => {
  const [location] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  
  // معالجة معلمات البحث في URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.split('?')[1]);
    const search = searchParams.get('search');
    if (search) setSearchTerm(search);
  }, [location]);

  // جلب المقالات
  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ['/api/posts'],
  });

  // جلب المستخدمين (المؤلفين)
  const { data: users } = useQuery<User[]>({
    queryKey: ['/api/users'],
  });

  // الحصول على اسم المؤلف
  const getAuthorName = (authorId?: number) => {
    if (!authorId || !users) return 'فريق FULLSCO';
    const author = users.find(u => u.id === authorId);
    return author?.fullName || 'فريق FULLSCO';
  };
  
  // تصفية المقالات بناءً على مصطلح البحث
  const filteredPosts = posts?.filter(post => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      post.title.toLowerCase().includes(search) ||
      post.content.toLowerCase().includes(search) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(search))
    );
  });

  return (
    <>
      <Helmet>
        <title>مقالات ومصادر تعليمية عن المنح الدراسية | FULLSCO</title>
        <meta name="description" content="استكشف مجموعتنا من المقالات والأدلة والنصائح حول المنح الدراسية، كتابة مقالات القبول، والدراسة في الخارج." />
        <meta name="keywords" content="مقالات عن المنح الدراسية, دليل التقديم للمنح, كتابة مقال القبول, الدراسة في الخارج, FULLSCO" />
        <meta property="og:title" content="مقالات ومصادر تعليمية عن المنح الدراسية | FULLSCO" />
        <meta property="og:description" content="استكشف مجموعتنا من المقالات والأدلة والنصائح حول المنح الدراسية، كتابة مقالات القبول، والدراسة في الخارج." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fullsco.com/articles" />
        <link rel="canonical" href="https://fullsco.com/articles" />
      </Helmet>

      <main className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">المقالات والمصادر التعليمية</h1>
            <p className="text-gray-600 max-w-3xl">
              استكشف مجموعتنا من الأدلة والنصائح والمصادر التي ستساعدك في التنقل خلال عملية التقديم للمنح الدراسية بنجاح.
            </p>
          </div>

          {/* البحث */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-8 border border-gray-200">
            <SearchBar 
              placeholder="ابحث في المقالات..." 
              fullWidth 
              buttonText="بحث"
              className="max-w-xl"
            />
          </div>

          {/* المقالات المميزة */}
          {posts?.filter(post => post.isFeatured).length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Star className="ml-2 h-5 w-5 text-amber-500" />
                المقالات المميزة
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {posts
                  .filter(post => post.isFeatured)
                  .slice(0, 2)
                  .map(post => (
                    <Card key={post.id} className="overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-shadow duration-300">
                      <div className="md:w-2/5 relative">
                        <img 
                          src={post.imageUrl || "https://images.unsplash.com/photo-1517486808906-6ca8b3f8e1c1"}
                          alt={post.title}
                          className="h-48 md:h-full w-full object-cover"
                          loading="lazy"
                        />
                        <Badge variant="secondary" className="absolute top-3 right-3 rounded-full bg-primary text-white">
                          مميز
                        </Badge>
                      </div>
                      <CardContent className="p-6 md:w-3/5">
                        <div className="mb-2 flex items-center text-sm text-gray-500">
                          <Calendar className="ml-1 h-3 w-3" /> 
                          <span>{formatDate(post.createdAt)}</span>
                          <span className="mx-2">•</span>
                          <Eye className="ml-1 h-3 w-3" /> 
                          <span>{post.views || 0} مشاهدة</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          <Link href={`/articles/${post.slug}`}>
                            <a className="hover:text-primary transition-colors">{post.title}</a>
                          </Link>
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {post.excerpt || post.content.substring(0, 150) + '...'}
                        </p>
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center">
                            <UserCircle className="ml-1 h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-700">{getAuthorName(post.authorId)}</span>
                          </div>
                          <Link href={`/articles/${post.slug}`}>
                            <Button variant="outline" size="sm" className="text-primary hover:bg-primary/5">
                              قراءة المزيد
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          )}

          {/* كل المقالات */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">جميع المقالات</h2>
              {searchTerm && (
                <p className="text-gray-600">
                  نتائج البحث عن: <span className="font-medium">"{searchTerm}"</span>
                </p>
              )}
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-gray-200"></div>
                    <CardContent className="p-5">
                      <div className="h-4 w-20 bg-gray-200 mb-2 rounded"></div>
                      <div className="h-6 w-3/4 bg-gray-200 mb-2 rounded"></div>
                      <div className="h-20 bg-gray-200 mb-4 rounded"></div>
                      <div className="flex justify-between">
                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                        <div className="h-4 w-16 bg-gray-200 rounded"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredPosts && filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map(post => (
                  <Card key={post.id} className="overflow-hidden transition-all hover:shadow-md group">
                    <div className="relative">
                      <img 
                        src={post.imageUrl || "https://images.unsplash.com/photo-1517486808906-6ca8b3f8e1c1"}
                        alt={post.title}
                        className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <Link href={`/articles/${post.slug}`} className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white font-bold text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          اقرأ المقال
                        </span>
                      </Link>
                    </div>
                    <CardContent className="p-5">
                      <div className="mb-2 flex items-center">
                        <Badge variant="secondary" className="rounded-full">مقال</Badge>
                        <span className="mx-2 text-xs text-gray-500 flex items-center">
                          <Calendar className="ml-1 h-3 w-3" /> {formatDate(post.createdAt)}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center mr-auto">
                          <Eye className="ml-1 h-3 w-3" /> {post.views || 0}
                        </span>
                      </div>
                      <h3 className="mb-2 text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                        <Link href={`/articles/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h3>
                      <p className="mb-4 text-sm text-gray-600 line-clamp-3">
                        {post.excerpt || post.content.substring(0, 120) + '...'}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 flex items-center">
                          <UserCircle className="ml-1 h-4 w-4 text-gray-500" />
                          {getAuthorName(post.authorId)}
                        </span>
                        <Link href={`/articles/${post.slug}`}>
                          <Button variant="ghost" size="sm" className="text-primary hover:text-primary-700">
                            قراءة المزيد
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-2">لم يتم العثور على مقالات</h3>
                <p className="text-gray-600 mb-6">لم نتمكن من العثور على أي مقالات تطابق معايير البحث الخاصة بك.</p>
                {searchTerm && (
                  <Button onClick={() => setSearchTerm('')}>
                    مسح البحث
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* تصنيفات المقالات */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Bookmark className="ml-2 h-5 w-5 text-primary" />
              تصفح حسب التصنيف
            </h2>
            <div className="flex flex-wrap gap-3">
              <Link href="/articles?category=application-tips">
                <Button variant="outline" className="rounded-full hover:bg-primary/10">
                  <Tag className="ml-2 h-4 w-4" /> نصائح التقديم
                </Button>
              </Link>
              <Link href="/articles?category=essay-writing">
                <Button variant="outline" className="rounded-full hover:bg-primary/10">
                  <Tag className="ml-2 h-4 w-4" /> كتابة المقالات
                </Button>
              </Link>
              <Link href="/articles?category=interviews">
                <Button variant="outline" className="rounded-full hover:bg-primary/10">
                  <Tag className="ml-2 h-4 w-4" /> المقابلات
                </Button>
              </Link>
              <Link href="/articles?category=financial-aid">
                <Button variant="outline" className="rounded-full hover:bg-primary/10">
                  <Tag className="ml-2 h-4 w-4" /> المساعدات المالية
                </Button>
              </Link>
              <Link href="/articles?category=studying-abroad">
                <Button variant="outline" className="rounded-full hover:bg-primary/10">
                  <Tag className="ml-2 h-4 w-4" /> الدراسة في الخارج
                </Button>
              </Link>
              <Link href="/articles?category=research">
                <Button variant="outline" className="rounded-full hover:bg-primary/10">
                  <Tag className="ml-2 h-4 w-4" /> البحث العلمي
                </Button>
              </Link>
            </div>
          </div>

          {/* قسم النصائح السريعة */}
          <div className="mb-12 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">نصائح سريعة للحصول على المنح الدراسية</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 border border-gray-100 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors">
                <h3 className="font-medium text-lg mb-2">ابدأ مبكراً</h3>
                <p className="text-gray-600 text-sm">ابدأ بالبحث عن المنح قبل الموعد النهائي بأشهر للحصول على وقت كافٍ لإعداد طلب قوي.</p>
              </div>
              <div className="p-4 border border-gray-100 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors">
                <h3 className="font-medium text-lg mb-2">كن منظمًا</h3>
                <p className="text-gray-600 text-sm">احتفظ بسجل للمواعيد النهائية والمستندات المطلوبة لكل منحة دراسية تتقدم لها.</p>
              </div>
              <div className="p-4 border border-gray-100 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors">
                <h3 className="font-medium text-lg mb-2">شخصن مقالك</h3>
                <p className="text-gray-600 text-sm">اكتب مقالًا فريدًا يعكس تجاربك الشخصية وأهدافك بدلاً من استخدام قوالب عامة.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Articles;
