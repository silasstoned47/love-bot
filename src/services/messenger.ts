import axios from 'axios';
import { env } from '../config/env';
import { logger } from '../config/logger';
import { messageTemplates } from '../templates/messages';

const FACEBOOK_API = 'https://graph.facebook.com/v22.0';

export async function sendMessage(senderId: string, messageType: string) {
  try {
    const template = messageTemplates[messageType];
    if (!template) {
      throw new Error(`Template não encontrado: ${messageType}`);
    }

    const message = template(senderId);
    logger.info('📤 Enviando mensagem:', { 
      senderId, 
      messageType,
      url: `${FACEBOOK_API}/me/messages`,
      token: env.FACEBOOK_ACCESS_TOKEN?.substring(0, 10) + '...',
      message 
    });

    // Envia mensagem para o Facebook
    const response = await axios.post(
      `${FACEBOOK_API}/me/messages`,
      {
        recipient: { id: senderId },
        message
      },
      {
        params: { access_token: env.FACEBOOK_ACCESS_TOKEN }
      }
    );

    if (!response.data || !response.data.message_id) {
      throw new Error('Resposta inválida do Facebook: ' + JSON.stringify(response.data));
    }

    logger.info('✅ Mensagem enviada com sucesso:', {
      messageId: response.data.message_id,
      senderId,
      messageType
    });
  } catch (error: any) {
    logger.error('❌ Erro ao enviar mensagem:', {
      error: error.message,
      response: error.response?.data,
      senderId,
      messageType
    });
    throw error;
  }
}