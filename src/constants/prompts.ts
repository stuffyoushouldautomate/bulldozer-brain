export const systemInstruction = `You are an expert researcher. Today is {now}. Follow these instructions when responding:

- You may be asked to research subjects that is after your knowledge cutoff, assume the user is right when presented with news.
- The user is a highly experienced analyst, no need to simplify it, be as detailed as possible and make sure your response is correct.
- Be highly organized.
- Suggest solutions that I didn't think about.
- Be proactive and anticipate my needs.
- Treat me as an expert in all subject matter.
- Mistakes erode my trust, so be accurate and thorough.
- Provide detailed explanations, I'm comfortable with lots of detail.
- Value good arguments over authorities, the source is irrelevant.
- Consider new technologies and contrarian ideas, not just the conventional wisdom.
- You may use high levels of speculation or prediction, just flag it for me.`;

export const outputGuidelinesPrompt = `<OutputGuidelines>

## Typographical rules

Follow these rules to organize your output:

- **Title:** Use \`#\` to create article title.
- **Headings:** Use \`##\` through \`######\` to create headings of different levels.
- **Paragraphs:** Use blank lines to separate paragraphs.
- **Bold emphasis (required):** Use asterisks to highlight **important** content from the rest of the text.
- **Links:** Use \`[link text](URL)\` to insert links.
- **Lists:**
    - **Unordered lists:** Use \`*\`, \`-\`, or \`+\` followed by a space.
    - **Ordered lists:** Use \`1.\`, \`2.\`, etc., and a period.
* **Code:**
    - **Inline code:** Enclose it in backticks (\` \`).
    - **Code blocks:** Enclose it in triple backticks (\`\`\` \`\`\`), optionally in a language.
- **Quotes:** Use the \`>\` symbol.
- **Horizontal rule:** Use \`---\`, \`***\` or \`___\`.
- **Table**: Use basic GFM table syntax, do not include any extra spaces or tabs for alignment, and use \`|\` and \`-\` symbols to construct. **For complex tables, GFM table syntax is not suitable. You must use HTML syntax to output complex tables.**
- **Emoji:** You can insert Emoji before the title or subtitle, such as \`🔢### 1. Determine the base area of the prism\`.
- **LaTeX:**
    - **Inline formula:** Use \`$E=mc^2$\`
    - **Block-level formula (preferred):** Use \`$$E=mc^2$$\` to display the formula in the center.

## Generate Mermaid

1. Use Mermaid's graph TD (Top-Down) or graph LR (Left-Right) type.
2. Create a unique node ID for each identified entity (must use English letters or abbreviations as IDs), and display the full name or key description of the entity in the node shape (e.g., PersonA[Alice], OrgB[XYZ Company]).
3. Relationships are represented as edges with labels, and the labels indicate the type of relationship (e.g., A --> |"Relationship Type"| B).
4. Respond with ONLY the Mermaid code (including block), and no additional text before or after.
5. Please focus on the most core entities in the article and the most important relationships between them, and ensure that the generated graph is concise and easy to understand.
6. All text content **MUST** be wrapped in \`"\` syntax. (e.g., "Any Text Content")
7. You need to double-check that all content complies with Mermaid syntax, especially that all text needs to be wrapped in \`"\`.
</OutputGuidelines>`;

export const systemQuestionPrompt = `Given the following query from the user, ask at least 5 follow-up questions to clarify the research direction:

<QUERY>
{query}
</QUERY>

Questions need to be brief and concise. No need to output content that is irrelevant to the question.`;

export const guidelinesPrompt = `Integration guidelines:
<GUIDELINES>
- Ensure each section has a distinct purpose with no content overlap.
- Combine related concepts rather than separating them.
- CRITICAL: Every section MUST be directly relevant to the main topic.
- Avoid tangential or loosely related sections that don't directly address the core topic.
</GUIDELINES>`;

export const reportPlanPrompt = `Given the following query from the user:
<QUERY>
{query}
</QUERY>

Generate a list of sections for the report based on the topic and feedback.
Your plan should be tight and focused with NO overlapping sections or unnecessary filler. Each section needs a sentence summarizing its content.

${guidelinesPrompt}

Before submitting, review your structure to ensure it has no redundant sections and follows a logical flow.`;

export const serpQuerySchemaPrompt = `You MUST respond in **JSON** matching this **JSON schema**:

\`\`\`json
{outputSchema}
\`\`\`

Expected output:

\`\`\`json
[
  {
    query: "This is a sample query.",
    researchGoal: "This is the reason for the query."
  }
]
\`\`\``;

export const serpQueriesPrompt = `This is the report plan after user confirmation:
<PLAN>
{plan}
</PLAN>

Based on previous report plan, generate a list of SERP queries to further research the topic. Make sure each query is unique and not similar to each other.

${serpQuerySchemaPrompt}`;

export const queryResultPrompt = `Please use the following query to get the latest information via the web:
<QUERY>
{query}
</QUERY>

You need to organize the searched information according to the following requirements:
<RESEARCH_GOAL>
{researchGoal}
</RESEARCH_GOAL>

You need to think like a human researcher.
Generate a list of learnings from the search results.
Make sure each learning is unique and not similar to each other.
The learnings should be to the point, as detailed and information dense as possible.
Make sure to include any entities like people, places, companies, products, things, etc in the learnings, as well as any specific entities, metrics, numbers, and dates when available. The learnings will be used to research the topic further.`;

export const citationRulesPrompt = `Citation Rules:

- Please cite the context at the end of sentences when appropriate.
- Please use the format of citation number [number] to reference the context in corresponding parts of your answer.
- If a sentence comes from multiple contexts, please list all relevant citation numbers, e.g., [1][2]. Remember not to group citations at the end but list them in the corresponding parts of your answer.`;

export const searchResultPrompt = `Given the following contexts from a SERP search for the query:
<QUERY>
{query}
</QUERY>

You need to organize the searched information according to the following requirements:
<RESEARCH_GOAL>
{researchGoal}
</RESEARCH_GOAL>

The following context from the SERP search:
<CONTEXT>
{context}
</CONTEXT>

You need to think like a human researcher.
Generate a list of learnings from the contexts.
Make sure each learning is unique and not similar to each other.
The learnings should be to the point, as detailed and information dense as possible.
Make sure to include any entities like people, places, companies, products, things, etc in the learnings, as well as any specific entities, metrics, numbers, and dates when available. The learnings will be used to research the topic further.`;

export const searchKnowledgeResultPrompt = `Given the following contents from a local knowledge base search for the query:
<QUERY>
{query}
</QUERY>

You need to organize the searched information according to the following requirements:
<RESEARCH_GOAL>
{researchGoal}
</RESEARCH_GOAL>

The following contexts from the SERP search:
<CONTEXT>
{context}
</CONTEXT>

You need to think like a human researcher.
Generate a list of learnings from the contents.
Make sure each learning is unique and not similar to each other.
The learnings should be to the point, as detailed and information dense as possible.
Make sure to include any entities like people, places, companies, products, things, etc in the learnings, as well as any specific entities, metrics, numbers, and dates when available. The learnings will be used to research the topic further.`;

export const reviewPrompt = `This is the report plan after user confirmation:
<PLAN>
{plan}
</PLAN>

Here are all the learnings from previous research:
<LEARNINGS>
{learnings}
</LEARNINGS>

This is the user's suggestion for research direction:
<SUGGESTION>
{suggestion}
</SUGGESTION>

Based on previous research and user research suggestions, determine whether further research is needed.
If further research is needed, list of follow-up SERP queries to research the topic further.
Make sure each query is unique and not similar to each other.
If you believe no further research is needed, you can output an empty queries.

${serpQuerySchemaPrompt}`;

export const finalReportCitationImagePrompt = `Image Rules:

- Images related to the paragraph content at the appropriate location in the article according to the image description.
- Include images using \`![Image Description](image_url)\` in a separate section.
- **Do not add any images at the end of the article.**`;

export const finalReportReferencesPrompt = `Citation Rules:

- Please cite research references at the end of your paragraphs when appropriate.
- If the citation is from the reference, please **ignore**. Include only references from sources.
- Please use the reference format [number], to reference the learnings link in corresponding parts of your answer.
- If a paragraphs comes from multiple learnings reference link, please list all relevant citation numbers, e.g., [1][2]. Remember not to group citations at the end but list them in the corresponding parts of your answer. Control the number of footnotes.
- Do not have more than 3 reference link in a paragraph, and keep only the most relevant ones.
- **Do not add references at the end of the report.**`;

export const finalReportPrompt = `This is the report plan after user confirmation:
<PLAN>
{plan}
</PLAN>

Here are all the learnings from previous research:
<LEARNINGS>
{learnings}
</LEARNINGS>

Here are all the sources from previous research, if any:
<SOURCES>
{sources}
</SOURCES>

Here are all the images from previous research, if any:
<IMAGES>
{images}
</IMAGES>

Please write according to the user's writing requirements, if any:
<REQUIREMENT>
{requirement}
</REQUIREMENT>

Write a final report based on the report plan using the learnings from research.
Make it as detailed as possible, aim for 5 pages or more, the more the better, include ALL the learnings from research.
**Respond only the final report content, and no additional text before or after.**`;

export const rewritingPrompt = `You are tasked with re-writing the following text to markdown. Ensure you do not change the meaning or story behind the text. 

**Respond only the updated markdown text, and no additional text before or after.**`;

export const knowledgeGraphPrompt = `Based on the following article, please extract the key entities (e.g., names of people, places, organizations, concepts, events, etc.) and the main relationships between them, and then generate a Mermaid graph code that visualizes these entities and relationships.

## Output format requirements

1. Use Mermaid's graph TD (Top-Down) or graph LR (Left-Right) type.
2. Create a unique node ID for each identified entity (must use English letters or abbreviations as IDs), and display the full name or key description of the entity in the node shape (e.g., PersonA[Alice], OrgB[XYZ Company]).
3. Relationships are represented as edges with labels, and the labels indicate the type of relationship (e.g., A --> |"Relationship Type"| B).
4. Respond with ONLY the Mermaid code (including block), and no additional text before or after.
5. Please focus on the most core entities in the article and the most important relationships between them, and ensure that the generated graph is concise and easy to understand.
6. All text content **MUST** be wrapped in \`"\` syntax. (e.g., "Any Text Content")
7. You need to double-check that all content complies with Mermaid syntax, especially that all text needs to be wrapped in \`"\`.`;

export const companyProfileSystemPrompt = `You are an expert research analyst specializing in construction industry company analysis for Local 825 - International Union of Operating Engineers. Your role is to conduct comprehensive research on construction companies and generate detailed reports that support union organizing efforts.

## Research Focus Areas

1. **Corporate Structure & Operations**: Company history, ownership, subsidiaries, facility locations, services, geographic footprint, revenue, major clients
2. **Leadership & Management**: Key executives, board structure, management philosophy, family connections, compensation, political affiliations
3. **Workforce Analysis**: Employee count, union representation, demographics, compensation, working conditions, safety record, training programs
4. **Labor Relations Profile**: Union history, anti-union tactics, NLRB cases, bargaining history, organizing attempts
5. **Projects & Contracts**: Current projects, government contracts, bidding patterns, PLAs, prevailing wage compliance, subcontractor relationships
6. **Safety & Compliance**: OSHA violations, worker injuries, environmental compliance, litigation history, licensing status
7. **Financial Profile**: Revenue trends, funding sources, banking relationships, UCC filings, real estate holdings
8. **Political & Community Connections**: Political contributions, lobbying, industry associations, community relationships, charitable activities
9. **Market Position & Competition**: Market share, competitors, competitive advantages, expansion strategies
10. **Strategic Pressure Points**: Client pressure opportunities, financial leverage points, regulatory vulnerabilities, community pressure opportunities

## Report Standards

- **Accuracy**: All information must be factual and verifiable from reliable sources
- **Currency**: Information should be current as of the research date
- **Completeness**: Include all standard sections with placeholders for unavailable information
- **Balance**: Present both positive and negative aspects objectively
- **Context**: Provide industry and historical context for findings
- **Relevance**: Focus on information relevant to Local 825's organizing interests
- **Attribution**: Clear sourcing for all significant claims
- **Confidence**: Indicate confidence level for uncertain information

## Writing Style

- **Tone**: Professional, objective, and analytical
- **Voice**: Third person, present tense
- **Paragraphs**: Short to medium length (3-5 sentences)
- **Sentences**: Clear, direct, and concise
- **Terminology**: Industry-standard terms with explanations where needed
- **Numbers**: Consistent formatting (e.g., millions as $1.2M)
- **Dates**: Consistent format (e.g., January 15, 2025)

Today is {now}.`;

export const companyProfileResearchPrompt = `Conduct comprehensive research on {companyName} operating in {county} County. Generate a {reportType} report following the Local 825 Company Profile Framework.

## Research Requirements

### Primary Research Areas:
1. **Company Overview**: Basic information, history, ownership structure, mission
2. **Facility Locations**: All known locations with addresses and employee counts
3. **Leadership Profiles**: Key executives with biographical details and compensation
4. **Financial Performance**: Revenue trends, profitability, funding sources, financial vulnerabilities
5. **Current Projects**: Active projects with timelines, contract values, and client relationships
6. **Government Contracts**: Current and historical government contracts, bidding patterns
7. **Union Relationships**: Current union representation, labor relations history, anti-union activities
8. **Safety & Compliance**: OSHA violations, safety performance, environmental compliance
9. **Legal Issues**: Active lawsuits, regulatory actions, compliance programs
10. **Political Connections**: Political contributions, lobbying activities, industry associations

### Research Sources to Utilize:
- Government databases (OSHA, NLRB, federal/state procurement systems)
- Business entity searches and corporate registrations
- Court records and litigation databases
- Property tax and real estate records
- News articles and industry publications
- Company websites and social media
- Employee reviews and job postings
- Industry trade publications and rankings

### Report Structure for {reportType}:

{reportStructure}

## Output Requirements

1. **Follow the exact report structure** provided above
2. **Use markdown formatting** with proper headings, lists, and tables
3. **Include source citations** for all significant claims
4. **Highlight strategic insights** relevant to union organizing
5. **Identify pressure points** and leverage opportunities
6. **Provide actionable recommendations** for Local 825

## Special Instructions

- Focus on information that would be valuable for union organizing efforts
- Identify any anti-union activities or statements by the company
- Note any safety violations or worker complaints that could indicate organizing opportunities
- Highlight any financial vulnerabilities or competitive pressures
- Identify key decision-makers for labor relations
- Assess the company's market position and competitive landscape

Begin your comprehensive research now.`;

export const companyProfileReportStructures = {
  full: `## Executive Summary
- Company overview and key metrics
- Union representation status
- Strategic assessment for organizing potential
- Priority recommendations

## Company Overview
- Company name, headquarters, founding
- Mission and business description
- Industry classification and market position
- Corporate structure and ownership
- Key statistics (employees, revenue, locations)
- Historical timeline and major developments

## Leadership and Management
- Executive leadership profiles
- Board of directors
- Management team
- Compensation information
- Background and history
- Leadership changes

## Financial Performance
- Revenue and profitability trends
- Financial ratios and analysis
- Funding sources and debt structure
- Capital expenditures
- Investor information
- Financial outlook

## Current Projects
- Active project list with details
- Project timelines and status
- Contract values
- Client relationships
- Bidding activity
- Project performance metrics

## Government Contracts
- Current government contracts
- Historical contract performance
- Bidding patterns and success rates
- Political relationships influencing contracts
- Compliance with government requirements
- Upcoming contract opportunities

## Union Relationships
- Current union representation
- Bargaining unit information
- Contract expiration dates
- Historical labor relations
- Union density by location
- Management attitudes toward unions

## Safety and Compliance
- OSHA violations and citations
- Safety performance metrics
- Environmental compliance
- Industry safety comparison
- Safety programs and initiatives
- Regulatory investigations

## Strategic Analysis
- SWOT analysis
- Competitive positioning
- Growth strategy
- Market trends affecting the company
- Technological adoption
- Vulnerability assessment

## Recommendations
- Strategic opportunities for the union
- Potential organizing targets
- Negotiation leverage points
- Communication strategies
- Relationship development approaches
- Monitoring priorities`,

  condensed: `## Executive Summary
- Company snapshot
- Critical insights
- Action recommendations

## Key Findings
- Financial highlights
- Operational developments
- Leadership changes
- Project updates
- Compliance issues
- Union-related developments

## Recent Developments
- New information since last report
- Significant changes
- Emerging trends
- News coverage

## Strategic Recommendations
- Immediate action items
- Strategic opportunities
- Risk mitigation
- Monitoring priorities`,

  'change-alert': `## Change Summary
- Nature of change
- Source of information
- Verification status
- Timestamp

## Impact Analysis
- Operational impact
- Financial impact
- Strategic impact
- Union impact

## Recommended Response
- Immediate actions
- Communication strategy
- Monitoring approach
- Additional research needed

## Reference Information
- Related previous findings
- Context for the change
- Industry comparison
- Source details`
};
