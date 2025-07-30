"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Lock, 
  Settings, 
  Shield, 
  Users, 
  Database, 
  Key,
  Eye,
  EyeOff,
  Save,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

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

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<AdminSettings>({
    openaiApiKey: '',
    googleApiKey: '',
    anthropicApiKey: '',
    enableWebSearch: true,
    enableKnowledgeBase: true,
    enableCompanyProfiles: true,
    maxReportLength: 50,
    defaultModel: 'gpt-4o',
    requireApiKey: false
  });

  const handleLogin = () => {
    if (password === 'Radiohead123$$') {
      setIsAuthenticated(true);
      setError('');
      // Load settings from localStorage
      const savedSettings = localStorage.getItem('adminSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } else {
      setError('Invalid password');
    }
  };

  const handleSaveSettings = () => {
    setIsLoading(true);
    // Save to localStorage
    localStorage.setItem('adminSettings', JSON.stringify(settings));
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      router.push('/admin');
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-blue-600" />
            </div>
                          <CardTitle className="text-xl">Bulldozer Brain Admin</CardTitle>
              <CardDescription>
                Enter the admin password to access global settings
              </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
            <Button onClick={handleLogin} className="w-full">
              <Shield className="w-4 h-4 mr-2" />
              Access Admin Panel
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Bulldozer Brain Admin</h1>
              <p className="text-gray-600 mt-1">Global configuration for Local 825 Research</p>
            </div>
            <Badge variant="secondary" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Authenticated
            </Badge>
          </div>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* API Keys */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                API Configuration
              </CardTitle>
              <CardDescription>
                Configure API keys for different AI providers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="openai">OpenAI API Key</Label>
                <Input
                  id="openai"
                  type="password"
                  value={settings.openaiApiKey}
                  onChange={(e) => setSettings(prev => ({ ...prev, openaiApiKey: e.target.value }))}
                  placeholder="sk-..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="google">Google API Key</Label>
                <Input
                  id="google"
                  type="password"
                  value={settings.googleApiKey}
                  onChange={(e) => setSettings(prev => ({ ...prev, googleApiKey: e.target.value }))}
                  placeholder="AIza..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="anthropic">Anthropic API Key</Label>
                <Input
                  id="anthropic"
                  type="password"
                  value={settings.anthropicApiKey}
                  onChange={(e) => setSettings(prev => ({ ...prev, anthropicApiKey: e.target.value }))}
                  placeholder="sk-ant-..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Feature Toggles
              </CardTitle>
              <CardDescription>
                Enable or disable specific features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Web Search</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable internet search capabilities
                  </p>
                </div>
                <Switch
                  checked={settings.enableWebSearch}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableWebSearch: checked }))}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Knowledge Base</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable local file upload and storage
                  </p>
                </div>
                <Switch
                  checked={settings.enableKnowledgeBase}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableKnowledgeBase: checked }))}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Company Profiles</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable company profile generator
                  </p>
                </div>
                <Switch
                  checked={settings.enableCompanyProfiles}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableCompanyProfiles: checked }))}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require API Key</Label>
                  <p className="text-sm text-muted-foreground">
                    Force users to provide their own API keys
                  </p>
                </div>
                <Switch
                  checked={settings.requireApiKey}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, requireApiKey: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Default Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Default Settings
              </CardTitle>
              <CardDescription>
                Configure default values for new users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="defaultModel">Default AI Model</Label>
                <select
                  id="defaultModel"
                  value={settings.defaultModel}
                  onChange={(e) => setSettings(prev => ({ ...prev, defaultModel: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="gpt-4o">GPT-4o</option>
                  <option value="gpt-4o-mini">GPT-4o Mini</option>
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxLength">Max Report Length (pages)</Label>
                <Input
                  id="maxLength"
                  type="number"
                  value={settings.maxReportLength}
                  onChange={(e) => setSettings(prev => ({ ...prev, maxReportLength: parseInt(e.target.value) }))}
                  min="10"
                  max="100"
                />
              </div>
            </CardContent>
          </Card>

          {/* System Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                System Information
              </CardTitle>
              <CardDescription>
                Current system status and usage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Version</span>
                  <span className="text-sm font-medium">1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Environment</span>
                  <span className="text-sm font-medium">Development</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Last Updated</span>
                  <span className="text-sm font-medium">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <Button onClick={handleSaveSettings} disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
} 