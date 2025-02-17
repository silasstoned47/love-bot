import React from 'react';
import { Users, MessageCircle, MousePointerClick, Target } from 'lucide-react';

interface Metrics {
  totalLeads: number;
  messagesSent: number;
  linkClicks: number;
  conversionRate: string;
}

interface MetricsCardsProps {
  metrics?: Metrics;
}

export function MetricsCards({ metrics }: MetricsCardsProps) {
  const cards = [
    {
      title: 'Total de Leads',
      value: metrics?.totalLeads || 0,
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Mensagens Enviadas',
      value: metrics?.messagesSent || 0,
      icon: MessageCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Cliques em Links',
      value: metrics?.linkClicks || 0,
      icon: MousePointerClick,
      color: 'text-purple-500',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Taxa de Conversão',
      value: metrics?.conversionRate || '0%',
      icon: Target,
      color: 'text-pink-500',
      bgColor: 'bg-pink-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(card => (
        <div key={card.title} className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-4">
            <div className={`${card.bgColor} p-3 rounded-full`}>
              <card.icon className={`h-6 w-6 ${card.color}`} />
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}