
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react"; 
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  User, 
  FileText, 
  MessageSquare, 
  Calendar,
  Clock,
  School,
  Mail,
  Phone,
  Download,
  Trash2
} from "lucide-react";
import { AssessmentsTab } from "@/components/AssessmentsTab";

// Documents Display Component
function DocumentsDisplay({ evaluationId }: { evaluationId: number }) {
  const { data: documents, isLoading, refetch } = useQuery({
    queryKey: ['/api/evaluations', evaluationId, 'documents'],
    queryFn: () => fetch(`/api/evaluations/${evaluationId}/documents`).then(res => res.json()),
    refetchOnWindowFocus: true,
    refetchInterval: 2000 // Refresh every 2 seconds to catch new uploads
  });

  console.log("Documents data:", documents); // Debug log

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading documents...</div>;
  }

  if (!documents || documents.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No documents uploaded yet</p>
        <p className="text-sm">Documents uploaded through Assessments will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {documents.map((doc: any) => (
        <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-blue-600" />
            <div>
              <div className="font-medium">{doc.filename}</div>
              <div className="text-sm text-muted-foreground">
                Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button 
              size="sm" 
              variant="destructive" 
              onClick={async () => {
                if (confirm('Delete this document?')) {
                  try {
                    const response = await fetch(`/api/evaluations/${evaluationId}/documents/${doc.id}`, {
                      method: 'DELETE'
                    });
                    if (response.ok) {
                      refetch(); // Refresh the documents list
                    }
                  } catch (error) {
                    console.error('Delete failed:', error);
                  }
                }
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

const evaluationSchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  pseudonym: z.string().optional(),
  demographics: z
    .object({
      age: z.coerce
        .number()
        .int()
        .positive("Age must be a positive number")
        .optional(),
      grade: z.string().optional(),
    })
    .optional(),
  observations: z.string().optional(),
  rdiResponses: z.string().optional(),
  clinicianNotes: z.string().optional(),
});

type EvaluationFormValues = z.infer<typeof evaluationSchema>;

interface EvaluationDetailProps {
  id: string;
}

const EvaluationDetail: React.FC<EvaluationDetailProps> = ({ id }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showPracticumPopup, setShowPracticumPopup] = useState(false);
  const [assessmentToAdd, setAssessmentToAdd] = useState<any>(null);
  const [notes, setNotes] = useState('');
  
  // Report section states
  const [reportObservations, setReportObservations] = useState('');
  const [reportReferral, setReportReferral] = useState('');
  const [reportBackground, setReportBackground] = useState('');
  const [reportSummary, setReportSummary] = useState('');

  // Fetch evaluation data
  const { data: evaluationsData, isLoading } = useQuery({
    queryKey: ["/api/evaluations"],
    refetchOnWindowFocus: true,
    refetchInterval: 5000, // Refresh every 5 seconds to catch updates
  });

  const evaluation = (evaluationsData as any)?.evaluations?.find((evalData: any) => {
    const evalId = String(evalData.id);
    const searchId = String(id);
    return evalId === searchId;
  });
  
  console.log('Debug - Evaluation data:', evaluation);
  console.log('Debug - ID being searched:', id);
  console.log('Debug - All evaluations:', (evaluationsData as any)?.evaluations);

  // Initialize notes and report sections from evaluation data
  useEffect(() => {
    if (evaluation?.clinicianNotes) {
      setNotes(evaluation.clinicianNotes);
    }
    
    // Initialize report sections from stored data
    if (evaluation?.reportDrafts) {
      try {
        const data = JSON.parse(evaluation.reportDrafts);
        // Handle both old format (single observation) and new format (full sections)
        if (data.section && data.content) {
          // Old format - single observation
          if (data.section === 'observations') {
            setReportObservations(data.content);
          }
        } else {
          // New format - full sections object
          if (data.observations) setReportObservations(data.observations);
          if (data.referral) setReportReferral(data.referral);
          if (data.background) setReportBackground(data.background);
          if (data.summary) setReportSummary(data.summary);
          
          // Load assessment results into the summary section if available
          if (data.assessmentResults) {
            const currentSummary = reportSummary || '';
            const combinedSummary = currentSummary ? 
              `${currentSummary}\n\n${data.assessmentResults}` : 
              data.assessmentResults;
            setReportSummary(combinedSummary);
          }
        }
      } catch (e) {
        // If reportDrafts is not valid JSON, ignore
      }
    }
  }, [evaluation]);

  // Save notes mutation
  const saveNotesMutation = useMutation({
    mutationFn: async (notesData: { notes: string }) => {
      console.log('Debug - Saving notes:', notesData.notes);
      console.log('Debug - Evaluation ID:', id);
      console.log('Debug - Request URL:', `/api/evaluations/${id}`);
      
      const response = await fetch(`/api/evaluations/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clinicianNotes: notesData.notes
        }),
      });
      
      console.log('Debug - Response status:', response.status);
      console.log('Debug - Response OK:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('Debug - Error response:', errorText);
        throw new Error(`Failed to save notes: ${errorText}`);
      }
      
      const result = await response.json();
      console.log('Debug - Save result:', result);
      return result;
    },
    onSuccess: () => {
      toast({
        title: "Notes Saved",
        description: `Clinical notes updated for ${evaluation?.pseudonym || evaluation?.studentId}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/evaluations"] });
    },
    onError: (error) => {
      toast({
        title: "Save Failed",
        description: "Unable to save notes. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSaveNotes = () => {
    saveNotesMutation.mutate({ notes });
  };

  // Save report sections mutation
  const saveReportMutation = useMutation({
    mutationFn: async () => {
      const reportSections = {
        observations: reportObservations,
        referral: reportReferral,
        background: reportBackground,
        summary: reportSummary
      };
      
      const response = await fetch(`/api/evaluations/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportDrafts: JSON.stringify(reportSections)
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save report sections');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Report sections saved",
        description: "Your report content has been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/evaluations"] });
    },
    onError: (error) => {
      toast({
        title: "Error saving report sections",
        description: "There was an error saving your report content. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSaveReportSections = () => {
    saveReportMutation.mutate();
  };

  // Practicum log popup for assessments
  const addToPracticumLog = (assessment: any) => {
    setAssessmentToAdd(assessment);
    setShowPracticumPopup(true);
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className="p-6">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-4">Student Not Found</h1>
          <p>No student found with ID: {id}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Student Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-2xl">{evaluation.pseudonym || evaluation.studentId}</CardTitle>
                <div className="flex items-center space-x-4 text-muted-foreground mt-2">
                  <div className="flex items-center space-x-1">
                    <School className="h-4 w-4" />
                    <span>{evaluation.school}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>Grade {evaluation.grade}</span>
                  </div>
                  <Badge variant={evaluation.status === 'completed' ? 'secondary' : 'default'}>
                    {evaluation.status}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Mail className="h-4 w-4 mr-2" />
                Send Message
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Student Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Student ID:</span>
                  <span>{evaluation.studentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pseudonym:</span>
                  <span>{evaluation.pseudonym || 'Not set'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Age:</span>
                  <span>{evaluation.demographics?.age || 'Unknown'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service Type:</span>
                  <span>{evaluation.service}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Staff:</span>
                  <span>{evaluation.staff}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Permission Date:</span>
                  <span>{evaluation.permissionDate || 'Not set'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Log Date:</span>
                  <span>{evaluation.logDate || 'Not set'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Due Date:</span>
                  <span>{evaluation.dueDate || 'Not set'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Eligibility Date:</span>
                  <span>{evaluation.eligibilityDate || 'Not set'}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Assessments:</span>
                  <span>0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reports Generated:</span>
                  <span>0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Messages:</span>
                  <span>0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Activity:</span>
                  <span>{evaluation.createdAt ? new Date(evaluation.createdAt).toLocaleDateString() : 'Unknown'}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="assessments">
          <Card>
            <CardHeader>
              <CardTitle>Assessments</CardTitle>
            </CardHeader>
            <CardContent>
              <AssessmentsTab 
                evaluationId={id}
                initialAssessments={evaluation?.assessments || []}
                onSave={async (assessments) => {
                  try {
                    // Save assessments to the evaluation
                    const response = await fetch(`/api/evaluations/${id}`, {
                      method: 'PATCH',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        assessments: assessments
                      }),
                    });

                    if (!response.ok) {
                      throw new Error('Failed to save assessments');
                    }

                    // Refetch evaluation data to update the UI
                    queryClient.invalidateQueries({ queryKey: ['/api/evaluations', id] });
                    
                    toast({
                      title: "Assessments saved",
                      description: `Successfully saved ${assessments.length} assessment(s)`,
                    });

                    // When assessment is added, show practicum popup
                    if (assessments.length > 0) {
                      const lastAssessment = assessments[assessments.length - 1];
                      addToPracticumLog(lastAssessment);
                    }
                  } catch (error) {
                    console.error('Error saving assessments:', error);
                    toast({
                      title: "Error saving assessments",
                      description: "Please try again",
                      variant: "destructive",
                    });
                  }
                }} 
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Uploaded Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              {evaluation?.id && <DocumentsDisplay evaluationId={evaluation.id} />}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Report Sections</CardTitle>
              <Button 
                onClick={() => {
                  // Extract report sections from timestamped notes
                  const extractReportSections = (notes: string) => {
                    const sections = {
                      observations: reportObservations,
                      referral: reportReferral,
                      background: reportBackground,
                      summary: reportSummary
                    };
                    
                    if (notes) {
                      const lines = notes.split('\n');
                      lines.forEach(line => {
                        if (line.includes('[REPORT-OBSERVATIONS]')) {
                          const content = line.replace(/^\[.*?\]\s*\[REPORT-OBSERVATIONS\]\s*/, '');
                          if (content && !sections.observations) {
                            sections.observations = content;
                          }
                        }
                        if (line.includes('[REPORT-REFERRAL]')) {
                          const content = line.replace(/^\[.*?\]\s*\[REPORT-REFERRAL\]\s*/, '');
                          if (content && !sections.referral) {
                            sections.referral = content;
                          }
                        }
                        if (line.includes('[REPORT-BACKGROUND]')) {
                          const content = line.replace(/^\[.*?\]\s*\[REPORT-BACKGROUND\]\s*/, '');
                          if (content && !sections.background) {
                            sections.background = content;
                          }
                        }
                        if (line.includes('[REPORT-SUMMARY]')) {
                          const content = line.replace(/^\[.*?\]\s*\[REPORT-SUMMARY\]\s*/, '');
                          if (content && !sections.summary) {
                            sections.summary = content;
                          }
                        }
                        if (line.includes('[REPORT-PREVIOUS]')) {
                          const content = line.replace(/^\[.*?\]\s*\[REPORT-PREVIOUS\]\s*/, '');
                          if (content && !sections.summary) {
                            sections.summary = content;
                          }
                        }
                        if (line.includes('[REPORT-CURRENT]')) {
                          const content = line.replace(/^\[.*?\]\s*\[REPORT-CURRENT\]\s*/, '');
                          if (content && !sections.summary) {
                            sections.summary = content;
                          }
                        }
                        if (line.includes('[REPORT-TRANSITION]')) {
                          const content = line.replace(/^\[.*?\]\s*\[REPORT-TRANSITION\]\s*/, '');
                          if (content && !sections.summary) {
                            sections.summary = content;
                          }
                        }
                        if (line.includes('[REPORT-OTHER]')) {
                          const content = line.replace(/^\[.*?\]\s*\[REPORT-OTHER\]\s*/, '');
                          if (content && !sections.summary) {
                            sections.summary = content;
                          }
                        }
                      });
                    }
                    
                    return sections;
                  };
                  
                  const reportSections = extractReportSections(evaluation?.clinicianNotes || '');
                  
                  localStorage.setItem('selectedStudent', JSON.stringify({
                    id: evaluation.id,
                    name: evaluation.pseudonym || evaluation.studentId,
                    reportSections,
                    demographics: {
                      name: evaluation.pseudonym || evaluation.studentId,
                      school: evaluation.school || '',
                      grade: evaluation.grade || '',
                      service: evaluation.service || '',
                      logDate: evaluation.logDate || '',
                      dueDate: evaluation.dueDate || ''
                    },
                    assessments: evaluation.assessments || [],
                    observations: evaluation.observations || '',
                    notes: evaluation.clinicianNotes || ''
                  }));
                  window.open('/evaluations/report-writer', '_blank');
                }}
              >
                <FileText className="h-4 w-4 mr-2" />
                Generate Report for {evaluation?.pseudonym || evaluation?.studentId}
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Evaluation Progress Tracker */}
              <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                <h4 className="font-medium text-sm">Evaluation Progress</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="space-y-1">
                    <div className="text-muted-foreground">Permission Date</div>
                    <div className="font-medium">{evaluation?.permissionDate || 'Not set'}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground">Due Date</div>
                    <div className="font-medium">{evaluation?.dueDate || 'Not set'}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground">Status</div>
                    <Badge variant={evaluation?.status === 'completed' ? 'default' : 'secondary'}>
                      {evaluation?.status === 'completed' ? 'Completed' : 'In Progress'}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground">Days Remaining</div>
                    <div className="font-medium">
                      {evaluation?.dueDate ? 
                        Math.ceil((new Date(evaluation.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) 
                        : 'N/A'} days
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                
                {/* Daily Hub Workflow Info */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Report Content Workflow</h4>
                  <p className="text-blue-800 dark:text-blue-200 text-sm mb-3">
                    Use Daily Hub to add observations and report sections. Your notes will automatically appear here and transfer to the Report Writer when you generate a report.
                  </p>
                  <div className="text-xs text-blue-600 dark:text-blue-300">
                    <strong>How it works:</strong>
                    <br />1. Go to Daily Hub and select this student
                    <br />2. Choose "Report Section" and pick the section type
                    <br />3. Add your content and save
                    <br />4. Content automatically appears here and in Report Writer
                  </div>
                </div>
                
                {/* Show only REPORT SECTION notes */}
                {evaluation?.clinicianNotes && (() => {
                  const reportSectionNotes = evaluation.clinicianNotes
                    .split('\n')
                    .filter((line: string) => line.includes('[REPORT-'))
                    .join('\n');
                  
                  return reportSectionNotes ? (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium">Report Section Content from Daily Hub</label>
                        <Button size="sm" variant="outline" onClick={() => {
                          // Extract report sections from notes - accumulate all entries for each section
                          const extractSections = (notes: string) => {
                            const sections = { 
                              Observations: '', Referral: '', Background: '', Summary: '',
                              Current: '', Previous: '', Transition: '', Other: ''
                            };
                            if (notes) {
                              const lines = notes.split('\n');
                              lines.forEach((line: string) => {
                                // Debug log to see what we're processing
                                console.log('Processing line:', line);
                                
                                if (line.includes('[REPORT-OBSERVATIONS]')) {
                                  const content = line.split('[REPORT-OBSERVATIONS]')[1]?.trim() || '';
                                  sections.Observations = sections.Observations ? sections.Observations + '\n' + content : content;
                                  console.log('Extracted Observations:', content);
                                }
                                if (line.includes('[REPORT-REFERRAL]')) {
                                  const content = line.split('[REPORT-REFERRAL]')[1]?.trim() || '';
                                  sections.Referral = sections.Referral ? sections.Referral + '\n' + content : content;
                                  console.log('Extracted Referral:', content);
                                }
                                if (line.includes('[REPORT-BACKGROUND]')) {
                                  const content = line.split('[REPORT-BACKGROUND]')[1]?.trim() || '';
                                  sections.Background = sections.Background ? sections.Background + '\n' + content : content;
                                  console.log('Extracted Background:', content);
                                }
                                if (line.includes('[REPORT-SUMMARY]')) {
                                  const content = line.split('[REPORT-SUMMARY]')[1]?.trim() || '';
                                  sections.Summary = sections.Summary ? sections.Summary + '\n' + content : content;
                                  console.log('Extracted Summary:', content);
                                }
                                if (line.includes('[REPORT-CURRENT]')) {
                                  const content = line.split('[REPORT-CURRENT]')[1]?.trim() || '';
                                  sections.Current = sections.Current ? sections.Current + '\n' + content : content;
                                  console.log('Extracted Current:', content);
                                }
                                if (line.includes('[REPORT-PREVIOUS]')) {
                                  const content = line.split('[REPORT-PREVIOUS]')[1]?.trim() || '';
                                  sections.Previous = sections.Previous ? sections.Previous + '\n' + content : content;
                                  console.log('Extracted Previous:', content);
                                }
                                if (line.includes('[REPORT-TRANSITION]')) {
                                  const content = line.split('[REPORT-TRANSITION]')[1]?.trim() || '';
                                  sections.Transition = sections.Transition ? sections.Transition + '\n' + content : content;
                                  console.log('Extracted Transition:', content);
                                }
                                if (line.includes('[REPORT-OTHER]')) {
                                  const content = line.split('[REPORT-OTHER]')[1]?.trim() || '';
                                  sections.Other = sections.Other ? sections.Other + '\n' + content : content;
                                  console.log('Extracted Other:', content);
                                }
                              });
                            }
                            console.log('Final extracted sections:', sections);
                            return sections;
                          };
                          
                          const extractedSections = extractSections(evaluation.clinicianNotes || '');
                          console.log('=== VIEW DRAFT DEBUG ===');
                          console.log('Raw clinician notes:', evaluation.clinicianNotes);
                          console.log('Extracted sections:', extractedSections);
                          
                          // Create proper sections structure that matches Report Writer
                          const reportSections = {
                            Referral: {
                              title: "Reason for Referral",
                              content: extractedSections.Referral || '',
                              completed: !!extractedSections.Referral
                            },
                            Background: {
                              title: "Background, Medical & Developmental History",
                              content: extractedSections.Background || '',
                              completed: !!extractedSections.Background
                            },
                            Transition: {
                              title: "Transition Planning",
                              content: extractedSections.Transition || '',
                              completed: !!extractedSections.Transition
                            },
                            Previous: {
                              title: "Previous Evaluation Results",
                              content: extractedSections.Previous || '',
                              completed: !!extractedSections.Previous
                            },
                            Observations: {
                              title: "Observations & Strengths",
                              content: extractedSections.Observations || '',
                              completed: !!extractedSections.Observations
                            },
                            Current: {
                              title: "Current Assessment Results",
                              content: extractedSections.Current || '',
                              completed: !!extractedSections.Current
                            },
                            Other: {
                              title: "Other Specialty Evaluations",
                              content: extractedSections.Other || '',
                              completed: !!extractedSections.Other
                            },
                            Summary: {
                              title: "Summary & Recommendations",
                              content: extractedSections.Summary || '',
                              completed: !!extractedSections.Summary
                            }
                          };

                          localStorage.setItem('selectedStudent', JSON.stringify({
                            id: evaluation.id,
                            name: evaluation.pseudonym || evaluation.studentId,
                            sections: reportSections,
                            demographics: {
                              name: evaluation.pseudonym || evaluation.studentId,
                              dateOfBirth: evaluation.dateOfBirth || '',
                              age: evaluation.age || '',
                              gender: evaluation.gender || '',
                              school: evaluation.school || '',
                              grade: evaluation.grade || '',
                            }
                          }));
                          window.open(`/evaluations/report-writer?clientId=${evaluation.id}&autoSelect=true`, '_blank');
                        }}>
                          View Draft
                        </Button>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-sm whitespace-pre-wrap border">
                        {reportSectionNotes}
                      </div>
                    </div>
                  ) : null;
                })()}

              </div>

              {/* Previous Evaluations & Report Versions */}
              <div className="mt-8 space-y-4">
                <h4 className="font-medium text-sm">Previous Evaluations & Reports</h4>
                <div className="border rounded-lg p-4">
                  <div className="text-sm text-muted-foreground mb-3">
                    Previous evaluation history and report drafts for {evaluation?.pseudonym || evaluation?.studentId}
                  </div>
                  
                  {/* Example previous evaluation entry */}
                  {evaluation?.eligibilityDate && (
                    <div className="space-y-2 border-l-2 border-primary pl-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-sm">Initial Evaluation - Completed</div>
                          <div className="text-sm text-muted-foreground">
                            Eligibility Date: {evaluation.eligibilityDate}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Decision: {evaluation.eligibilityDecision || 'Not specified'}
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          View Report
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {/* Current evaluation */}
                  <div className="space-y-2 border-l-2 border-blue-500 pl-4 mt-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-sm">Current Evaluation - In Progress</div>
                        <div className="text-sm text-muted-foreground">
                          Started: {evaluation?.permissionDate || 'Permission date not set'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Due: {evaluation?.dueDate || 'Due date not set'}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => {
                          // Extract report sections from notes - accumulate all entries for each section
                          const extractSections = (notes: string) => {
                            const sections = { 
                              Observations: '', Referral: '', Background: '', Summary: '',
                              Current: '', Previous: '', Transition: '', Other: ''
                            };
                            if (notes) {
                              const lines = notes.split('\n');
                              lines.forEach((line: string) => {
                                // Debug log to see what we're processing
                                console.log('Processing line:', line);
                                
                                if (line.includes('[REPORT-OBSERVATIONS]')) {
                                  const content = line.split('[REPORT-OBSERVATIONS]')[1]?.trim() || '';
                                  sections.Observations = sections.Observations ? sections.Observations + '\n' + content : content;
                                  console.log('Extracted Observations:', content);
                                }
                                if (line.includes('[REPORT-REFERRAL]')) {
                                  const content = line.split('[REPORT-REFERRAL]')[1]?.trim() || '';
                                  sections.Referral = sections.Referral ? sections.Referral + '\n' + content : content;
                                  console.log('Extracted Referral:', content);
                                }
                                if (line.includes('[REPORT-BACKGROUND]')) {
                                  const content = line.split('[REPORT-BACKGROUND]')[1]?.trim() || '';
                                  sections.Background = sections.Background ? sections.Background + '\n' + content : content;
                                  console.log('Extracted Background:', content);
                                }
                                if (line.includes('[REPORT-SUMMARY]')) {
                                  const content = line.split('[REPORT-SUMMARY]')[1]?.trim() || '';
                                  sections.Summary = sections.Summary ? sections.Summary + '\n' + content : content;
                                  console.log('Extracted Summary:', content);
                                }
                                if (line.includes('[REPORT-CURRENT]')) {
                                  const content = line.split('[REPORT-CURRENT]')[1]?.trim() || '';
                                  sections.Current = sections.Current ? sections.Current + '\n' + content : content;
                                  console.log('Extracted Current:', content);
                                }
                                if (line.includes('[REPORT-PREVIOUS]')) {
                                  const content = line.split('[REPORT-PREVIOUS]')[1]?.trim() || '';
                                  sections.Previous = sections.Previous ? sections.Previous + '\n' + content : content;
                                  console.log('Extracted Previous:', content);
                                }
                                if (line.includes('[REPORT-TRANSITION]')) {
                                  const content = line.split('[REPORT-TRANSITION]')[1]?.trim() || '';
                                  sections.Transition = sections.Transition ? sections.Transition + '\n' + content : content;
                                  console.log('Extracted Transition:', content);
                                }
                                if (line.includes('[REPORT-OTHER]')) {
                                  const content = line.split('[REPORT-OTHER]')[1]?.trim() || '';
                                  sections.Other = sections.Other ? sections.Other + '\n' + content : content;
                                  console.log('Extracted Other:', content);
                                }
                              });
                            }
                            console.log('Final extracted sections:', sections);
                            return sections;
                          };
                          
                          const extractedSections = extractSections(evaluation.clinicianNotes || '');
                          console.log('=== VIEW DRAFT DEBUG ===');
                          console.log('Raw clinician notes:', evaluation.clinicianNotes);
                          console.log('Extracted sections:', extractedSections);
                          
                          // Create proper sections structure that matches Report Writer
                          const reportSections = {
                            Referral: {
                              title: "Reason for Referral",
                              content: extractedSections.Referral || '',
                              completed: !!extractedSections.Referral
                            },
                            Background: {
                              title: "Background, Medical & Developmental History",
                              content: extractedSections.Background || '',
                              completed: !!extractedSections.Background
                            },
                            Transition: {
                              title: "Transition Planning",
                              content: extractedSections.Transition || '',
                              completed: !!extractedSections.Transition
                            },
                            Previous: {
                              title: "Previous Evaluation Results",
                              content: extractedSections.Previous || '',
                              completed: !!extractedSections.Previous
                            },
                            Observations: {
                              title: "Observations & Strengths",
                              content: extractedSections.Observations || '',
                              completed: !!extractedSections.Observations
                            },
                            Current: {
                              title: "Current Assessment Results",
                              content: extractedSections.Current || '',
                              completed: !!extractedSections.Current
                            },
                            Other: {
                              title: "Other Specialty Evaluations",
                              content: extractedSections.Other || '',
                              completed: !!extractedSections.Other
                            },
                            Summary: {
                              title: "Summary & Recommendations",
                              content: extractedSections.Summary || '',
                              completed: !!extractedSections.Summary
                            }
                          };

                          localStorage.setItem('selectedStudent', JSON.stringify({
                            id: evaluation.id,
                            name: evaluation.pseudonym || evaluation.studentId,
                            sections: reportSections,
                            demographics: {
                              name: evaluation.pseudonym || evaluation.studentId,
                              school: evaluation.school || '',
                              grade: evaluation.grade || '',
                              service: evaluation.service || '',
                              logDate: evaluation.logDate || '',
                              dueDate: evaluation.dueDate || ''
                            },
                            assessments: evaluation.assessments || [],
                            observations: evaluation.observations || '',
                            notes: evaluation.clinicianNotes || ''
                          }));
                          window.open('/evaluations/report-writer', '_blank');
                        }}>
                          <FileText className="h-4 w-4 mr-1" />
                          View Draft
                        </Button>
                        <Badge variant="secondary">Draft</Badge>
                      </div>
                    </div>
                  </div>
                  
                  {/* Evaluation Versions */}
                  <div className="mt-4 space-y-2">
                    <h5 className="font-medium text-sm">Evaluation Versions:</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                        <span>v2 – Edited {new Date().toLocaleDateString()} by Dr. Miller</span>
                        <Button size="sm" variant="outline">Restore</Button>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                        <span>v1 – Created {evaluation?.permissionDate || '2/12/25'} by Dr. Miller</span>
                        <Button size="sm" variant="outline">Restore</Button>
                      </div>
                    </div>
                  </div>
                  
                  {!evaluation?.eligibilityDate && (
                    <div className="text-center py-4 text-muted-foreground text-sm">
                      No previous evaluations found for this student
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle>Messages & Communications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No messages yet</p>
                <Button className="mt-4">Send Message</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Clinical Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea 
                placeholder="Add clinical notes for this student..."
                className="min-h-[200px]"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  Notes for: {evaluation?.pseudonym || evaluation?.studentId}
                </div>
                <Button 
                  onClick={handleSaveNotes}
                  disabled={saveNotesMutation.isPending}
                >
                  {saveNotesMutation.isPending ? 'Saving...' : 'Save Notes'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Practicum Log Popup */}
      <Dialog open={showPracticumPopup} onOpenChange={setShowPracticumPopup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Practicum Log?</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Would you like to add this assessment to your practicum log?</p>
            {assessmentToAdd && (
              <Card className="p-4 bg-muted/50">
                <p><strong>Assessment:</strong> {assessmentToAdd.instrument}</p>
                <p><strong>Estimated Time:</strong> {getEstimatedTime(assessmentToAdd.instrument)} minutes</p>
              </Card>
            )}
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowPracticumPopup(false)}>
                Skip
              </Button>
              <Button onClick={async () => {
                if (assessmentToAdd) {
                  try {
                    // Create practicum log entry
                    const estimatedTime = getEstimatedTime(assessmentToAdd.instrument);
                    const currentDate = new Date().toISOString().split('T')[0];
                    const startTime = "09:00";
                    const endTime = `${Math.floor(9 + estimatedTime/60)}:${String((estimatedTime % 60)).padStart(2, '0')}`;
                    
                    const practicumEntry = {
                      date: currentDate,
                      startTime: startTime,
                      endTime: endTime,
                      totalHours: estimatedTime / 60,
                      studentName: evaluation?.pseudonym || evaluation?.studentId || '',
                      school: evaluation?.school || '',
                      grade: evaluation?.grade || '',
                      age: '',
                      teacher: '',
                      activityType: 'Assessment Administration',
                      location: 'School',
                      description: `Administered ${assessmentToAdd.instrument} assessment`,
                      assessmentType: 'Cognitive/Academic',
                      testAdministered: assessmentToAdd.instrument,
                      supervisor: 'Dr. Miller',
                      supervisionType: 'Direct',
                      notes: `Assessment completed: ${assessmentToAdd.instrument}`,
                      reflection: '',
                      learningObjectives: ''
                    };

                    const response = await fetch('/api/practicum-log', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(practicumEntry),
                    });

                    if (response.ok) {
                      toast({
                        title: "Added to Practicum Log",
                        description: `${estimatedTime} minutes logged for ${assessmentToAdd.instrument} assessment.`,
                      });
                    } else {
                      throw new Error('Failed to save to practicum log');
                    }
                  } catch (error) {
                    toast({
                      title: "Error",
                      description: "Failed to add to practicum log. You can add it manually.",
                      variant: "destructive",
                    });
                  }
                }
                setShowPracticumPopup(false);
              }}>
                Add to Log
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Helper function to estimate assessment time
const getEstimatedTime = (instrument: string) => {
  const timeEstimates: Record<string, number> = {
    'WISC-V': 90,
    'WIAT-4': 120,
    'BASC-3': 60,
    'Conners': 45,
    'CBCL': 30,
    'Default': 60
  };
  
  return timeEstimates[instrument] || timeEstimates['Default'];
};

export default EvaluationDetail;
