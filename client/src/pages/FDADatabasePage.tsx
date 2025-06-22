import React from 'react';
import { ComprehensiveFDASearch } from '@/components/calculators/ComprehensiveFDASearch';

export default function FDADatabasePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="max-w-6xl mx-auto">
        <ComprehensiveFDASearch />
      </div>
    </div>
  );
}