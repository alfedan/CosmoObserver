import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { SMTPClient } from "npm:emailjs@4.0.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { to, from, subject, message } = await req.json();

    const client = new SMTPClient({
      host: 'smtp.free.fr',
      port: 587,
      ssl: false,
      user: 'alfedan',
      password: Deno.env.get('SMTP_PASSWORD') || '',
    });

    await client.send({
      from: from,
      to: to,
      subject: subject,
      text: message,
    });

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      }
    );
  } catch (error) {
    console.error('Erreur d\'envoi:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
  }
});