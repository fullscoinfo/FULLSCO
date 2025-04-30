import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { ArrowRight, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Scholarship, Level, Country } from '@shared/schema';

const FeaturedScholarships = () => {
  const { data: scholarships, isLoading, error } = useQuery<Scholarship[]>({
    queryKey: ['/api/scholarships/featured'],
  });

  const { data: levels } = useQuery<Level[]>({
    queryKey: ['/api/levels'],
  });

  const { data: countries } = useQuery<Country[]>({
    queryKey: ['/api/countries'],
  });

  const getCountryName = (countryId?: number) => {
    if (!countryId || !countries) return '';
    const country = countries.find(c => c.id === countryId);
    return country?.name || '';
  };

  const getLevelName = (levelId?: number) => {
    if (!levelId || !levels) return '';
    const level = levels.find(l => l.id === levelId);
    return level?.name || '';
  };

  if (isLoading) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Featured Scholarships</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <CardContent className="p-5">
                  <div className="h-4 w-20 bg-gray-200 mb-2 rounded"></div>
                  <div className="h-6 w-3/4 bg-gray-200 mb-2 rounded"></div>
                  <div className="h-20 bg-gray-200 mb-4 rounded"></div>
                  <div className="flex justify-between">
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !scholarships) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl mb-4">Featured Scholarships</h2>
            <p className="text-red-500">Failed to load scholarships. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Featured Scholarships</h2>
          <Link href="/scholarships">
            <a className="text-primary hover:text-primary-700 font-medium flex items-center">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </a>
          </Link>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {scholarships.map((scholarship) => (
            <Card key={scholarship.id} className="group overflow-hidden">
              <div className="relative">
                <img 
                  src={scholarship.imageUrl || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3"}
                  alt={scholarship.title}
                  className="h-48 w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <span className="absolute bottom-3 left-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                  Deadline: {scholarship.deadline || 'Ongoing'}
                </span>
                {scholarship.isFullyFunded && (
                  <span className="absolute right-3 top-3 rounded-full bg-secondary-500 px-3 py-1 text-xs font-semibold text-white">
                    Full Funding
                  </span>
                )}
              </div>
              <CardContent className="p-5">
                <div className="mb-2 flex items-center">
                  <Badge variant="country">{getCountryName(scholarship.countryId)}</Badge>
                  <span className="mx-2 h-1 w-1 rounded-full bg-gray-300"></span>
                  <Badge variant="secondary">{getLevelName(scholarship.levelId)}</Badge>
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900 group-hover:text-primary">
                  <Link href={`/scholarships/${scholarship.slug}`}>
                    <a>{scholarship.title}</a>
                  </Link>
                </h3>
                <p className="mb-4 text-sm text-gray-600 line-clamp-2">
                  {scholarship.description}
                </p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    <DollarSign className="mr-1 h-4 w-4 inline text-secondary-500" /> {scholarship.amount || 'Varies'}
                  </span>
                  <Link href={`/scholarships/${scholarship.slug}`}>
                    <a className="flex items-center text-sm font-medium text-primary hover:text-primary-700">
                      Learn more <ArrowRight className="ml-1 h-4 w-4" />
                    </a>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedScholarships;
