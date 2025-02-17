import React from 'react';
import { Heart } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-2">
          <Heart className="h-8 w-8 text-pink-500" />
          <h1 className="text-2xl font-bold text-gray-900">IA-LEAD Dashboard</h1>
        </div>
        <p className="mt-1 text-gray-600">Sistema de Automação de Mensagens - Gaby</p>
      </div>
    </header>
  );
}