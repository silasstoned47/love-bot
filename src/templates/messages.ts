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
            title: "✨ Oi, sou sua nova admiradora... ✨",
            image_url: "https://i.imgur.com/dBp4cI3.jpeg",
            subtitle: "Você me despertou curiosidade... Quer ver o que tenho guardado pra você?",
            buttons: [
              {
                type: "web_url",
                url: trackUrl('https://extraduda.com/app-namoro/', 'tinder', senderId, 'first'),
                title: "😍 Espiar Agora"
              },
              {
                type: "web_url",
                url: trackUrl('https://extraduda.com/app-namoro/', 'bumble', senderId, 'first'),
                title: "💌 Meu Segredinho"
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
            title: "🔥 Já estou pensando em você... 🔥",
            image_url: "https://i.imgur.com/kTctRie.jpeg",
            subtitle: "Senti saudade... Que tal descobrir meu lado mais ousado?",
            buttons: [
              {
                type: "web_url",
                url: trackUrl('https://extraduda.com/app-namoro/', 'happn', senderId, 'second'),
                title: "👀 Espiar"
              },
              {
                type: "web_url",
                url: trackUrl('https://extraduda.com/app-namoro/', 'parperfeito', senderId, 'second'),
                title: "💋 Me Mostra"
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
            title: "😈 Tô cada vez mais quente... 😈",
            image_url: "https://revistatrip.uol.com.br/upload/2016/11/581a21e21b028/1240x822x1200x630x20x176/sabrina-gevaerd-palido2.png",
            subtitle: "Não divido isso com qualquer um... Pronto pra ver?",
            buttons: [
              {
                type: "web_url",
                url: trackUrl('https://extraduda.com/app-namoro/', 'innercircle', senderId, 'third'),
                title: "💎 Ver Agora 💎"
              },
              {
                type: "web_url",
                url: trackUrl('https://extraduda.com/app-namoro/', 'security', senderId, 'third'),
                title: "🔓 Me Desvendar"
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
            title: "😍 Só você pode ter esse privilégio... 😍",
            image_url: "https://images.unsplash.com/photo-1516195851888-6f1a981a862e?w=600&blur=50",
            subtitle: "Vem que quero te mostrar tudo!",
            buttons: [
              {
                type: "web_url",
                url: trackUrl('https://extraduda.com/app-namoro/', 'badoo', senderId, 'fourth'),
                title: "💘 Acessar Agora 💘"
              },
              {
                type: "web_url",
                url: trackUrl('https://match.com', 'match', senderId, 'fourth'),
                title: "💫 Segredo Especial 💫"
              }
            ]
          }
        ]
      }
    }
  })
};
