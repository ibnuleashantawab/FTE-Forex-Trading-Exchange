'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-12 h-12 border-4 border-gold-500/30 border-t-gold-500 rounded-full animate-spin mb-4" />
      <p className="text-gold-300 font-semibold tracking-wide">Loading FTE Forex Trading Exchange...</p>
    </div>
  );
}
