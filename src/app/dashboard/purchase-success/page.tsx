'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

function PurchaseSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <div className="max-w-2xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="mt-4 text-3xl font-bold text-gray-900">Purchase Successful!</h1>
        <p className="mt-2 text-lg text-gray-600">
          Thank you for your purchase. Your subscription has been activated.
        </p>
        <div className="mt-8">
          <Link href="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PurchaseSuccessPage() {
  return (
    <Suspense fallback={
      <div className="max-w-2xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto"></div>
            <div className="mt-4 h-8 w-64 bg-gray-200 rounded mx-auto"></div>
            <div className="mt-2 h-6 w-96 bg-gray-200 rounded mx-auto"></div>
          </div>
        </div>
      </div>
    }>
      <PurchaseSuccessContent />
    </Suspense>
  );
}
