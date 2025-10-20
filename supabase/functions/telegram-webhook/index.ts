import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TelegramUpdate {
  message?: {
    chat: {
      id: number;
      first_name?: string;
      username?: string;
    };
    from: {
      id: number;
      first_name?: string;
      username?: string;
    };
    text?: string;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const update: TelegramUpdate = await req.json();
    console.log('Received Telegram update:', update);

    if (!update.message?.text) {
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const telegramUserId = update.message.from.id;
    const chatId = update.message.chat.id;
    const messageText = update.message.text;
    const username = update.message.from.username || update.message.from.first_name || 'User';

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if user is linked
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('telegram_id', telegramUserId.toString())
      .maybeSingle();

    if (profileError) {
      console.error('Error checking profile:', profileError);
    }

    // If user not linked, send login link
    if (!profile) {
      const loginUrl = `${Deno.env.get('VITE_SUPABASE_URL')?.replace('supabase.co', 'lovableproject.com')}/auth?telegram_id=${telegramUserId}&username=${encodeURIComponent(username)}`;
      
      await sendTelegramMessage(
        chatId,
        `👋 Welcome! To use this bot, please link your account:\n\n${loginUrl}\n\nClick the link above to login or create an account.`
      );

      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Handle /start command
    if (messageText === '/start') {
      await sendTelegramMessage(
        chatId,
        `Hello ${username}! 👋\n\nI'm your AI assistant powered by Gemini. Ask me anything!`
      );

      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Process message with Gemini
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: messageText
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
          }
        }),
      }
    );

    const geminiData = await geminiResponse.json();
    console.log('Gemini response:', geminiData);

    const aiReply = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || 
                    'Sorry, I could not generate a response.';

    // Send AI response to user
    await sendTelegramMessage(chatId, aiReply);

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error processing Telegram webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function sendTelegramMessage(chatId: number, text: string) {
  const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
  if (!botToken) {
    throw new Error('TELEGRAM_BOT_TOKEN not configured');
  }

  const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: 'Markdown',
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error('Telegram API error:', errorData);
    throw new Error(`Failed to send Telegram message: ${errorData}`);
  }

  return response.json();
}
