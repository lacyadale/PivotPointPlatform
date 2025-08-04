import { useState, useEffect, useReducer, useCallback } from "react";

interface ReportSection {
  title: string;
  content: string;
  completed: boolean;
}

interface Report {
  id: string;
  clientId: string;
  clientName: string;
  createdAt: string;
  updatedAt: string;
  dueDate: string;
  sections: {
    [key: string]: ReportSection;
  };
  demographics: {
    name: string;
    dateOfBirth: string;
    age: string;
    gender: string;
    school: string;
    evaluationType: string;
    grade: string;
    reportDate: string;
    parent: string;
    phone: string;
    address: string;
  };
  selectedClient: {
    id: string;
    name: string;
  };
}

// Report reducer for better state management
type ReportAction = 
  | { type: 'updateSection'; sectionKey: string; content: string }
  | { type: 'setDemographic'; field: string; value: string }
  | { type: 'hydrate'; report: Partial<Report> };

const reportReducer = (state: Report, action: ReportAction): Report => {
  switch (action.type) {
    case 'updateSection':
      return {
        ...state,
        sections: {
          ...state.sections,
          [action.sectionKey]: {
            ...state.sections[action.sectionKey],
            content: action.content,
            completed: action.content.length > 0,
          },
        },
      };
    case 'setDemographic':
      return {
        ...state,
        demographics: {
          ...state.demographics,
          [action.field]: action.value,
        },
      };
    case 'hydrate':
      return {
        ...state,
        ...action.report,
        sections: {
          ...state.sections,
          ...action.report.sections,
        },
        demographics: {
          ...state.demographics,
          ...action.report.demographics,
        },
      };
    default:
      return state;
  }
};

const createEmptyReport = (): Report => ({
  id: "",
  clientId: "",
  clientName: "",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  dueDate: "",
  demographics: {
    name: "",
    dateOfBirth: "",
    age: "",
    gender: "",
    school: "",
    evaluationType: "Initial Evaluation",
    grade: "",
    reportDate: new Date().toLocaleDateString(),
    parent: "",
    phone: "",
    address: "",
  },
  selectedClient: {
    id: "",
    name: "",
  },
  sections: {
    Referral: {
      title: "Reason for Referral",
      content: "",
      completed: false,
    },
    Background: {
      title: "Background, Medical & Developmental History",
      content: "",
      completed: false,
    },
    Transition: {
      title: "Transition Planning",
      content: "",
      completed: false,
    },
    Previous: {
      title: "Previous Evaluation Results",
      content: "",
      completed: false,
    },
    Observations: {
      title: "Observations & Strengths",
      content: "",
      completed: false,
    },
    Current: {
      title: "Current Assessment Results",
      content: "",
      completed: false,
    },
    Other: {
      title: "Other Specialty Evaluations",
      content: "",
      completed: false,
    },
    Summary: {
      title: "Summary & Recommendations",
      content: "",
      completed: false,
    },
  },
});

export default function ReportWriter() {
  const [report, dispatch] = useReducer(reportReducer, createEmptyReport());
  const [activeTab, setActiveTab] = useState("Full Report");
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [examinerName, setExaminerName] = useState<string>("Lacy Herbert, Ed.S.");
  const [examinerCredentials, setExaminerCredentials] = useState<string>("School Psychologist");
  const [isRewriting, setIsRewriting] = useState<string>("");

  // Simulate your existing functionality with basic implementations
  const showToast = (title: string, description: string) => {
    console.log(`${title}: ${description}`);
    // In your real app, this would use your toast system
  };

  // Simulate client data - replace with your actual data fetching
  const realClients = [
    { id: "1", name: "Student A", school: "Elementary School", grade: "3rd" },
    { id: "2", name: "Student B", school: "Middle School", grade: "6th" },
    { id: "3", name: "Student C", school: "High School", grade: "9th" },
  ];

  const handleSectionUpdate = useCallback((sectionKey: string, content: string) => {
    dispatch({ type: 'updateSection', sectionKey, content });
  }, []);

  const handleDemographicsUpdate = useCallback((field: string, value: string) => {
    dispatch({ type: 'setDemographic', field, value });
  }, []);

  const handleClientSelect = useCallback((clientId: string) => {
    setSelectedClientId(clientId);
    const selectedClient = realClients.find(client => client.id === clientId);
    if (selectedClient) {
      dispatch({
        type: 'hydrate',
        report: {
          clientId: clientId,
          clientName: selectedClient.name,
          demographics: {
            name: selectedClient.name,
            school: selectedClient.school,
            grade: selectedClient.grade,
            reportDate: new Date().toLocaleDateString(),
            dateOfBirth: "",
            age: "",
            gender: "",
            evaluationType: "Initial Evaluation",
            parent: "",
            phone: "",
            address: "",
          }
        }
      });
    }
  }, [realClients]);

  const validateReport = (): boolean => {
    if (!selectedClientId && !report.clientName && !report.demographics.name) {
      showToast("Client Required", "Please select a client before saving the report.");
      return false;
    }

    const completedSections = Object.values(report.sections).filter((section) =>
      section.content.trim(),
    ).length;
    if (completedSections < 3) {
      showToast("Insufficient Content", "Please complete at least 3 report sections before saving.");
      return false;
    }

    return true;
  };

  const handleSaveReport = () => {
    if (!validateReport()) return;
    showToast("Report Saved", `MET Report for ${report.demographics.name} saved successfully.`);
  };

  const handleAIRewrite = async (sectionKey: string) => {
    const section = report.sections[sectionKey];
    if (!section.content.trim()) {
      showToast("No Content", "Please add some content before using AI rewriting.");
      return;
    }

    setIsRewriting(sectionKey);
    try {
      // Simulate AI rewrite
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const rewrittenContent = `[AI-Enhanced] ${section.content}\n\nThis content has been professionally rewritten for clarity, flow, and clinical appropriateness.`;
      
      handleSectionUpdate(sectionKey, rewrittenContent);
      showToast("Content Rewritten", "Your content has been enhanced for professional clarity and flow.");
    } catch (error) {
      showToast("Rewrite Failed", "Unable to rewrite content. Please try again.");
    } finally {
      setIsRewriting("");
    }
  };

  const handleExportReport = (format: "pdf" | "word") => {
    showToast("Export Started", `Generating ${format.toUpperCase()} report for ${report.demographics.name}...`);
    
    // Simulate export
    setTimeout(() => {
      showToast("Export Complete", `MET Report exported as ${format.toUpperCase()} successfully.`);
    }, 2000);
  };

  return (
    <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="md:col-span-1">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-4">
            <div className="flex items-center mb-4">
              <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14,2 14,8 20,8"></polyline>
              </svg>
              <h3 className="text-lg font-semibold">Related Documents</h3>
            </div>
            
            <div className="space-y-4">
              <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7,10 12,15 17,10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Upload Document
              </button>

              <hr className="border-gray-200" />

              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Client Documents</h4>
                <div className="text-sm text-gray-500">
                  No documents uploaded yet
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="md:col-span-3">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Report Writer</h2>
              <button 
                onClick={handleSaveReport}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 12l-2.44-2.78.34-3.68-3.61-.82-1.89-3.18L12 3 8.6 1.54 6.71 4.72l-3.61.81.34 3.68L1 12l2.44 2.78-.34 3.68 3.61.82 1.89 3.18L12 21l3.4 1.46 1.89-3.18 3.61-.82-.34-3.68L23 12z"/>
                </svg>
                Update Full Report
              </button>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <label htmlFor="client-select" className="text-sm font-medium">Client:</label>
                <select
                  id="client-select"
                  value={selectedClientId}
                  onChange={(e) => handleClientSelect(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm w-64"
                >
                  <option value="">Select a client</option>
                  {realClients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name} - {client.school} (Grade {client.grade})
                    </option>
                  ))}
                </select>
              </div>
              <div className="text-sm text-gray-600">
                Multidisciplinary Evaluation Team (MET) Report
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200 mb-4">
              <nav className="flex space-x-8">
                {["Full Report", "Demographics", "Referral", "Background", "Transition", "Previous", "Observations", "Current", "Other", "Summary"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="mt-4">
              {activeTab === "Full Report" && (
                <div className="space-y-6 max-w-4xl mx-auto">
                  <div className="text-center space-y-4">
                    <div className="flex justify-center items-center gap-4">
                      <div className="w-20 h-20 border-2 border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-500">
                        District Logo
                      </div>
                      <button className="px-3 py-1 border border-gray-300 rounded text-sm">
                        Upload Logo
                      </button>
                    </div>
                    <h1 className="text-xl font-bold">
                      MULTIDISCIPLINARY EVALUATION TEAM (MET) REPORT
                    </h1>
                    <h2 className="text-2xl font-bold tracking-wider">CONFIDENTIAL</h2>
                  </div>

                  {/* Demographics Table */}
                  <div className="border-2 border-black">
                    <table className="w-full border-collapse text-sm">
                      <tbody>
                        <tr>
                          <td className="border-r border-b border-black p-3 font-bold bg-gray-50 w-1/4">STUDENT:</td>
                          <td className="border-r border-b border-black p-3 w-1/4">{report.demographics.name}</td>
                          <td className="border-r border-b border-black p-3 font-bold bg-gray-50 w-1/4">GRADE:</td>
                          <td className="border-b border-black p-3 w-1/4">{report.demographics.grade}</td>
                        </tr>
                        <tr>
                          <td className="border-r border-b border-black p-3 font-bold bg-gray-50">DATE OF BIRTH:</td>
                          <td className="border-r border-b border-black p-3">{report.demographics.dateOfBirth}</td>
                          <td className="border-r border-b border-black p-3 font-bold bg-gray-50">AGE:</td>
                          <td className="border-b border-black p-3">{report.demographics.age}</td>
                        </tr>
                        <tr>
                          <td className="border-r border-b border-black p-3 font-bold bg-gray-50">SCHOOL:</td>
                          <td className="border-r border-b border-black p-3">{report.demographics.school}</td>
                          <td className="border-r border-b border-black p-3 font-bold bg-gray-50">GENDER:</td>
                          <td className="border-b border-black p-3">{report.demographics.gender}</td>
                        </tr>
                        <tr>
                          <td className="border-r border-black p-3 font-bold bg-gray-50">REPORT DATE:</td>
                          <td className="border-r border-black p-3">{report.demographics.reportDate}</td>
                          <td className="border-r border-black p-3 font-bold bg-gray-50">EXAMINER(S):</td>
                          <td className="p-3">{examinerName}, {examinerCredentials}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Report Sections */}
                  {Object.entries(report.sections).map(([key, section]) => (
                    <div key={key} className="space-y-3">
                      <h3 className="text-lg font-bold underline">{section.title.toUpperCase()}</h3>
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {section.content || `[${section.title} content will appear here when completed]`}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "Demographics" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Name</label>
                      <input
                        type="text"
                        value={report.demographics.name}
                        onChange={(e) => handleDemographicsUpdate("name", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Date of Birth</label>
                      <input
                        type="text"
                        value={report.demographics.dateOfBirth}
                        onChange={(e) => handleDemographicsUpdate("dateOfBirth", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">School</label>
                      <input
                        type="text"
                        value={report.demographics.school}
                        onChange={(e) => handleDemographicsUpdate("school", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Grade</label>
                      <input
                        type="text"
                        value={report.demographics.grade}
                        onChange={(e) => handleDemographicsUpdate("grade", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Other Section Tabs */}
              {Object.entries(report.sections).map(([key, section]) => 
                activeTab === key && (
                  <div key={key} className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">{section.title}</h3>
                      <button
                        onClick={() => handleAIRewrite(key)}
                        disabled={isRewriting === key}
                        className="flex items-center px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50"
                      >
                        {isRewriting === key ? (
                          <>
                            <svg className="mr-2 h-3 w-3 animate-spin" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M23 12l-2.44-2.78.34-3.68-3.61-.82-1.89-3.18L12 3 8.6 1.54 6.71 4.72l-3.61.81.34 3.68L1 12l2.44 2.78-.34 3.68 3.61.82 1.89 3.18L12 21l3.4 1.46 1.89-3.18 3.61-.82-.34-3.68L23 12z"/>
                            </svg>
                            Rewriting...
                          </>
                        ) : (
                          <>
                            <svg className="mr-2 h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            </svg>
                            AI Rewrite
                          </>
                        )}
                      </button>
                    </div>
                    <textarea
                      value={section.content}
                      onChange={(e) => handleSectionUpdate(key, e.target.value)}
                      className="w-full h-48 px-3 py-2 border border-gray-300 rounded-md resize-none"
                      placeholder={`Enter ${section.title.toLowerCase()} information here. Use bullet points or notes - AI can help rewrite for professional clarity.`}
                    />
                    <div className="text-xs text-gray-500">
                      Tip: Add your notes or bullet points, then use "AI Rewrite" to transform them into professional clinical language.
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Footer Actions */}
            <div className="flex justify-between mt-6 pt-4 border-t border-gray-200">
              <button 
                onClick={handleSaveReport}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17,21 17,13 7,13 7,21"></polyline>
                  <polyline points="7,3 7,8 15,8"></polyline>
                </svg>
                Save Report
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => handleExportReport("pdf")}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7,10 12,15 17,10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  Export PDF
                </button>
                <button
                  onClick={() => handleExportReport("word")}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7,10 12,15 17,10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  Export Word
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}