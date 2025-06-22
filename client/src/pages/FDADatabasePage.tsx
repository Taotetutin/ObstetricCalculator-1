import React from 'react';
import { FDADatabaseSearch } from '@/components/calculators/FDADatabaseSearch';

export default function FDADatabasePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <FDADatabaseSearch />
    </div>
  );
}