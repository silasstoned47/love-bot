import { env } from '../config/env';

interface MessageTemplate {
  (senderId: string): {
    attachment: {
      type: string;
      payload: {
        template_type: string;
        elements: Array<{
          title: string;
          image_url: string;
          subtitle: string;
          buttons: Array<{
            type: string;
            url: string;
            title: string;
          }>;
        }>;
      };
    };
  };
}

// Função para gerar URL de redirecionamento com rastreamento
function trackUrl(target: string, button: string, senderId: string, messageId: string) {
  return `${env.BASE_URL}/redirect?target=${encodeURIComponent(target)}&button=${button}&sender=${senderId}&msg=${messageId}`;
}

export const messageTemplates: Record<string, MessageTemplate> = {
  first: (senderId) => ({
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title: "🔥 VAZOU: TOP 10 PERFIS MAIS QUENTES DA SUA REGIÃO! 🔥",
            image_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600",
            subtitle: "🚨 ATENÇÃO: Descobrimos pessoas INCRÍVEIS a menos de 5KM de você! Perfis EXCLUSIVOS liberados por tempo LIMITADO! 💘",
            buttons: [
              {
                type: "web_url",
                url: trackUrl('https://extraduda.com/app-namoro/', 'tinder', senderId, 'first'),
                title: "🎯 VER FOTOS AGORA 🎯"
              },
              {
                type: "web_url",
                url: trackUrl('https://extraduda.com/app-namoro/', 'bumble', senderId, 'first'),
                title: "💋 MATCH SECRETO 💋"
              }
            ]
          }
        ]
      }
    }
  }),

  second: (senderId) => ({
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title: "💘 ALERTA: Seu PAR IDEAL acabou de entrar! 💘",
            image_url: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600",
            subtitle: "🎯 ALGORITMO DETECTOU match com 99.9% de compatibilidade! CORRA antes que outra pessoa encontre primeiro! ⚡",
            buttons: [
              {
                type: "web_url",
                url: trackUrl('https://extraduda.com/app-namoro/', 'happn', senderId, 'second'),
                title: "💫 MATCH IMEDIATO 💫"
              },
              {
                type: "web_url",
                url: trackUrl('https://extraduda.com/app-namoro/', 'parperfeito', senderId, 'second'),
                title: "💑 AMOR HOJE 💑"
              }
            ]
          }
        ]
      }
    }
  }),

  third: (senderId) => ({
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title: "⚡ ULTRA SECRETO: Fórmula da Conquista REVELADA! ⚡",
            image_url: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=600",
            subtitle: "🔐 Método PROIBIDO usado por MILHARES para encontrar o AMOR VERDADEIRO em 24 HORAS! Vagas LIMITADAS! 🚀",
            buttons: [
              {
                type: "web_url",
                url: trackUrl('https://extraduda.com/app-namoro/', 'innercircle', senderId, 'third'),
                title: "🎁 LIBERAR AGORA 🎁"
              },
              {
                type: "web_url",
                url: trackUrl('https://extraduda.com/app-namoro/', 'security', senderId, 'third'),
                title: "🔥 ÁREA VIP 🔥"
              }
            ]
          }
        ]
      }
    }
  }),

  fourth: (senderId) => ({
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title: "⚠️ ÚLTIMA CHANCE: Alma Gêmea em PERIGO! ⚠️",
            image_url: "https://images.unsplash.com/photo-1516195851888-6f1a981a862e?w=600",
            subtitle: "🚨 URGENTE: Seu par ideal está ONLINE agora! 99.9% de chance de MATCH INSTANTÂNEO! Oferta expira em 60 MINUTOS! ⏰",
            buttons: [
              {
                type: "web_url",
                url: trackUrl('https://extraduda.com/app-namoro/', 'badoo', senderId, 'fourth'),
                title: "💘 MATCH EXPRESS 💘"
              },
              {
                type: "web_url",
                url: trackUrl('https://match.com', 'match', senderId, 'fourth'),
                title: "✨ DESTINO FINAL ✨"
              }
            ]
          }
        ]
      }
    }
  })
};