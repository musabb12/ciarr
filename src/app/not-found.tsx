import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Globe, FileText, Mail } from 'lucide-react';

export default function NotFound() {
  return React.createElement(
    'div',
    {
      className: 'min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4',
      dir: 'rtl',
    },
    React.createElement(
      'div',
      { className: 'text-center max-w-md' },
      React.createElement('h1', {
        className: 'text-8xl md:text-9xl font-bold text-amber-500 mb-2 drop-shadow-sm',
        children: '404',
      }),
      React.createElement('h2', {
        className: 'text-2xl md:text-3xl font-semibold text-gray-900 mb-4',
        children: 'الصفحة غير موجودة',
      }),
      React.createElement('p', {
        className: 'text-gray-600 mb-10 leading-relaxed',
        children:
          'لم نتمكن من العثور على الصفحة التي تبحث عنها. تأكد من الرابط أو ارجع إلى الصفحة الرئيسية.',
      }),
      React.createElement(
        'div',
        { className: 'flex flex-col sm:flex-row gap-4 justify-center' },
        React.createElement(
          Link,
          { href: '/' },
          React.createElement(
            Button,
            { className: 'w-full sm:w-auto bg-amber-500 text-gray-900 hover:bg-amber-400 font-medium rounded-xl shadow-md' },
            React.createElement(Home, { className: 'w-4 h-4 ml-2' }),
            ' الرئيسية'
          )
        ),
        React.createElement(
          Link,
          { href: '/websites' },
          React.createElement(
            Button,
            { variant: 'outline', className: 'w-full sm:w-auto rounded-xl border-2 border-amber-200 hover:bg-amber-50' },
            React.createElement(Globe, { className: 'w-4 h-4 ml-2' }),
            ' مواقعنا'
          )
        ),
        React.createElement(
          Link,
          { href: '/services' },
          React.createElement(
            Button,
            { variant: 'outline', className: 'w-full sm:w-auto rounded-xl border-2 border-gray-200 hover:bg-gray-50' },
            React.createElement(FileText, { className: 'w-4 h-4 ml-2' }),
            ' الخدمات'
          )
        ),
        React.createElement(
          Link,
          { href: '/contact' },
          React.createElement(
            Button,
            { variant: 'outline', className: 'w-full sm:w-auto rounded-xl border-2 border-gray-200 hover:bg-gray-50' },
            React.createElement(Mail, { className: 'w-4 h-4 ml-2' }),
            ' اتصل بنا'
          )
        )
      )
    )
  );
}
