import { useState, useEffect } from 'react';

interface AdminSettings {
  openaiApiKey: string;
  googleApiKey: string;
  anthropicApiKey: string;
  enableWebSearch: boolean;
  enableKnowledgeBase: boolean;
  enableCompanyProfiles: boolean;
  maxReportLength: number;
  defaultModel: string;
  requireApiKey: boolean;
}

const defaultSettings: AdminSettings = {
  openaiApiKey: '',
  googleApiKey: '',
  anthropicApiKey: '',
  enableWebSearch: true,
  enableKnowledgeBase: true,
  enableCompanyProfiles: true,
  maxReportLength: 50,
  defaultModel: 'gpt-4o',
  requireApiKey: false
};

export function useAdminSettings() {
  const [settings, setSettings] = useState<AdminSettings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('adminSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsedSettings });
      } catch (error) {
        console.error('Failed to parse admin settings:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  const isFeatureEnabled = (feature: keyof AdminSettings) => {
    if (!isLoaded) return true; // Default to enabled while loading
    return settings[feature] as boolean;
  };

  const getApiKey = (provider: string) => {
    switch (provider) {
      case 'openai':
        return settings.openaiApiKey;
      case 'google':
        return settings.googleApiKey;
      case 'anthropic':
        return settings.anthropicApiKey;
      default:
        return '';
    }
  };

  const shouldRequireApiKey = () => {
    return settings.requireApiKey;
  };

  const getDefaultModel = () => {
    return settings.defaultModel;
  };

  const getMaxReportLength = () => {
    return settings.maxReportLength;
  };

  return {
    settings,
    isLoaded,
    isFeatureEnabled,
    getApiKey,
    shouldRequireApiKey,
    getDefaultModel,
    getMaxReportLength
  };
} 