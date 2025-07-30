import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Building2 } from 'lucide-react';
import { useAdminSettings } from '@/hooks/useAdminSettings';

export type ResearchMode = 'standard' | 'company-profile';

interface ModeSelectorProps {
  selectedMode: ResearchMode;
  onModeChange: (mode: ResearchMode) => void;
}

export default function ModeSelector({ selectedMode, onModeChange }: ModeSelectorProps) {
  const { isFeatureEnabled } = useAdminSettings();
  
  const modes = [
    {
      id: 'standard' as ResearchMode,
      title: 'Standard Research',
      description: 'Conduct general research on any topic',
      icon: <Search className="h-5 w-5" />,
      features: ['General topic research', 'Custom research questions', 'Flexible analysis']
    },
    ...(isFeatureEnabled('enableCompanyProfiles') ? [{
      id: 'company-profile' as ResearchMode,
      title: 'Company Profile Generator',
      description: 'Generate comprehensive company research reports for Local 825',
      icon: <Building2 className="h-5 w-5" />,
      features: ['Construction company analysis', 'Union organizing intelligence', 'Structured reports']
    }] : [])
  ];

  return (
    <div className={`grid gap-4 mb-6 ${modes.length > 1 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
      {modes.map((mode) => (
        <Card
          key={mode.id}
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedMode === mode.id
              ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
              : 'hover:border-muted-foreground/50'
          }`}
          onClick={() => onModeChange(mode.id)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              {mode.icon}
              <div>
                <CardTitle className="text-base">{mode.title}</CardTitle>
                <CardDescription className="text-sm">{mode.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="text-xs text-muted-foreground space-y-1">
              {mode.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 