"use client";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useTaskStore } from "@/store/task";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Download,
  FileText,
  Building2,
  Users,
  TrendingUp,
  AlertTriangle,
  MapPin,
  DollarSign,
  Shield,
  Target,
  BarChart3,
  Download as DownloadIcon,
} from "lucide-react";
import { parseMarkdown } from "@/utils/markdown";
import { generateWordPressHTML, generateWordPressCSS, generateWordPressJS } from "@/utils/wordpress-export";

interface ReportSection {
  id: string;
  title: string;
  content: string;
  icon: React.ReactNode;
  order: number;
}

interface ReportDocument {
  name: string;
  url: string;
  type: 'pdf' | 'doc' | 'xls' | 'image' | 'link';
  description: string;
}

interface ReportChart {
  title: string;
  data: any;
  type: 'bar' | 'line' | 'pie' | 'table';
}

export default function FinalReport() {
  const { t } = useTranslation();
  const { finalReport } = useTaskStore();
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [isCompanyProfile, setIsCompanyProfile] = useState<boolean>(false);
  const [companyData, setCompanyData] = useState<{
    companyName: string;
    county: string;
    reportType: string;
  } | null>(null);

  // Parse the report into sections
  const parseReportSections = (content: string): ReportSection[] => {
    const sections: ReportSection[] = [];
    const lines = content.split('\n');
    let currentSection: ReportSection | null = null;
    let currentContent: string[] = [];

    const sectionIcons: Record<string, React.ReactNode> = {
      'executive summary': <FileText className="h-4 w-4" />,
      'company overview': <Building2 className="h-4 w-4" />,
      'leadership': <Users className="h-4 w-4" />,
      'financial': <DollarSign className="h-4 w-4" />,
      'projects': <MapPin className="h-4 w-4" />,
      'safety': <Shield className="h-4 w-4" />,
      'union': <Target className="h-4 w-4" />,
      'strategic': <BarChart3 className="h-4 w-4" />,
      'recommendations': <TrendingUp className="h-4 w-4" />,
      'swot': <AlertTriangle className="h-4 w-4" />,
    };

    const sectionOrder: Record<string, number> = {
      'executive summary': 1,
      'company overview': 2,
      'leadership': 3,
      'financial': 4,
      'projects': 5,
      'safety': 6,
      'union': 7,
      'strategic': 8,
      'swot': 9,
      'recommendations': 10,
    };

    for (const line of lines) {
      if (line.startsWith('## ') || line.startsWith('### ')) {
        // Save previous section
        if (currentSection) {
          currentSection.content = currentContent.join('\n');
          sections.push(currentSection);
        }

        // Start new section
        const title = line.replace(/^#+\s*/, '').toLowerCase();
        const sectionId = title.replace(/\s+/g, '-');
        const icon = sectionIcons[title] || <FileText className="h-4 w-4" />;
        const order = sectionOrder[title] || 999;

        currentSection = {
          id: sectionId,
          title: line.replace(/^#+\s*/, ''),
          content: '',
          icon,
          order
        };
        currentContent = [];
      } else if (currentSection) {
        currentContent.push(line);
      }
    }

    // Add final section
    if (currentSection) {
      currentSection.content = currentContent.join('\n');
      sections.push(currentSection);
    }

    return sections.sort((a, b) => a.order - b.order);
  };

  const sections = parseReportSections(finalReport);

  // Detect if this is a company profile report
  useEffect(() => {
    const isProfile = finalReport.includes("Local 825 Company Profile") || 
                     finalReport.includes("company profile") ||
                     finalReport.includes("Bulldozer Company Profile");
    
    setIsCompanyProfile(isProfile);
    
    if (isProfile) {
      // Extract company data from the report
      const companyMatch = finalReport.match(/for\s+([^,\s]+(?:\s+[^,\s]+)*?)\s+operating/);
      const countyMatch = finalReport.match(/in\s+([^,\s]+(?:\s+[^,\s]+)*?)\s+County/);
      const reportTypeMatch = finalReport.match(/Generate a\s+([^,\s]+(?:\s+[^,\s]+)*?)\s+report/);
      
      if (companyMatch && countyMatch) {
        setCompanyData({
          companyName: companyMatch[1],
          county: countyMatch[1],
          reportType: reportTypeMatch ? reportTypeMatch[1] : "Full Detailed"
        });
      }
    }
  }, [finalReport]);

  const renderSectionContent = (content: string) => {
    return parseMarkdown(content);
  };

  const renderDocuments = () => {
    // Mock documents - in real implementation, these would be extracted from the research
    const documents: ReportDocument[] = [
      {
        name: "OSHA Violations Report",
        url: "#",
        type: "pdf",
        description: "Recent safety violations and citations"
      },
      {
        name: "Financial Statements",
        url: "#",
        type: "xls",
        description: "Company financial data and performance metrics"
      },
      {
        name: "Project Portfolio",
        url: "#",
        type: "doc",
        description: "Current and completed projects list"
      }
    ];

    return (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold mb-4">Supporting Documents</h3>
        {documents.map((doc, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">{doc.name}</h4>
                    <p className="text-sm text-muted-foreground">{doc.description}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderCharts = () => {
    // Mock charts - in real implementation, these would be generated from research data
    const charts: ReportChart[] = [
      {
        title: "Revenue Trend (Last 5 Years)",
        data: { /* chart data */ },
        type: "line"
      },
      {
        title: "Safety Violations by Year",
        data: { /* chart data */ },
        type: "bar"
      },
      {
        title: "Project Distribution by County",
        data: { /* chart data */ },
        type: "pie"
      }
    ];

    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold mb-4">Key Visualizations</h3>
        {charts.map((chart, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-base">{chart.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-12 w-12 text-gray-400" />
                <span className="ml-2 text-gray-500">Chart visualization</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const handleExportWordPress = () => {
    const html = generateWordPressHTML(sections, {
      companyName: companyData?.companyName,
      county: companyData?.county,
      reportType: companyData?.reportType,
      includeCharts: true,
      includeDocuments: true,
      includeNavigation: true
    });

    const css = generateWordPressCSS();
    const js = generateWordPressJS();

    // Create a downloadable file with all the code
    const exportContent = `# Local 825 Report - WordPress Elementor Export

## HTML Code (Copy and paste into Elementor)
\`\`\`html
${html}
\`\`\`

## CSS Code (Add to Elementor Custom CSS)
\`\`\`css
${css}
\`\`\`

## JavaScript Code (Add to Elementor Custom JS)
\`\`\`javascript
${js}
\`\`\`

## Instructions
1. Copy the HTML code above
2. In Elementor, create a new section
3. Add a "Shortcode" widget
4. Paste the HTML code into the shortcode field
5. Add the CSS to your theme's custom CSS or Elementor's custom CSS
6. Add the JavaScript to Elementor's custom JS section
7. The report will be fully responsive and ready to use

## Features Included
- McKinsey-style professional layout
- Local 825 branding
- Responsive design for mobile/tablet/desktop
- Tabbed navigation between sections
- Document download placeholders
- Chart visualization placeholders
- Print-optimized styles
- Smooth scrolling navigation
- Professional typography and spacing
`;

    const blob = new Blob([exportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${companyData?.companyName || 'Report'}_WordPress_Export.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!finalReport) {
    return null;
  }

  return (
    <section className="p-4 border rounded-md mt-4 print:hidden">
      <div className="flex justify-between items-center border-b mb-4">
        <div>
          <h3 className="font-semibold text-lg leading-10">
            {isCompanyProfile ? "Bulldozer Company Profile" : t("research.finalReport.title")}
          </h3>
          {companyData && (
            <div className="flex items-center gap-4 mt-2">
              <Badge variant="secondary">{companyData.companyName}</Badge>
              <Badge variant="outline">{companyData.county} County</Badge>
              <Badge variant="outline">{companyData.reportType}</Badge>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportWordPress}>
            <Download className="h-4 w-4 mr-2" />
            Export for WordPress
          </Button>
        </div>
      </div>

      {/* McKinsey-style Report Layout */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                {isCompanyProfile ? "Bulldozer Company Profile" : "Research Report"}
              </h1>
              {companyData && (
                <p className="text-blue-100 mt-1">
                  {companyData.companyName} • {companyData.county} County • {companyData.reportType}
                </p>
              )}
                             <p className="text-blue-100 mt-1">
                 Generated by Bulldozer Brain • {new Date().toLocaleDateString()}
               </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-200">825</div>
              <div className="text-sm text-blue-100">Local</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b bg-gray-50">
          <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
            <TabsList className="grid w-full grid-cols-6 lg:grid-cols-8 h-auto bg-transparent border-0">
              {sections.slice(0, 8).map((section) => (
                <TabsTrigger
                  key={section.id}
                  value={section.id}
                  className="data-[state=active]:bg-white data-[state=active]:text-blue-900 data-[state=active]:shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    {section.icon}
                    <span className="hidden lg:inline">{section.title}</span>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

                 {/* Content Area */}
         <div className="h-[600px] overflow-hidden">
           {sections.map((section) => (
             <TabsContent key={section.id} value={section.id} className="mt-0 h-full">
               <div className="p-6 h-full flex flex-col">
                 <div className="max-w-4xl mx-auto flex-1 overflow-hidden">
                   <div className="mb-6">
                     <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {section.title}
                    </h2>
                    <Separator />
                  </div>
                  
                  <div className="prose prose-lg max-w-none h-full overflow-y-auto pr-4 relative">
                    <div dangerouslySetInnerHTML={{ __html: renderSectionContent(section.content) }} />
                    
                    {/* Scroll Indicator */}
                    <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 text-xs text-gray-600 shadow-sm border">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        Scroll to view more
                      </div>
                    </div>
                  </div>

                  {/* Additional content for specific sections */}
                  {section.id === 'documents' && renderDocuments()}
                  {section.id === 'charts' && renderCharts()}
                </div>
              </div>
            </TabsContent>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t p-4">
                     <div className="flex items-center justify-between text-sm text-gray-600">
             <div className="flex items-center gap-4">
               <span>Bulldozer Brain Platform</span>
               <span>•</span>
               <span>Confidential Report</span>
             </div>
            <div className="flex items-center gap-4">
              <span>Page {sections.findIndex(s => s.id === activeSection) + 1} of {sections.length}</span>
              <span>•</span>
              <span>Generated {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>


    </section>
  );
}
