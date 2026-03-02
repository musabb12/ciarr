'use client';

import { ContactsManagement } from '@/components/admin/ContactsManagement';

export default function AdminMessagesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">الرسائل</h1>
        <p className="text-slate-400 mt-0.5">رسائل نموذج التواصل والرد عليها</p>
      </div>
      <ContactsManagement />
    </div>
  );
}
