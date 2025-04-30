import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Search, GraduationCap, BookOpen, Building, DollarSign, Globe, Award, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [, navigate] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/scholarships?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary to-primary/90 py-16 md:py-28">
      {/* ديكورات خلفية */}
      <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-accent/10 blur-3xl"></div>
      <div className="absolute top-1/2 -right-24 h-48 w-48 rounded-full bg-primary-foreground/10 blur-3xl"></div>
      <div className="absolute -bottom-12 left-1/3 h-32 w-32 rounded-full bg-accent/20 blur-2xl"></div>
      
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="animate-fade-in mb-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
            اكتشف <span className="text-accent">المنح الدراسية</span> المثالية لمستقبلك
          </h1>
          <p className="animate-slide-up mb-8 text-lg leading-relaxed text-primary-foreground/80 md:text-xl">
            آلاف المنح الدراسية حول العالم في مكان واحد، مع إرشادات للتقديم الناجح وتحقيق أهدافك الأكاديمية
          </p>
          
          <div className="mx-auto max-w-2xl">
            <form onSubmit={handleSearch} className="animate-slide-up mb-6 flex flex-wrap gap-2 md:flex-nowrap">
              <div className="relative w-full flex-grow">
                <Input
                  type="text"
                  placeholder="ابحث عن المنح حسب الكلمات المفتاحية، الدولة، أو المجال..."
                  className="h-14 w-full rounded-lg bg-white/95 px-5 py-4 text-foreground shadow-md backdrop-blur-sm focus-visible:ring-accent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute inset-y-0 right-4 flex items-center">
                  <Search className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              <Button 
                type="submit" 
                className="button-hover h-14 rounded-lg bg-accent px-8 text-base font-semibold text-white hover:bg-accent/90"
              >
                ابحث الآن
              </Button>
            </form>

            <div className="animate-slide-up flex flex-wrap justify-center gap-3 md:gap-4">
              <Button 
                variant="ghost" 
                className="flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-4 py-1 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20"
                onClick={() => navigate('/scholarships?level=phd')}
              >
                <GraduationCap className="h-4 w-4" /> الدكتوراه
              </Button>
              <Button 
                variant="ghost"
                className="flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-4 py-1 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20"
                onClick={() => navigate('/scholarships?level=masters')}
              >
                <BookOpen className="h-4 w-4" /> الماجستير
              </Button>
              <Button 
                variant="ghost"
                className="flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-4 py-1 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20"
                onClick={() => navigate('/scholarships?level=bachelor')}
              >
                <Building className="h-4 w-4" /> البكالوريوس
              </Button>
              <Button 
                variant="ghost"
                className="flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-4 py-1 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20"
                onClick={() => navigate('/scholarships?funding=full')}
              >
                <DollarSign className="h-4 w-4" /> تمويل كامل
              </Button>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4 text-center md:grid-cols-4">
              <div className="animate-fade-in rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                <Award className="mx-auto mb-2 h-8 w-8 text-accent" />
                <p className="text-lg font-medium text-white">+1000</p>
                <p className="text-sm text-white/70">منحة متاحة</p>
              </div>
              <div className="animate-fade-in rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                <Globe className="mx-auto mb-2 h-8 w-8 text-accent" />
                <p className="text-lg font-medium text-white">+50</p>
                <p className="text-sm text-white/70">دولة حول العالم</p>
              </div>
              <div className="animate-fade-in rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                <Sparkles className="mx-auto mb-2 h-8 w-8 text-accent" />
                <p className="text-lg font-medium text-white">+200</p>
                <p className="text-sm text-white/70">قصة نجاح</p>
              </div>
              <div className="animate-fade-in rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                <BookOpen className="mx-auto mb-2 h-8 w-8 text-accent" />
                <p className="text-lg font-medium text-white">+100</p>
                <p className="text-sm text-white/70">مقال إرشادي</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
