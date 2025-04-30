import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Mail, Check, AlertCircle } from 'lucide-react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const subscribe = useMutation({
    mutationFn: async (email: string) => {
      const res = await apiRequest('POST', '/api/subscribers', { email });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "تم الاشتراك بنجاح!",
        description: "أنت الآن مشترك في نشرتنا البريدية.",
        variant: "default",
      });
      setEmail('');
      // تحديث قائمة المشتركين في لوحة الإدارة
      queryClient.invalidateQueries({ queryKey: ['/api/subscribers'] });
    },
    onError: (error: any) => {
      toast({
        title: "فشل الاشتراك",
        description: error.message || "ربما تكون مشتركاً بالفعل بهذا البريد الإلكتروني.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    subscribe.mutate(email);
  };

  return (
    <section className="bg-primary py-16 relative overflow-hidden">
      {/* زخارف خلفية */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white/20"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-white/10"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <Mail className="h-12 w-12 mx-auto mb-4 text-white opacity-80" />
          <h2 className="text-2xl font-bold text-white sm:text-3xl mb-4">
            ابق على اطلاع بأحدث فرص المنح الدراسية
          </h2>
          <p className="mb-8 text-primary-100 max-w-lg mx-auto">
            اشترك في نشرتنا البريدية ولا تفوت أي موعد نهائي للتقديم على المنح. احصل على نصائح الخبراء والتوجيه مباشرة إلى بريدك الإلكتروني.
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20 max-w-lg mx-auto">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative">
                <Input
                  type="email"
                  placeholder="أدخل بريدك الإلكتروني"
                  className="w-full rounded-md border-0 px-4 py-3 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 pr-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  dir="ltr"
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              <Button 
                type="submit" 
                variant="accent"
                className="rounded-md px-6 py-3 font-medium text-white sm:whitespace-nowrap transition-all"
                disabled={subscribe.isPending}
              >
                {subscribe.isPending ? (
                  <span className="flex items-center">
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full ml-2"></span>
                    جاري الاشتراك...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Check className="ml-2 h-4 w-4" />
                    اشترك الآن
                  </span>
                )}
              </Button>
            </form>
            
            {/* حالات العرض */}
            {subscribe.isSuccess && (
              <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md flex items-center text-right">
                <Check className="h-5 w-5 ml-2 text-green-600" />
                <span>تم الاشتراك بنجاح! تابع بريدك الإلكتروني للحصول على أحدث المنح والفرص.</span>
              </div>
            )}
            
            {subscribe.isError && (
              <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-md flex items-center text-right">
                <AlertCircle className="h-5 w-5 ml-2 text-red-600" />
                <span>حدث خطأ أثناء الاشتراك. قد تكون مشتركاً بالفعل أو يرجى التحقق من صحة البريد الإلكتروني.</span>
              </div>
            )}
            
            <p className="mt-4 text-xs text-white/70 text-right">
              بالاشتراك، فإنك توافق على سياسة الخصوصية الخاصة بنا وتوافق على تلقي تحديثات عن المنح الدراسية.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
