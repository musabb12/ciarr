'use client';

import { CreditCard, Smartphone, Wallet, QrCode, Building2, Landmark, Shield, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/hooks/useLanguage';

const paymentMethods = [
  {
    name: 'فيزا',
    englishName: 'Visa',
    icon: (
      <div className="w-14 h-9 bg-white rounded-md border border-blue-600 flex items-center justify-center shadow-sm">
        <span className="text-xs font-bold tracking-widest" style={{ color: '#1A1F71' }}>
          VISA
        </span>
      </div>
    ),
    description: 'بطاقة ائتمان خصم مباشر',
    color: 'from-blue-50 to-blue-100',
    borderColor: 'border-blue-200'
  },
  {
    name: 'ماستر كارد',
    englishName: 'Mastercard',
    icon: (
      <div className="w-14 h-9 bg-white rounded-md border border-gray-200 flex items-center justify-center gap-[-6px] shadow-sm">
        <div className="relative flex items-center justify-center">
          <span
            className="inline-block rounded-full"
            style={{ width: '18px', height: '18px', backgroundColor: '#EB001B' }}
          />
          <span
            className="inline-block rounded-full -ml-2"
            style={{ width: '18px', height: '18px', backgroundColor: '#F79E1B' }}
          />
        </div>
      </div>
    ),
    description: 'بطاقة ائتمان عالمية',
    color: 'from-red-50 to-orange-50',
    borderColor: 'border-red-200'
  },
  {
    name: 'مدى',
    englishName: 'Mada',
    icon: (
      <div className="w-16 h-9 bg-white rounded-md border border-gray-200 flex items-center justify-center shadow-sm overflow-hidden">
        <div className="w-full h-full flex">
          <div className="w-1/3 bg-[#00AEEF]" />
          <div className="w-1/3 bg-[#00B14F]" />
          <div className="w-1/3 bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-700">
            مدى
          </div>
        </div>
      </div>
    ),
    description: 'نظام الدفع السعودي',
    color: 'from-blue-50 to-indigo-50',
    borderColor: 'border-blue-200'
  },
  {
    name: 'آبل باي',
    englishName: 'Apple Pay',
    icon: (
      <div className="w-16 h-9 bg-black rounded-md flex items-center justify-center shadow-sm">
        <span className="text-white font-semibold text-[11px]">
           Pay
        </span>
      </div>
    ),
    description: 'دفع عبر الأجهزة الذكية',
    color: 'from-gray-50 to-gray-100',
    borderColor: 'border-gray-300'
  },
  {
    name: 'ستك باي',
    englishName: 'STC Pay',
    icon: (
      <div className="w-16 h-9 rounded-md flex items-center justify-center shadow-sm" style={{ backgroundColor: '#4F0B8A' }}>
        <span className="text-white font-semibold text-[10px] tracking-wide">
          stc pay
        </span>
      </div>
    ),
    description: 'محفظة إلكترونية سعودية',
    color: 'from-purple-50 to-indigo-50',
    borderColor: 'border-purple-200'
  },
  {
    name: 'تحويل بنكي',
    englishName: 'Bank Transfer',
    icon: (
      <div className="w-16 h-9 bg-white rounded-md border border-emerald-500 flex items-center justify-center shadow-sm">
        <Building2 className="w-5 h-5 text-emerald-600" />
      </div>
    ),
    description: 'تحويل مباشر للحساب البنكي',
    color: 'from-green-50 to-emerald-50',
    borderColor: 'border-green-200'
  }
];

export function PaymentMethods() {
  const { dir } = useLanguage();

  return (
    <section className="section-padding bg-gradient-to-b from-gray-50 to-white" dir={dir}>
      <div className="container-narrow">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-5 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 gap-2">
            <CreditCard className="w-5 h-5 text-emerald-600" />
            <span className="text-xs font-semibold text-emerald-700 font-arabic-modern">
              طرق دفع موثوقة
            </span>
          </div>
          <h2 className="section-heading font-arabic-heading mb-4">
            طرق الدفع المتاحة
          </h2>
          <p className="section-subheading font-arabic-modern">
            نقدم مجموعة متنوعة من طرق الدفع العالمية والمحلية، مع تشفير كامل لكل عملية
          </p>
        </div>

        {/* Methods grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
          {paymentMethods.map((method, index) => (
            <Card
              key={index}
              className={`group card-elevated border-2 ${method.borderColor} bg-gradient-to-br ${method.color}`}
            >
              <CardContent className="p-5 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {method.icon}
                    <div className="text-right">
                      <h3 className="font-bold text-gray-900 font-arabic-heading text-sm md:text-base">
                        {method.name}
                      </h3>
                      <p className="text-[11px] text-gray-500 font-arabic-modern">
                        {method.englishName}
                      </p>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>

                <p className="text-gray-700 text-xs md:text-sm font-arabic-modern mb-4 leading-relaxed">
                  {method.description}
                </p>

                <div className="flex items-center justify-between text-[11px] md:text-xs">
                  <div className="flex items-center gap-1 text-emerald-700">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    <span className="font-arabic-modern">آمن وموثوق</span>
                  </div>
                  <div className="flex items-center gap-1 text-blue-700">
                    <Smartphone className="w-4 h-4 text-blue-600" />
                    <span className="font-arabic-modern">سريع وسهل الاستخدام</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Security note */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-white px-5 md:px-6 py-3 rounded-full shadow-md border border-gray-200">
            <Landmark className="w-5 h-5 text-emerald-600" />
            <span className="text-gray-700 font-arabic-modern text-xs md:text-sm">
              جميع المعاملات تتم عبر قنوات مشفرة (SSL) وبمعايير أمان بنكية
            </span>
            <Shield className="w-5 h-5 text-emerald-600" />
          </div>
        </div>
      </div>
    </section>
  );
}