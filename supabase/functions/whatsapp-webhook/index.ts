import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WhatsAppMessage {
  from: string;
  body: string;
  chatId: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const whapiToken = Deno.env.get('WHAPI_API_TOKEN')!;

    const supabase = createClient(supabaseUrl, supabaseKey);
    const payload = await req.json();
    
    console.log('Received webhook payload:', JSON.stringify(payload, null, 2));

    // Extract message from Whapi webhook format
    const messages = payload.messages || [];
    if (messages.length === 0) {
      return new Response(JSON.stringify({ success: true, message: 'No messages to process' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const message = messages[0];
    const from = message.from;
    const text = message.text?.body || '';
    const chatId = message.chatId || from;

    console.log(`Processing message from ${from}: ${text}`);

    // Find user by phone number (stored in profiles table)
    const { data: profile } = await supabase
      .from('profiles')
      .select('user_id, email')
      .eq('phone_number', from)
      .single();

    if (!profile) {
      await sendWhatsAppMessage(whapiToken, chatId, 
        '❌ Phone number not linked. Please link your WhatsApp in the web app settings first.');
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Process command
    const response = await processCommand(text.toLowerCase(), profile.user_id, supabase);
    
    // Send response via WhatsApp
    await sendWhatsAppMessage(whapiToken, chatId, response);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in whatsapp-webhook:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function processCommand(text: string, userId: string, supabase: any): Promise<string> {
  // Show reading list
  if (text.includes('reading list') || text.includes('reading')) {
    const { data: bookmarks, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', userId)
      .eq('reading', true)
      .order('created_at', { ascending: false });

    if (error) {
      return '❌ Error fetching reading list: ' + error.message;
    }

    if (!bookmarks || bookmarks.length === 0) {
      return '📚 Your reading list is empty.';
    }

    let response = '📚 *Your Reading List:*\n\n';
    bookmarks.forEach((bookmark: any, index: number) => {
      response += `${index + 1}. *${bookmark.title}*\n`;
      response += `   🔗 ${bookmark.url}\n`;
      if (bookmark.description) {
        response += `   📝 ${bookmark.description}\n`;
      }
      if (bookmark.tags && bookmark.tags.length > 0) {
        response += `   🏷️ ${bookmark.tags.join(', ')}\n`;
      }
      response += '\n';
    });

    return response;
  }

  // Show all bookmarks
  if (text.includes('show all') || text.includes('all bookmarks') || text.includes('list')) {
    const { data: bookmarks, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      return '❌ Error fetching bookmarks: ' + error.message;
    }

    if (!bookmarks || bookmarks.length === 0) {
      return '📑 You have no bookmarks yet.';
    }

    let response = '📑 *Your Latest Bookmarks:*\n\n';
    bookmarks.forEach((bookmark: any, index: number) => {
      response += `${index + 1}. *${bookmark.title}*\n`;
      response += `   🔗 ${bookmark.url}\n`;
      if (bookmark.tags && bookmark.tags.length > 0) {
        response += `   🏷️ ${bookmark.tags.join(', ')}\n`;
      }
      response += '\n';
    });

    return response;
  }

  // Add bookmark - format: "add [url] [title] [tags]"
  if (text.startsWith('add ')) {
    const parts = text.substring(4).split('|').map(p => p.trim());
    
    if (parts.length < 2) {
      return '❌ Invalid format. Use: add [url] | [title] | [tags]\n\nExample: add https://example.com | Example Site | tech,tutorial';
    }

    const url = parts[0];
    const title = parts[1];
    const tags = parts.length > 2 ? parts[2].split(',').map(t => t.trim()) : ['general'];
    const description = parts.length > 3 ? parts[3] : null;

    const { error } = await supabase
      .from('bookmarks')
      .insert({
        user_id: userId,
        url,
        title,
        tags,
        description,
        reading: false,
      });

    if (error) {
      return '❌ Error adding bookmark: ' + error.message;
    }

    return '✅ Bookmark added successfully!\n\n' +
           `📌 *${title}*\n` +
           `🔗 ${url}\n` +
           `🏷️ ${tags.join(', ')}`;
  }

  // Search bookmarks
  if (text.startsWith('search ')) {
    const query = text.substring(7).trim();
    
    const { data: bookmarks, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', userId)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      return '❌ Error searching bookmarks: ' + error.message;
    }

    if (!bookmarks || bookmarks.length === 0) {
      return `🔍 No bookmarks found for "${query}"`;
    }

    let response = `🔍 *Search results for "${query}":*\n\n`;
    bookmarks.forEach((bookmark: any, index: number) => {
      response += `${index + 1}. *${bookmark.title}*\n`;
      response += `   🔗 ${bookmark.url}\n`;
      if (bookmark.tags && bookmark.tags.length > 0) {
        response += `   🏷️ ${bookmark.tags.join(', ')}\n`;
      }
      response += '\n';
    });

    return response;
  }

  // Help command
  return '📖 *Available Commands:*\n\n' +
         '• *reading list* - Show your reading list\n' +
         '• *list* or *show all* - Show all bookmarks\n' +
         '• *add [url] | [title] | [tags]* - Add new bookmark\n' +
         '• *search [query]* - Search bookmarks\n' +
         '• *help* - Show this help message\n\n' +
         'Example:\n' +
         'add https://example.com | Example | tech,tutorial';
}

async function sendWhatsAppMessage(token: string, chatId: string, message: string): Promise<void> {
  try {
    const response = await fetch('https://gate.whapi.cloud/messages/text', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: chatId,
        body: message,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Whapi error:', error);
      throw new Error(`Failed to send WhatsApp message: ${error}`);
    }

    console.log('WhatsApp message sent successfully');
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    throw error;
  }
}
