import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <div>
            <Link href="/" className="flex items-center mb-4">
              <span className="text-2xl font-bold">
                FULL<span className="text-accent">SCO</span>
              </span>
            </Link>
            <p className="text-gray-400 mb-4">
              دليلك الشامل لفرص المنح الدراسية في جميع أنحاء العالم. نساعد الطلاب في العثور على المنح الدراسية والتقديم عليها لتحقيق أحلامهم الأكاديمية.
            </p>
            <div className="flex space-x-4 rtl:space-x-reverse">
              <a href="#" className="text-gray-400 hover:text-primary">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <span className="text-gray-400 hover:text-white">الرئيسية</span>
                </Link>
              </li>
              <li>
                <Link href="/scholarships">
                  <span className="text-gray-400 hover:text-white">المنح الدراسية</span>
                </Link>
              </li>
              <li>
                <Link href="/articles">
                  <span className="text-gray-400 hover:text-white">المدونة</span>
                </Link>
              </li>
              <li>
                <Link href="/success-stories">
                  <span className="text-gray-400 hover:text-white">قصص النجاح</span>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <span className="text-gray-400 hover:text-white">من نحن</span>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <span className="text-gray-400 hover:text-white">اتصل بنا</span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">المنح الدراسية</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/scholarships?level=bachelor">
                  <span className="text-gray-400 hover:text-white">البكالوريوس</span>
                </Link>
              </li>
              <li>
                <Link href="/scholarships?level=masters">
                  <span className="text-gray-400 hover:text-white">الماجستير</span>
                </Link>
              </li>
              <li>
                <Link href="/scholarships?level=phd">
                  <span className="text-gray-400 hover:text-white">الدكتوراه</span>
                </Link>
              </li>
              <li>
                <Link href="/scholarships?funded=true">
                  <span className="text-gray-400 hover:text-white">تمويل كامل</span>
                </Link>
              </li>
              <li>
                <Link href="/scholarships">
                  <span className="text-gray-400 hover:text-white">حسب الدولة</span>
                </Link>
              </li>
              <li>
                <Link href="/scholarships?field=all">
                  <span className="text-gray-400 hover:text-white">حسب مجال الدراسة</span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">اتصل بنا</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <Mail className="ml-2 mt-1 h-4 w-4 text-primary" />
                <span className="text-gray-400">info@fullsco.com</span>
              </li>
              <li className="flex items-start">
                <Phone className="ml-2 mt-1 h-4 w-4 text-primary" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start">
                <MapPin className="ml-2 mt-1 h-4 w-4 text-primary" />
                <span className="text-gray-400">123 طريق التعليم، المدينة الأكاديمية</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row md:justify-between items-center">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} FULLSCO. جميع الحقوق محفوظة.
            </p>
            <div className="flex space-x-4 rtl:space-x-reverse mt-4 md:mt-0">
              <Link href="/privacy">
                <span className="text-sm text-gray-400 hover:text-white">سياسة الخصوصية</span>
              </Link>
              <Link href="/terms">
                <span className="text-sm text-gray-400 hover:text-white">شروط الخدمة</span>
              </Link>
              <Link href="/cookies">
                <span className="text-sm text-gray-400 hover:text-white">سياسة ملفات تعريف الارتباط</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
