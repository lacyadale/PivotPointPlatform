import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { 
  MailIcon, 
  Users, 
  Calendar as CalendarIcon, 
  Settings, 
  PlusCircle, 
  Save,
  ArrowRightCircle,
  Clock,
  RotateCw,
  Edit,
  CheckSquare,
  XCircle,
  Send 
} from "lucide-react";

// Mock client data
const mockClients = [
  { id: 1, name: "Jacob Smith", email: "jsmith@example.com", phone: "555-123-4567" },
  { id: 2, name: "Emma Johnson", email: "ejohnson@example.com", phone: "555-234-5678" },
  { id: 3, name: "Noah Williams", email: "nwilliams@example.com", phone: "555-345-6789" },
  { id: 4, name: "Olivia Brown", email: "obrown@example.com", phone: "555-456-7890" },
  { id: 5, name: "Liam Davis", email: "ldavis@example.com", phone: "555-567-8901" }
];

// Mock email templates
const mockTemplates = [
  {
    id: 1,
    name: "Appointment Reminder",
    subject: "Reminder: Your Upcoming Appointment",
    body: `Dear {{client_name}},

This is a friendly reminder that you have an appointment scheduled for {{appointment_date}} at {{appointment_time}}.

Please arrive 10 minutes early to complete any necessary paperwork. If you need to reschedule, please contact us at least 24 hours in advance.

Looking forward to seeing you!

Best regards,
The ThoughtSync Team`,
    category: "appointments"
  },
  {
    id: 2,
    name: "Assessment Results Available",
    subject: "Your Assessment Results Are Ready",
    body: `Dear {{client_name}},

We're pleased to inform you that the results from your recent assessment are now available for review.

You can access your secure report by logging into your portal account. If you have any questions about the findings, please don't hesitate to schedule a follow-up consultation.

Thank you for your patience during this process.

Best regards,
The ThoughtSync Team`,
    category: "reports"
  },
  {
    id: 3,
    name: "Payment Receipt",
    subject: "Receipt for Your Recent Payment",
    body: `Dear {{client_name}},

Thank you for your recent payment of {{payment_amount}} received on {{payment_date}}.

This email serves as your official receipt. Your support allows us to continue providing quality services.

If you have any questions about your account or billing, please don't hesitate to contact us.

Best regards,
The ThoughtSync Team`,
    category: "billing"
  },
  {
    id: 4,
    name: "Follow-up Session Summary",
    subject: "Summary of Today's Session",
    body: `Dear {{client_name}},

Thank you for your participation in today's session. I wanted to provide a brief summary of what we covered and our next steps.

Key points from today:
- {{session_notes}}

For our next session on {{next_appointment_date}}, please:
- {{homework_assignment}}

If you have any questions before our next meeting, please feel free to reach out.

Looking forward to our continued work together!

Best regards,
{{therapist_name}}`,
    category: "sessions"
  }
];

// Mock scheduled emails
const mockScheduledEmails = [
  {
    id: 1,
    template: "Appointment Reminder",
    recipients: ["Jacob Smith", "Emma Johnson"],
    scheduledDate: new Date(2025, 4, 24, 8, 0),
    status: "pending"
  },
  {
    id: 2,
    template: "Assessment Results Available",
    recipients: ["Noah Williams"],
    scheduledDate: new Date(2025, 4, 23, 15, 0),
    status: "pending"
  },
  {
    id: 3,
    template: "Payment Receipt",
    recipients: ["Olivia Brown"],
    scheduledDate: new Date(2025, 4, 22, 10, 0),
    status: "sent"
  }
];

export default function Communications() {
  const [selectedTab, setSelectedTab] = useState("automated");
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedClients, setSelectedClients] = useState<number[]>([]);
  const [customMessage, setCustomMessage] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const { toast } = useToast();

  // Fetch real client data from evaluations
  const { data: evaluationsData } = useQuery({
    queryKey: ["/api/evaluations"],
    select: (data: any) => {
      return data.evaluations?.map((evaluation: any) => ({
        id: evaluation.id,
        name: evaluation.pseudonym || evaluation.studentId,
        email: "contact@school.edu",
        phone: "Contact on file"
      })) || [];
    }
  });

  const realClients = evaluationsData || [];
  
  const getTemplateById = (id: number) => {
    return mockTemplates.find(template => template.id === id);
  };
  
  const handleClientToggle = (clientId: number) => {
    if (selectedClients.includes(clientId)) {
      setSelectedClients(selectedClients.filter(id => id !== clientId));
    } else {
      setSelectedClients([...selectedClients, clientId]);
    }
  };
  
  const selectTemplate = (templateId: number) => {
    const template = getTemplateById(templateId);
    setSelectedTemplate(templateId);
    
    if (template) {
      setEmailSubject(template.subject);
      setCustomMessage(template.body);
    }
  };
  
  const scheduleEmail = () => {
    if (selectedClients.length === 0) {
      toast({
        title: "No recipients selected",
        description: "Please select at least one client to receive this email.",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedDate) {
      toast({
        title: "No date selected",
        description: "Please select a date to schedule this email.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Email scheduled",
      description: `Email will be sent to ${selectedClients.length} client(s) on ${selectedDate.toLocaleDateString()}`,
    });
  };
  
  const sendNow = () => {
    if (selectedClients.length === 0) {
      toast({
        title: "No recipients selected",
        description: "Please select at least one client to receive this email.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Email sent!",
      description: `Your message has been sent to ${selectedClients.length} client(s).`,
    });
  };
  
  const formatDateTime = (date: Date) => {
    return date.toLocaleString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Client Communications</h1>
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          Create New Template
        </Button>
      </div>
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="automated" className="flex items-center">
            <RotateCw className="h-4 w-4 mr-2" />
            Automated Emails
          </TabsTrigger>
          <TabsTrigger value="compose" className="flex items-center">
            <Edit className="h-4 w-4 mr-2" />
            Compose Email
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Scheduled & History
          </TabsTrigger>
        </TabsList>
        
        {/* Automated Emails Tab */}
        <TabsContent value="automated" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Email Templates</CardTitle>
                  <CardDescription>Select a template to schedule</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {mockTemplates.map(template => (
                    <div 
                      key={template.id}
                      className={`p-3 border rounded-md cursor-pointer hover:bg-muted/50 transition-colors ${
                        selectedTemplate === template.id ? 'bg-muted border-primary' : ''
                      }`}
                      onClick={() => selectTemplate(template.id)}
                    >
                      <div className="font-medium">{template.name}</div>
                      <div className="text-sm text-muted-foreground">{template.subject}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Category: {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Schedule Email</CardTitle>
                  <CardDescription>
                    Set up automated emails based on events or schedule for specific dates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedTemplate ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="email-subject">Email Subject</Label>
                        <Input 
                          id="email-subject" 
                          value={emailSubject}
                          onChange={(e) => setEmailSubject(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email-body">Email Content</Label>
                        <Textarea 
                          id="email-body" 
                          value={customMessage}
                          onChange={(e) => setCustomMessage(e.target.value)}
                          className="min-h-[200px]"
                        />
                      </div>
                      
                      <div className="bg-muted/40 p-2 rounded-md">
                        <p className="text-sm font-medium mb-2">Template Variables:</p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center space-x-1">
                            <code className="bg-muted p-1 rounded">&#123;&#123;client_name&#125;&#125;</code>
                            <span>Client's full name</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <code className="bg-muted p-1 rounded">&#123;&#123;appointment_date&#125;&#125;</code>
                            <span>Scheduled date</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <code className="bg-muted p-1 rounded">&#123;&#123;appointment_time&#125;&#125;</code>
                            <span>Scheduled time</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <code className="bg-muted p-1 rounded">&#123;&#123;therapist_name&#125;&#125;</code>
                            <span>Your name</span>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <MailIcon className="h-12 w-12 text-muted-foreground/30 mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Template Selected</h3>
                      <p className="text-muted-foreground max-w-md">
                        Select an email template from the list to customize and schedule your automated communication.
                      </p>
                    </div>
                  )}
                </CardContent>
                {selectedTemplate && (
                  <CardFooter className="flex justify-between border-t pt-4">
                    <div className="flex items-center">
                      <Switch id="schedule-toggle" />
                      <Label htmlFor="schedule-toggle" className="ml-2">Trigger on event</Label>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={sendNow}>
                        <Send className="h-4 w-4 mr-2" />
                        Send Now
                      </Button>
                      <Button onClick={scheduleEmail}>
                        <ArrowRightCircle className="h-4 w-4 mr-2" />
                        Continue
                      </Button>
                    </div>
                  </CardFooter>
                )}
              </Card>
              
              {selectedTemplate && (
                <Card>
                  <CardHeader>
                    <CardTitle>Select Recipients & Schedule</CardTitle>
                    <CardDescription>Choose clients and schedule date</CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Select Clients</h3>
                      <div className="border rounded-md h-[250px] overflow-y-auto p-2">
                        {mockClients.map(client => (
                          <div 
                            key={client.id} 
                            className="flex items-center space-x-2 p-2 hover:bg-muted/30 rounded-md"
                          >
                            <input 
                              type="checkbox"
                              id={`client-${client.id}`}
                              checked={selectedClients.includes(client.id)}
                              onChange={() => handleClientToggle(client.id)}
                              className="rounded"
                            />
                            <Label htmlFor={`client-${client.id}`} className="flex-1 cursor-pointer">
                              <div>{client.name}</div>
                              <div className="text-xs text-muted-foreground">{client.email}</div>
                            </Label>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between text-sm mt-2">
                        <span>{selectedClients.length} client(s) selected</span>
                        <Button 
                          variant="link" 
                          className="h-auto p-0" 
                          onClick={() => setSelectedClients(realClients.map(c => c.id))}
                        >
                          Select All
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Schedule Date & Time</h3>
                      <div className="border rounded-md p-2">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          className="mx-auto"
                          disabled={(date) => date < new Date()}
                        />
                        <div className="flex justify-center gap-2 mt-2">
                          <Button variant="outline" size="sm">
                            <Clock className="h-3 w-3 mr-1" />
                            Morning (8:00 AM)
                          </Button>
                          <Button variant="outline" size="sm">
                            <Clock className="h-3 w-3 mr-1" />
                            Afternoon (2:00 PM)
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4">
                    <Button className="w-full" onClick={scheduleEmail}>
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      Schedule Email
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
        
        {/* Compose Email Tab */}
        <TabsContent value="compose" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compose New Email</CardTitle>
              <CardDescription>Send a direct message to clients</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recipients">Select Recipients</Label>
                <div className="border rounded-md h-[150px] overflow-y-auto p-2">
                  {realClients.map(client => (
                    <div 
                      key={client.id} 
                      className="flex items-center space-x-2 p-2 hover:bg-muted/30 rounded-md"
                    >
                      <input 
                        type="checkbox"
                        id={`compose-client-${client.id}`}
                        checked={selectedClients.includes(client.id)}
                        onChange={() => handleClientToggle(client.id)}
                        className="rounded"
                      />
                      <Label htmlFor={`compose-client-${client.id}`} className="flex-1 cursor-pointer">
                        <div>{client.name}</div>
                        <div className="text-xs text-muted-foreground">{client.email}</div>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="compose-subject">Subject</Label>
                <Input 
                  id="compose-subject" 
                  placeholder="Enter email subject..."
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="compose-message">Message</Label>
                <Textarea 
                  id="compose-message" 
                  placeholder="Type your message here..."
                  className="min-h-[200px]"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <Button variant="outline">
                <Save className="h-4 w-4 mr-2" />
                Save as Draft
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => {
                  setSelectedDate(new Date(Date.now() + 86400000)); // Tomorrow
                  setSelectedTab("automated");
                }}>
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Schedule for Later
                </Button>
                <Button onClick={sendNow}>
                  <Send className="h-4 w-4 mr-2" />
                  Send Now
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Scheduled & History Tab */}
        <TabsContent value="scheduled" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Scheduled Emails</CardTitle>
              <CardDescription>View and manage your scheduled communications</CardDescription>
            </CardHeader>
            <CardContent>
              {mockScheduledEmails.filter(email => email.status === "pending").length === 0 ? (
                <div className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground/30 mb-2" />
                  <p className="text-muted-foreground">No upcoming scheduled emails</p>
                  <Button 
                    variant="link" 
                    onClick={() => setSelectedTab("automated")}
                    className="mt-2"
                  >
                    Schedule a new email
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {mockScheduledEmails
                    .filter(email => email.status === "pending")
                    .map(email => (
                      <div key={email.id} className="flex justify-between items-center p-3 border rounded-md">
                        <div>
                          <h4 className="font-medium">{email.template}</h4>
                          <div className="text-sm text-muted-foreground">
                            To: {email.recipients.join(", ")}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Scheduled for: {formatDateTime(email.scheduledDate)}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Send className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                            <XCircle className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Email History</CardTitle>
              <CardDescription>Review previously sent communications</CardDescription>
            </CardHeader>
            <CardContent>
              {mockScheduledEmails.filter(email => email.status === "sent").length === 0 ? (
                <div className="text-center py-8">
                  <MailIcon className="h-12 w-12 mx-auto text-muted-foreground/30 mb-2" />
                  <p className="text-muted-foreground">No email history found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {mockScheduledEmails
                    .filter(email => email.status === "sent")
                    .map(email => (
                      <div key={email.id} className="flex justify-between items-center p-3 border rounded-md">
                        <div>
                          <h4 className="font-medium">{email.template}</h4>
                          <div className="text-sm text-muted-foreground">
                            To: {email.recipients.join(", ")}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center">
                            <CheckSquare className="h-3 w-3 text-green-500 mr-1" />
                            Sent: {formatDateTime(email.scheduledDate)}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}