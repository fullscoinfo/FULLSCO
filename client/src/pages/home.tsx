import { useEffect } from 'react';
import Hero from '@/components/hero';
import FeaturedScholarships from '@/components/featured-scholarships';
import ScholarshipCategories from '@/components/scholarship-categories';
import LatestArticles from '@/components/latest-articles';
import SuccessStories from '@/components/success-stories';
import Newsletter from '@/components/newsletter';
import AdminPreview from '@/components/admin-preview';

const Home = () => {
  // تعيين بيانات الصفحة التعريفية
  useEffect(() => {
    document.title = "FULLSCO - اعثر على فرصة المنحة الدراسية المثالية";
    
    // يمكنك إضافة المزيد من البيانات الوصفية هنا عند تنفيذ تحسين محركات البحث SEO
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'اكتشف آلاف المنح الدراسية حول العالم واحصل على إرشادات حول كيفية التقديم بنجاح.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'اكتشف آلاف المنح الدراسية حول العالم واحصل على إرشادات حول كيفية التقديم بنجاح.';
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <main>
      <Hero />
      <FeaturedScholarships />
      <ScholarshipCategories />
      <LatestArticles />
      <SuccessStories />
      <Newsletter />
      <AdminPreview />
    </main>
  );
};

export default Home;
