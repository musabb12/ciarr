'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Award, Clock, Target, Code, Heart } from 'lucide-react'

export default function AboutPage() {
  const stats = [
    { icon: <Users className="w-8 h-8" />, number: '14', label: 'موقع إلكتروني' },
    { icon: <Award className="w-8 h-8" />, number: '14+', label: 'قطاع نخدمه' },
    { icon: <Clock className="w-8 h-8" />, number: '5+', label: 'سنوات خبرة' },
    { icon: <Target className="w-8 h-8" />, number: '98%', label: 'رضا العملاء' }
  ]

  const values = [
    {
      icon: <Code className="w-10 h-10 text-blue-600" />,
      title: 'الجودة في الخدمة',
      description: 'نسعى لتقديم تجربة سلسة وموثوقة على جميع مواقعنا الـ 14'
    },
    {
      icon: <Heart className="w-10 h-10 text-red-600" />,
      title: 'الشغف بالعمل',
      description: 'نحب ما نفعله ونسعى دائماً لتقديم أفضل النتائج للعملاء'
    },
    {
      icon: <Users className="w-10 h-10 text-green-600" />,
      title: 'تنوع القطاعات',
      description: 'عقاري، سياحي، موضة، تجارة إلكترونية، سيارات، توظيف، استثمار، وتسويق'
    },
    {
      icon: <Target className="w-10 h-10 text-purple-600" />,
      title: 'التركيز على العميل',
      description: 'نفهم احتياجات العملاء ونقدم الخدمة المناسبة من الموقع المناسب'
    }
  ]

  const team = [
    {
      name: 'أحمد محمد',
      position: 'مدير المنتجات الرقمية',
      expertise: ['العقارات', 'السياحة', 'التجارة الإلكترونية'],
      description: 'يشرف على تجربة العملاء في مواقعنا المتعددة'
    },
    {
      name: 'فاطمة علي',
      position: 'مديرة المحتوى والعلامة التجارية',
      expertise: ['الموضة', 'التسويق', 'تجربة المستخدم'],
      description: 'متخصصة في المحتوى والهوية البصرية لمواقعنا'
    },
    {
      name: 'محمد سعيد',
      position: 'مدير العمليات',
      expertise: ['السيارات', 'التوظيف', 'اللوجستيات'],
      description: 'يدير تشغيل منصاتنا وخدمة العملاء'
    },
    {
      name: 'نورا حسن',
      position: 'مديرة التسويق والشراكات',
      expertise: ['الاستثمار', 'التسويق', 'الشراكات'],
      description: 'تطور الشراكات ووصول مواقعنا للعملاء'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/80 to-white" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-14">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-arabic-heading tracking-tight">
            من نحن
          </h1>
          <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto font-arabic-modern leading-relaxed">
            شركة CIAR تدير 14 موقعاً إلكترونياً في قطاعات متعددة: عقاري، سياحي، موضة، تجارة إلكترونية، سيارات، توظيف، استثمار، تسويق، لوجستيات، وتوصيل — لخدمتك تحت سقف واحد
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-14">
          {stats.map((stat, index) => (
            <Card key={index} className="card-elevated text-center p-5 md:p-6">
              <CardContent className="pt-0">
                <div className="text-amber-500 mb-2 flex justify-center [&_svg]:shrink-0">
                  {stat.icon}
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 font-arabic-heading">
                  {stat.number}
                </div>
                <div className="text-gray-600 text-sm md:text-base font-arabic-modern">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Story */}
        <div className="card-elevated rounded-2xl p-6 md:p-8 mb-12 md:mb-14">
          <h2 className="section-heading text-center mb-6 font-arabic-heading">
            قصتنا
          </h2>
          <div className="max-w-4xl mx-auto text-gray-600 leading-relaxed font-arabic-modern">
            <p className="mb-4">
              بدأت رحلتنا كشركة خدمات رقمية تهدف إلى تقديم منصات متخصصة في قطاعات متعددة تحت مظلة واحدة.
              اليوم نمتلك 14 موقعاً إلكترونياً يغطي عقاري، سياحي، موضة، تجارة إلكترونية، سيارات، توظيف، استثمار، تسويق، لوجستيات، وتوصيل.
            </p>
            <p className="mb-4">
              نؤمن بأن العميل يستحق الوصول إلى الخدمة المناسبة من منصة موثوقة — سواء كان يبحث عن عقار، رحلة، منتج، وظيفة، أو استثمار.
            </p>
            <p>
              نفخر بأن مواقعنا الـ 14 تخدم آلاف العملاء يومياً، ونلتزم بتطوير تجربة كل موقع وخدمة العملاء على مدار الساعة.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-12 md:mb-14">
          <h2 className="section-heading mb-8 text-center font-arabic-heading">
            قيمنا
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="mb-4 flex justify-center">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            فريقنا
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {team.map((member, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center">
                  <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-600">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 mb-2">
                    {member.position}
                  </p>
                  <p className="text-gray-600 text-sm mb-4">
                    {member.description}
                  </p>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {member.expertise.map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-blue-600 rounded-lg p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">
            انضم إلى فريقنا
          </h2>
          <p className="text-xl mb-8">
            نبحث دائماً عن المواهب الشغوفة للانضمام إلى فريقنا
          </p>
          <a 
            href="mailto:careers@ciar.com" 
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            أرسل سيرتك الذاتية
          </a>
        </div>
      </div>
    </div>
  )
}