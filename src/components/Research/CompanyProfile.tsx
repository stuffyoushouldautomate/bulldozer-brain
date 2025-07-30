import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Building2, MapPin, Users, FileText } from 'lucide-react';

interface CompanyProfileStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const steps: CompanyProfileStep[] = [
  {
    id: 1,
    title: "Company Information",
    description: "Enter the company name and basic details",
    icon: <Building2 className="h-5 w-5" />
  },
  {
    id: 2,
    title: "Geographic Location",
    description: "Select the county where the company operates",
    icon: <MapPin className="h-5 w-5" />
  },
  {
    id: 3,
    title: "Research Model",
    description: "Choose the AI model for analysis",
    icon: <Users className="h-5 w-5" />
  },
  {
    id: 4,
    title: "Report Type",
    description: "Select the type of report to generate",
    icon: <FileText className="h-5 w-5" />
  }
];

const newJerseyCounties = [
  "Atlantic County",
  "Bergen County", 
  "Burlington County",
  "Camden County",
  "Cape May County",
  "Cumberland County",
  "Essex County",
  "Gloucester County",
  "Hudson County",
  "Hunterdon County",
  "Mercer County",
  "Middlesex County",
  "Monmouth County",
  "Morris County",
  "Ocean County",
  "Passaic County",
  "Salem County",
  "Somerset County",
  "Sussex County",
  "Union County",
  "Warren County"
];

const newYorkCounties = [
  "Albany County",
  "Allegany County",
  "Bronx County",
  "Broome County",
  "Cattaraugus County",
  "Cayuga County",
  "Chautauqua County",
  "Chemung County",
  "Chenango County",
  "Clinton County",
  "Columbia County",
  "Cortland County",
  "Delaware County",
  "Dutchess County",
  "Erie County",
  "Essex County",
  "Franklin County",
  "Fulton County",
  "Genesee County",
  "Greene County",
  "Hamilton County",
  "Herkimer County",
  "Jefferson County",
  "Kings County",
  "Lewis County",
  "Livingston County",
  "Madison County",
  "Monroe County",
  "Montgomery County",
  "Nassau County",
  "New York County",
  "Niagara County",
  "Oneida County",
  "Onondaga County",
  "Ontario County",
  "Orange County",
  "Orleans County",
  "Oswego County",
  "Otsego County",
  "Putnam County",
  "Queens County",
  "Rensselaer County",
  "Richmond County",
  "Rockland County",
  "Saratoga County",
  "Schenectady County",
  "Schoharie County",
  "Schuyler County",
  "Seneca County",
  "St. Lawrence County",
  "Steuben County",
  "Suffolk County",
  "Sullivan County",
  "Tioga County",
  "Tompkins County",
  "Ulster County",
  "Warren County",
  "Washington County",
  "Wayne County",
  "Westchester County",
  "Wyoming County",
  "Yates County"
];



const reportTypes = [
  {
    id: "full",
    name: "Full Detailed Report",
    description: "Comprehensive 30-50 page analysis with all sections",
    length: "30-50 pages"
  },
  {
    id: "condensed",
    name: "Condensed Insights Report", 
    description: "5-10 page summary focusing on key findings and recent developments",
    length: "5-10 pages"
  },
  {
    id: "change-alert",
    name: "Change Alert Report",
    description: "2-5 page report on specific changes or new developments",
    length: "2-5 pages"
  }
];

interface CompanyProfileData {
  companyName: string;
  county: string;
  model: string;
  reportType: string;
}

interface CompanyProfileProps {
  onStartResearch: (data: CompanyProfileData) => void;
}

export default function CompanyProfile({ onStartResearch }: CompanyProfileProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CompanyProfileData>({
    companyName: '',
    county: '',
    model: 'gpt-4o',
    reportType: 'full'
  });

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    onStartResearch(formData);
  };

  const updateFormData = (field: keyof CompanyProfileData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                placeholder="Enter company name..."
                value={formData.companyName}
                onChange={(e) => updateFormData('companyName', e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="companyDescription">Company Description (Optional)</Label>
              <Input
                id="companyDescription"
                placeholder="Brief description of the company..."
                className="mt-2"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="county">Primary Operating County</Label>
              <Select value={formData.county} onValueChange={(value) => updateFormData('county', value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select a county..." />
                </SelectTrigger>
                <SelectContent>
                  <div className="px-2 py-1 text-sm font-semibold text-muted-foreground">New Jersey Counties</div>
                  {newJerseyCounties.map((county) => (
                    <SelectItem key={county} value={county}>{county}</SelectItem>
                  ))}
                  <div className="px-2 py-1 text-sm font-semibold text-muted-foreground">New York Counties</div>
                  {newYorkCounties.map((county) => (
                    <SelectItem key={county} value={county}>{county}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="model">AI Research Model</Label>
              <Select value={formData.model} onValueChange={(value) => updateFormData('model', value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select a model..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4o">GPT-4o (Recommended)</SelectItem>
                  <SelectItem value="gpt-4o-mini">GPT-4o Mini (Faster)</SelectItem>
                  <SelectItem value="gpt-4">GPT-4 (Legacy)</SelectItem>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo (Budget)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground mt-2">
                GPT-4o provides the most comprehensive analysis, while GPT-4o Mini offers faster results.
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <Label>Report Type</Label>
              <div className="grid gap-3 mt-2">
                {reportTypes.map((type) => (
                  <Card 
                    key={type.id}
                    className={`cursor-pointer transition-colors ${
                      formData.reportType === type.id 
                        ? 'border-primary bg-primary/5' 
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => updateFormData('reportType', type.id)}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">{type.name}</CardTitle>
                      <CardDescription className="text-xs">
                        {type.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="text-xs text-muted-foreground">
                        Length: {type.length}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.companyName.trim().length > 0;
      case 2:
        return formData.county.length > 0;
      case 3:
        return formData.model.length > 0;
      case 4:
        return formData.reportType.length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-2">Company Profile Generator</h1>
        <p className="text-muted-foreground text-center">
          Generate comprehensive company research reports for Local 825
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              currentStep >= step.id 
                ? 'bg-primary text-primary-foreground border-primary' 
                : 'bg-background border-muted-foreground'
            }`}>
              {currentStep > step.id ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <span className="text-sm font-medium">{step.id}</span>
              )}
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-4 ${
                currentStep > step.id ? 'bg-primary' : 'bg-muted'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Current Step */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            {steps[currentStep - 1].icon}
            <div>
              <CardTitle>{steps[currentStep - 1].title}</CardTitle>
              <CardDescription>{steps[currentStep - 1].description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>

        {currentStep < steps.length ? (
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex items-center gap-2"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!canProceed()}
            className="flex items-center gap-2"
          >
            Start Research
            <FileText className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
} 