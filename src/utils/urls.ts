const isTest = false;
const isWhatsappTest = false;

const prodApiUrl = 'https://api.autotrafic.es';
const localApiUrl = 'http://localhost:3100';
export const BACKEND_API_URL = isTest ? localApiUrl : prodApiUrl;

const whatsProdApiUrl = 'https://apiwa.autotrafic.es';
const whatsLocalApiUrl = 'http://localhost:3200';
export const WHATSAPP_API_URL = isWhatsappTest ? whatsLocalApiUrl : whatsProdApiUrl;

export const WHATSAPP_HELP_LINK =
  'https://api.whatsapp.com/send?phone=34643219297&text=Hola%2C%20se%20ha%20producido%20un%20error%20cuando%20intentaba%20subir%20los%20documentos%20del%20veh%C3%ADculo%2C%20%C2%BFpodr%C3%ADas%20ayudarme%3F';
