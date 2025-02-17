import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MessageSquare, User } from 'lucide-react';

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

interface MessageListProps {
  messages?: Message[];
}

export function MessageList({ messages = [] }: MessageListProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Últimas Mensagens</h2>
      </div>
      
      <div className="divide-y divide-gray-200">
        {messages.map(message => (
          <div key={message.id} className="p-6">
            <div className="flex items-start gap-4">
              <div className="bg-pink-100 p-2 rounded-full">
                <User className="h-5 w-5 text-pink-500" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-900">
                    ID: {message.sender_id}
                  </p>
                  <span className="text-sm text-gray-500">
                    {format(new Date(message.created_at), "dd 'de' MMMM 'às' HH:mm", {
                      locale: ptBR,
                    })}
                  </span>
                </div>
                
                <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                  <MessageSquare className="h-4 w-4" />
                  <p>{message.content}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}