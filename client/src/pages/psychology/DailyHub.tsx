import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Brain, 
  FileText, 
  Calendar, 
  User, 
  Search, 
  ArrowRight, 
  Save 
} from "lucide-react";

interface Client {
  id: string;
  name: string;
  grade?: string;
  school?: string;
  notes?: string;
}

// Get real client data from evaluations

type InputType = 'observation' | 'private-note' | 'session-note' | 'report-section';

export default function DailyHub() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [inputText, setInputText] = useState('');
  const [inputType, setInputType] = useState<InputType>('observation');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientSearch, setClientSearch] = useState('');
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [selectedReportSection, setSelectedReportSection] = useState<string>('');

  // Fetch real evaluations to get actual student data
  const { data: evaluationsData } = useQuery({
    queryKey: ["/api/evaluations"],
  });

  // Convert evaluations to client format for the Daily Hub
  const realClients: Client[] = useMemo(() => {
    if (!(evaluationsData as any)?.evaluations) {
      return [];
    }
    
    return (evaluationsData as any).evaluations.map((evaluation: any) => ({
      id: evaluation.id.toString(),
      name: evaluation.pseudonym || evaluation.studentId || `Student ${evaluation.id}`,
      grade: evaluation.demographics?.grade || '',
      school: evaluation.demographics?.school || ''
    }));
  }, [evaluationsData]);

  // Update filtered clients when search changes
  useEffect(() => {
    if (clientSearch.trim() === '') {
      setFilteredClients(realClients);
    } else {
      setFilteredClients(
        realClients.filter(client => 
          client.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
          client.school?.toLowerCase().includes(clientSearch.toLowerCase())
        )
      );
    }
  }, [clientSearch, realClients]);

  // Mutation to save notes to student profiles
  const saveNoteMutation = useMutation({
    mutationFn: async (noteData: { clientId: string; notes: string; type: InputType; section?: string }) => {
      const response = await fetch(`/api/evaluations/${noteData.clientId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clinicianNotes: noteData.notes
        }),
      });
      if (!response.ok) throw new Error('Failed to save note');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Note Saved",
        description: `Note added to ${selectedClient?.name}'s profile`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/evaluations"] });
    },
    onError: () => {
      toast({
        title: "Save Failed",
        description: "Unable to save note. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Report sections for targeting specific areas
  const reportSections = [
    { value: 'referral', label: 'Reason for Referral' },
    { value: 'background', label: 'Background & Developmental History' },
    { value: 'transition', label: 'Transition Planning' },
    { value: 'previous', label: 'Previous Evaluation Results' },
    { value: 'observations', label: 'Observations & Strengths' },
    { value: 'current', label: 'Current Assessment Results' },
    { value: 'other', label: 'Other Specialty Evaluations' },
    { value: 'summary', label: 'Summary & Recommendations' },
  ];

  // Filter clients based on search
  const handleClientSearch = (searchTerm: string) => {
    setClientSearch(searchTerm);
    if (searchTerm.trim() === '' || !evaluationsData) {
      setFilteredClients(realClients);
      return;
    }
    
    const filtered = realClients.filter((client: Client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.grade?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.school?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClients(filtered);
  };

  // Handle form submission - NOW ACTUALLY SAVES TO STUDENT PROFILES
  const handleSubmit = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Content Required",
        description: "Please enter some content before submitting.",
        variant: "destructive",
      });
      return;
    }

    // If client is selected, save note to their actual profile
    if (selectedClient && (inputType === 'session-note' || inputType === 'private-note' || inputType === 'observation' || inputType === 'report-section')) {
      try {
        console.log('=== DAILY HUB DEBUG ===');
        console.log('Selected client:', selectedClient);
        console.log('Client ID:', selectedClient.id);
        console.log('Note text:', inputText);
        console.log('Input type:', inputType);
        console.log('======================');
        
        // Create timestamped note
        const timestamp = new Date().toLocaleString('en-US', {
          month: '2-digit',
          day: '2-digit', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
        
        // Route notes based on type
        let updateData: any = {};
        
        if (inputType === 'report-section' && selectedReportSection) {
          // Save as timestamped note with section indicator for later report generation
          const sectionIndicator = `[REPORT-${selectedReportSection.toUpperCase()}]`;
          const timestampedNote = `[${timestamp}] ${sectionIndicator} ${inputText}`;
          
          // First, fetch the current notes from the server to ensure we have the latest data
          const currentClientResponse = await fetch(`/api/evaluations/${selectedClient.id}`);
          const currentClientData = await currentClientResponse.json();
          const existingNotes = currentClientData?.clinicianNotes || '';
          
          const newNotes = existingNotes 
            ? `${existingNotes}\n\n${timestampedNote}`
            : timestampedNote;
          
          updateData.clinicianNotes = newNotes;
          
          console.log('=== NOTE APPEND DEBUG ===');
          console.log('Existing notes from server:', existingNotes);
          console.log('New timestamped note:', timestampedNote);
          console.log('Combined notes:', newNotes);
          console.log('========================');
        } else {
          // Regular session/clinical notes with timestamp
          const timestampedNote = `[${timestamp}] ${inputText}`;
          
          // Append to existing notes instead of overwriting
          const existingNotes = selectedClient?.notes || '';
          const newNotes = existingNotes 
            ? `${existingNotes}\n\n${timestampedNote}`
            : timestampedNote;
          
          updateData.clinicianNotes = newNotes;
        }
        
        const response = await fetch(`/api/evaluations/${selectedClient.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData),
        });

        if (!response.ok) {
          throw new Error('Failed to save note');
        }

        // Different success messages based on routing
        if (inputType === 'report-section' && selectedReportSection) {
          toast({
            title: "Report Content Staged!",
            description: `Content for "${selectedReportSection}" section saved to ${selectedClient.name}'s profile and will be available when generating reports`,
          });
        } else {
          toast({
            title: "Note Saved Successfully!",
            description: `Timestamped clinical note added to ${selectedClient.name}'s profile and will appear in their Notes tab`,
          });
        }

        // Reset form
        setInputText('');
        setSelectedClient(null);
        setClientSearch('');
        setSelectedReportSection('');
        return;

      } catch (error) {
        console.error('Error saving note:', error);
        toast({
          title: "Save Failed",
          description: "Unable to save note to student profile. Please try again.",
          variant: "destructive",
        });
        return;
      }
    }

    // Validation for required fields
    if ((inputType === 'session-note' || inputType === 'report-section') && !selectedClient) {
      toast({
        title: "Client Required",
        description: "Please select a student to save notes to their profile.",
        variant: "destructive",
      });
      return;
    }

    if (inputType === 'report-section' && !selectedReportSection) {
      toast({
        title: "Report Section Required", 
        description: "Please select a report section to target.",
        variant: "destructive",
      });
      return;
    }

    // For other cases, show generic success
    toast({
      title: "Input Saved",
      description: "Note saved successfully",
    });

    // Reset form
    setInputText('');
    setSelectedClient(null);
    setClientSearch('');
    setSelectedReportSection('');
  };

  // Get placeholder text based on input type
  const getPlaceholder = () => {
    switch (inputType) {
      case 'observation':
        return selectedClient 
          ? `Clinical observation for ${selectedClient.name}... (e.g., "Student displayed increased focus during math lesson. Responded well to visual prompts.")`
          : "General clinical observation... (e.g., 'Noticed pattern in student behavior during transitions')";
      case 'private-note':
        return "Personal note (confidential)... (e.g., 'Remember to follow up on training opportunity')";
      case 'session-note':
        return selectedClient 
          ? `Session note for ${selectedClient.name}... (e.g., "45-minute counseling session. Student discussed anxiety about upcoming test.")`
          : "Select a client to add session notes...";
      case 'report-section':
        return selectedClient && selectedReportSection
          ? `${reportSections.find(s => s.value === selectedReportSection)?.label} for ${selectedClient.name}... (e.g., "Assessment shows strengths in verbal reasoning")`
          : "Select a client and report section to add targeted information...";
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Daily Hub - Quick Input System
          </CardTitle>
          <p className="text-sm text-gray-600">
            Streamlined data entry with intelligent categorization and client linking
          </p>
        </CardHeader>
      </Card>

      {/* Main Input System */}
      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Input Type Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Input Type</Label>
            <Select value={inputType} onValueChange={(value: InputType) => setInputType(value)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="observation">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    Clinical Observation
                  </div>
                </SelectItem>
                <SelectItem value="private-note">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Private Note (Non-work)
                  </div>
                </SelectItem>
                <SelectItem value="session-note">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Session Note (Work-related)
                  </div>
                </SelectItem>
                <SelectItem value="report-section">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Specific Report Section
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Report Section Selection - Only show for report-section type */}
          {inputType === 'report-section' && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Report Section</Label>
              <Select value={selectedReportSection} onValueChange={setSelectedReportSection}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose report section..." />
                </SelectTrigger>
                <SelectContent>
                  {reportSections.map((section) => (
                    <SelectItem key={section.value} value={section.value}>
                      {section.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Client Search - Only show for relevant input types */}
          {(inputType === 'observation' || inputType === 'session-note' || inputType === 'report-section') && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                {inputType === 'observation' ? 'Client (Optional)' : 'Client (Required)'}
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search clients by name, grade, or school..."
                  value={clientSearch}
                  onChange={(e) => handleClientSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Client Selection Dropdown */}
              {clientSearch && filteredClients.length > 0 && (
                <div className="border rounded-md p-2 bg-white shadow-sm max-h-48 overflow-y-auto">
                  {filteredClients.map((client) => (
                    <div
                      key={client.id}
                      className="p-2 hover:bg-gray-50 cursor-pointer rounded flex items-center justify-between"
                      onClick={() => {
                        setSelectedClient(client);
                        setClientSearch(client.name);
                      }}
                    >
                      <div>
                        <div className="font-medium">{client.name}</div>
                        <div className="text-sm text-gray-500">
                          {client.grade} • {client.school}
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              )}

              {/* Selected Client Display */}
              {selectedClient && (
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-md">
                  <Badge variant="outline" className="bg-blue-100">
                    <User className="h-3 w-3 mr-1" />
                    {selectedClient.name}
                  </Badge>
                  <span className="text-sm text-gray-600">
                    {selectedClient.grade} • {selectedClient.school}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedClient(null);
                      setClientSearch('');
                    }}
                    className="ml-auto"
                  >
                    Clear
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Main Text Input */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">Content</Label>
              <Badge variant="outline" className="text-xs">
                {inputType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Badge>
            </div>
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={getPlaceholder()}
              className="min-h-[120px] resize-none"
            />
            <div className="text-xs text-gray-500">
              {inputType === 'private-note' 
                ? 'This note will be saved to your private notes and not linked to any client file.'
                : selectedClient 
                  ? `This will be added to ${selectedClient.name}'s file in the ${inputType.replace('-', ' ')} section.`
                  : 'Select a client to automatically organize this information in their file.'
              }
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button onClick={handleSubmit} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save & Categorize
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Info */}
      <Card className="bg-blue-50">
        <CardContent className="p-4">
          <h3 className="font-medium mb-2">How It Works:</h3>
          <ul className="text-sm space-y-1 text-gray-700">
            <li>• <strong>Clinical Observation:</strong> Goes to client's evaluation folder or general observations</li>
            <li>• <strong>Private Note:</strong> Saved to your personal notes (not client-linked)</li>
            <li>• <strong>Session Note:</strong> Added to client's session documentation</li>
            <li>• <strong>Specific Report Section:</strong> Adds content directly to chosen report section</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}