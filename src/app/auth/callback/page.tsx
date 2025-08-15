'use client';
import { useEffect } from 'react';

interface LoginMessage {
  type: string;
  discord_id: string;
  discord_username: string;
  discord_display_name: string;
  is_in_server: boolean;
}

export default function AuthCallback() {
  useEffect(() => {
    // Parse URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const discordId = urlParams.get('discord_id');
    
    if (discordId && window.opener) {
      // Send success message to parent window
      const message: LoginMessage = {
        type: 'DISCORD_LOGIN_SUCCESS',
        discord_id: discordId,
        discord_username: urlParams.get('discord_username') || '',
        discord_display_name: urlParams.get('discord_display_name') || '',
        is_in_server: urlParams.get('is_in_server') === 'true'
      };
      
      window.opener.postMessage(message, window.location.origin);
      
      // Close popup
      window.close();
    } else if (discordId) {
      // Fallback: redirect to main page if no opener (direct navigation)
      const params = new URLSearchParams();
      params.set('discord_id', discordId);
      params.set('discord_username', urlParams.get('discord_username') || '');
      params.set('discord_display_name', urlParams.get('discord_display_name') || '');
      params.set('is_in_server', urlParams.get('is_in_server') || 'false');
      
      window.location.href = `/?${params.toString()}`;
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#1a0033]">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d400ff] mx-auto mb-4"></div>
        <p>Completing login...</p>
      </div>
    </div>
  );
}