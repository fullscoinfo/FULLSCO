import { useEffect } from 'react';
import Hero from '@/components/hero';
import FeaturedScholarships from '@/components/featured-scholarships';
import ScholarshipCategories from '@/components/scholarship-categories';
import LatestArticles from '@/components/latest-articles';
import SuccessStories from '@/components/success-stories';
import Newsletter from '@/components/newsletter';
import AdminPreview from '@/components/admin-preview';

const Home = () => {
  // Set page metadata
  useEffect(() => {
    document.title = "FULLSCO - Find Your Perfect Scholarship Opportunity";
    
    // You can add more metadata here when implementing SEO
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Discover thousands of scholarships worldwide and get guidance on how to apply successfully.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Discover thousands of scholarships worldwide and get guidance on how to apply successfully.';
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
