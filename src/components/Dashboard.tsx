import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MessageList } from './MessageList';
import { MetricsCards } from './MetricsCards';
import { api } from '../lib/api';

export function Dashboard() {
  const { data: messages } = useQuery({
    queryKey: ['messages'],
    queryFn: async () => {
      const response = await api.get('/messages/all');
      return response.data.messages;
    }
  });

  const { data: metrics } = useQuery({
    queryKey: ['metrics'],
    queryFn: async () => {
      const response = await api.get('/messages/metrics/summary');
      return response.data;
    }
  });

  const chartData = messages?.map(msg => ({
    data: format(new Date(msg.created_at), 'dd/MM', { locale: ptBR }),
    mensagens: msg.count
  })) || [];

  return (
    <div className="space-y-6">
      <MetricsCards metrics={metrics} />
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Mensagens por Dia</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="data" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="mensagens" fill="#EC4899" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <MessageList messages={messages} />
    </div>
  );
}