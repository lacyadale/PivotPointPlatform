import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NarrativeGenerator } from "@/components/NarrativeGenerator";
import { PracticumTimeTracker } from "@/components/PracticumTimeTracker";
import { ReportExporter } from "@/components/ReportExporter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useState } from "react";
import { Trash2, Plus, FileText, Sparkles } from "lucide-react";
import { z } from "zod";

// Schema for form validation
const scoreSchema = z.object({
  name: z.string().min(1, "Score name is required"),
  value: z.coerce.number().min(0, "Score must be at least 0"),
  percentile: z.coerce.number().min(0).max(100).optional(),
  description: z.string().optional(),
  category: z.string().optional(),
});

const assessmentSchema = z.object({
  name: z.string().min(1, "Assessment name is required"),
  date: z.string().min(1, "Date is required"),
  scores: z.array(scoreSchema).optional(),
  interpretation: z.string().optional(),
  category: z.enum([
    "cognitive", 
    "academic", 
    "language", 
    "social_emotional", 
    "behavioral", 
    "physical", 
    "developmental", 
    "adaptive", 
    "other"
  ]).default("cognitive"),
});

const evaluationSchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  pseudonym: z.string().optional(),
  schoolName: z.string().optional(),
  dateOfBirth: z.string().optional(),
  evaluationType: z.string().optional(),
  reportDate: z.string().optional(),
  consentDate: z.string().optional(),
  dueDate: z.string().optional(),
  parentName: z.string().optional(),
  parentPhone: z.string().optional(),
  parentEmail: z.string().optional(),
  parentAddress: z.string().optional(),
  examinerName: z.string().optional(),
  examinerTitle: z.string().optional(),
  reasonForReferral: z.string().optional(),
  demographics: z.object({
    age: z.coerce.number().int().positive("Age must be a positive number").optional(),
    grade: z.string().optional(),
    gender: z.string().optional(),
    ethnicity: z.string().optional(),
    primaryLanguage: z.string().optional(),
    secondaryLanguage: z.string().optional(),
    handedness: z.string().optional(),
    specialEducation: z.boolean().optional(),
    iep: z.boolean().optional(),
    section504: z.boolean().optional(),
    medicaid: z.boolean().optional(),
    freeReducedLunch: z.boolean().optional(),
  }).optional(),
  educationalHistory: z.string().optional(),
  developmentalHistory: z.string().optional(),
  medicalHistory: z.string().optional(),
  interventionHistory: z.string().optional(),
  assessments: z.array(assessmentSchema).optional(),
  observations: z.string().optional(),
  recommendations: z.string().optional(),
  summary: z.string().optional(),
  clinicianNotes: z.string().optional(),
});

type EvaluationFormValues = z.infer<typeof evaluationSchema>;

export default function NewEvaluation() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [assessments, setAssessments] = useState([{ id: Date.now() }]);
  
  // Function to calculate due date (60 days from consent date)
  const calculateDueDate = (consentDate: string): string => {
    if (!consentDate) return '';
    
    try {
      const date = new Date(consentDate);
      date.setDate(date.getDate() + 60); // Add 60 days
      return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    } catch (error) {
      console.error('Error calculating due date:', error);
      return '';
    }
  };
  
  // Define the form with validations
  const form = useForm<EvaluationFormValues>({
    resolver: zodResolver(evaluationSchema),
    defaultValues: {
      studentId: "",
      firstName: "",
      lastName: "",
      pseudonym: "",
      schoolName: "",
      dateOfBirth: "",
      evaluationType: "",
      reportDate: new Date().toISOString().split('T')[0], // Today's date
      consentDate: "",
      dueDate: "",
      parentName: "",
      parentPhone: "",
      parentEmail: "",
      parentAddress: "",
      examinerName: "Your Name", // Default to your name
      examinerTitle: "School Psychologist", // Default title
      reasonForReferral: "",
      demographics: {
        age: undefined,
        grade: "",
        gender: "",
        ethnicity: "",
        primaryLanguage: "English",
        secondaryLanguage: "",
        handedness: "",
        specialEducation: false,
        iep: false,
        section504: false,
        medicaid: false,
        freeReducedLunch: false
      },
      educationalHistory: "",
      developmentalHistory: "",
      medicalHistory: "",
      interventionHistory: "",
      assessments: [],
      observations: "",
      recommendations: "",
      summary: "",
      clinicianNotes: "",
    },
  });

  // Add a new assessment row
  const addAssessment = () => {
    setAssessments([...assessments, { id: Date.now() }]);
  };

  // Remove an assessment row
  const removeAssessment = (index: number) => {
    const newAssessments = [...assessments];
    newAssessments.splice(index, 1);
    setAssessments(newAssessments);
    
    // Update form data
    const currentAssessments = form.getValues("assessments") || [];
    currentAssessments.splice(index, 1);
    form.setValue("assessments", currentAssessments);
  };

  // Handle form submission
  const mutation = useMutation({
    mutationFn: async (data: EvaluationFormValues) => {
      // Process the data
      let processedData = { ...data };
      
      const response = await apiRequest("POST", "/api/evaluations", processedData);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "Evaluation created successfully",
      });
      
      // Navigate to the evaluation detail page
      navigate(`/evaluations/${data.id}`);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create evaluation: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: EvaluationFormValues) => {
    mutation.mutate(data);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="bg-white dark:bg-gray-800">
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Student Information */}
              <div className="space-y-4 border p-4 rounded-md bg-white dark:bg-gray-800">
                <h2 className="text-lg font-medium border-b pb-2">Student Information</h2>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="studentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Student ID</FormLabel>
                        <FormControl>
                          <Input {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="demographics.age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            min="1"
                            max="100" 
                            {...field} 
                            onChange={(e) => {
                              const value = e.target.value ? parseInt(e.target.value) : undefined;
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="demographics.gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <FormControl>
                          <Select 
                            value={field.value || ""} 
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                              <SelectItem value="Non-binary">Non-binary</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="demographics.grade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grade</FormLabel>
                        <FormControl>
                          <Select 
                            value={field.value || ""} 
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select grade" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Preschool">Preschool</SelectItem>
                              <SelectItem value="PreK">PreK</SelectItem>
                              <SelectItem value="Kindergarten">Kindergarten</SelectItem>
                              <SelectItem value="1">1st Grade</SelectItem>
                              <SelectItem value="2">2nd Grade</SelectItem>
                              <SelectItem value="3">3rd Grade</SelectItem>
                              <SelectItem value="4">4th Grade</SelectItem>
                              <SelectItem value="5">5th Grade</SelectItem>
                              <SelectItem value="6">6th Grade</SelectItem>
                              <SelectItem value="7">7th Grade</SelectItem>
                              <SelectItem value="8">8th Grade</SelectItem>
                              <SelectItem value="9">9th Grade</SelectItem>
                              <SelectItem value="10">10th Grade</SelectItem>
                              <SelectItem value="11">11th Grade</SelectItem>
                              <SelectItem value="12">12th Grade</SelectItem>
                              <SelectItem value="College">College</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="schoolName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>School</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="evaluationType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Evaluation Type</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="pt-2">
                  <FormField
                    control={form.control}
                    name="pseudonym"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pseudonym (optional)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              {/* Parent/Guardian Information */}
              <div className="space-y-4 border p-4 rounded-md bg-white dark:bg-gray-800">
                <h2 className="text-lg font-medium border-b pb-2">Parent/Guardian Information</h2>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="parentName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parent/Guardian Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="parentPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input {...field} type="tel" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="parentEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                
                  <FormField
                    control={form.control}
                    name="parentAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="consentDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parental Consent Date</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="date" 
                            onChange={(e) => {
                              field.onChange(e);
                              // Auto calculate due date (60 days from consent)
                              const dueDate = calculateDueDate(e.target.value);
                              form.setValue("dueDate", dueDate);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Due Date (60 days from consent)</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="date" 
                            className="bg-gray-50 dark:bg-gray-700" 
                            readOnly 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              {/* Examiner Information */}
              <div className="space-y-4 border p-4 rounded-md bg-white dark:bg-gray-800">
                <h2 className="text-lg font-medium border-b pb-2">Examiner Information</h2>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="examinerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Examiner Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="examinerTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="reportDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Report Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Reason for Referral */}
              <div className="space-y-4 border p-4 rounded-md bg-white dark:bg-gray-800">
                <h2 className="text-lg font-medium border-b pb-2">Reason for Referral</h2>
                
                <FormField
                  control={form.control}
                  name="reasonForReferral"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason for Referral</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          className="min-h-[100px]"
                          placeholder="Enter the reason for referral..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Educational & Developmental History */}
              <div className="space-y-4 border p-4 rounded-md bg-white dark:bg-gray-800">
                <h2 className="text-lg font-medium border-b pb-2">Educational & Developmental History</h2>
                
                <Tabs defaultValue="educational" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="educational">Educational</TabsTrigger>
                    <TabsTrigger value="developmental">Developmental</TabsTrigger>
                    <TabsTrigger value="medical">Medical</TabsTrigger>
                    <TabsTrigger value="intervention">Intervention</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="educational" className="mt-4">
                    <FormField
                      control={form.control}
                      name="educationalHistory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Educational History</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              className="min-h-[150px]"
                              placeholder="Enter educational history, school performance, academic progress..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  
                  <TabsContent value="developmental" className="mt-4">
                    <FormField
                      control={form.control}
                      name="developmentalHistory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Developmental History</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              className="min-h-[150px]"
                              placeholder="Enter developmental milestones, early development patterns..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  
                  <TabsContent value="medical" className="mt-4">
                    <FormField
                      control={form.control}
                      name="medicalHistory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Medical History</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              className="min-h-[150px]"
                              placeholder="Enter relevant medical history, diagnoses, medications..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  
                  <TabsContent value="intervention" className="mt-4">
                    <FormField
                      control={form.control}
                      name="interventionHistory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Intervention History</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              className="min-h-[150px]"
                              placeholder="Enter previous interventions, tier I-III supports, effectiveness of interventions..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                </Tabs>
              </div>

              {/* Assessments */}
              <div className="space-y-4 border p-4 rounded-md bg-white dark:bg-gray-800">
                <div className="flex justify-between items-center border-b pb-2">
                  <h2 className="text-lg font-medium">Evaluation Procedures</h2>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addAssessment}
                    className="text-primary-700 dark:text-primary-300 bg-primary-100 dark:bg-primary-900 hover:bg-primary-200 dark:hover:bg-primary-800"
                  >
                    <Plus className="mr-1 h-4 w-4" /> Add Test/Assessment
                  </Button>
                </div>
                
                {assessments.map((assessment, index) => (
                  <div key={assessment.id} className="border border-gray-200 dark:border-gray-700 rounded-md p-4 space-y-4 mb-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-md font-medium">Assessment #{index + 1}</h3>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeAssessment(index)}
                        className="h-8 w-8 text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name={`assessments.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Assessment Name</FormLabel>
                            <FormControl>
                              <Input {...field} required placeholder="e.g., WISC-V, BASC-3" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`assessments.${index}.date`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date Administered</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} required />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name={`assessments.${index}.category`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assessment Category</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="cognitive">Cognitive</SelectItem>
                              <SelectItem value="academic">Academic</SelectItem>
                              <SelectItem value="language">Language</SelectItem>
                              <SelectItem value="social_emotional">Social-Emotional</SelectItem>
                              <SelectItem value="behavioral">Behavioral</SelectItem>
                              <SelectItem value="physical">Physical/Motor</SelectItem>
                              <SelectItem value="developmental">Developmental</SelectItem>
                              <SelectItem value="adaptive">Adaptive</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Scores Section */}
                    <div className="space-y-2 border-t pt-4 mt-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium">Scores</h4>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const currentAssessments = form.getValues("assessments") || [];
                            if (!currentAssessments[index]) {
                              currentAssessments[index] = {
                                name: "",
                                date: "",
                                category: "cognitive",
                                scores: []
                              };
                            }
                            if (!currentAssessments[index].scores) {
                              currentAssessments[index].scores = [];
                            }
                            currentAssessments[index].scores.push({ 
                              name: "", 
                              value: 0, 
                              percentile: undefined,
                              description: "",
                              category: ""
                            });
                            form.setValue("assessments", currentAssessments);
                          }}
                          className="text-xs"
                        >
                          <Plus className="mr-1 h-3 w-3" /> Add Score
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-12 gap-2 text-xs font-medium text-gray-500 mb-1 px-2">
                        <div className="col-span-3">Score Name</div>
                        <div className="col-span-2">Value</div>
                        <div className="col-span-2">Percentile</div>
                        <div className="col-span-4">Description</div>
                        <div className="col-span-1"></div>
                      </div>
                      
                      {/* Score Rows */}
                      {form.watch(`assessments.${index}.scores`)?.map((_, scoreIndex) => (
                        <div key={scoreIndex} className="grid grid-cols-12 gap-2 p-2 border border-gray-100 dark:border-gray-800 rounded bg-gray-50 dark:bg-gray-900">
                          <div className="col-span-3">
                            <FormField
                              control={form.control}
                              name={`assessments.${index}.scores.${scoreIndex}.name`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input {...field} placeholder="e.g., FSIQ, VCI" className="text-sm h-8" />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="col-span-2">
                            <FormField
                              control={form.control}
                              name={`assessments.${index}.scores.${scoreIndex}.value`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      {...field}
                                      onChange={(e) => {
                                        const value = e.target.value ? parseFloat(e.target.value) : 0;
                                        field.onChange(value);
                                      }}
                                      className="text-sm h-8"
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="col-span-2">
                            <FormField
                              control={form.control}
                              name={`assessments.${index}.scores.${scoreIndex}.percentile`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      min="0"
                                      max="100"
                                      {...field}
                                      onChange={(e) => {
                                        const value = e.target.value ? parseFloat(e.target.value) : undefined;
                                        field.onChange(value);
                                      }}
                                      className="text-sm h-8"
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="col-span-4">
                            <FormField
                              control={form.control}
                              name={`assessments.${index}.scores.${scoreIndex}.description`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input {...field} placeholder="e.g., Average, Below Average" className="text-sm h-8" />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="col-span-1 flex items-center justify-center">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                const currentAssessments = form.getValues("assessments") || [];
                                if (currentAssessments[index]?.scores) {
                                  currentAssessments[index].scores.splice(scoreIndex, 1);
                                  form.setValue("assessments", currentAssessments);
                                }
                              }}
                              className="h-7 w-7 text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <FormField
                      control={form.control}
                      name={`assessments.${index}.interpretation`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Interpretation</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Enter test interpretation..."
                              className="min-h-[80px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </div>
              
              {/* Observations & Recommendations */}
              <div className="space-y-4 border p-4 rounded-md bg-white dark:bg-gray-800">
                <h2 className="text-lg font-medium border-b pb-2">Observations & Recommendations</h2>
                
                <FormField
                  control={form.control}
                  name="observations"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormLabel>Behavioral Observations</FormLabel>
                        <div className="flex items-center gap-1">
                          <NarrativeGenerator
                            sectionType="observations"
                            inputData={form.getValues()}
                            onGenerated={(text) => field.onChange(text)}
                            buttonText="Generate Observations"
                          />
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        Record behavioral observations during testing and interactions
                      </p>
                      <FormControl>
                        <Textarea
                          className="min-h-[150px]"
                          placeholder="Document observations of behavior, attention, effort, and interaction style during assessment..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="summary"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormLabel>Summary of Findings</FormLabel>
                        <div className="flex items-center gap-1">
                          <NarrativeGenerator
                            sectionType="summary"
                            inputData={form.getValues()}
                            onGenerated={(text) => field.onChange(text)}
                            buttonText="Generate Summary"
                          />
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        Provide a summary of key findings and interpretation
                      </p>
                      <FormControl>
                        <Textarea
                          className="min-h-[150px]"
                          placeholder="Summarize assessment results and their implications..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="recommendations"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormLabel>Recommendations</FormLabel>
                        <div className="flex items-center gap-1">
                          <NarrativeGenerator
                            sectionType="recommendations"
                            inputData={form.getValues()}
                            onGenerated={(text) => field.onChange(text)}
                            buttonText="Generate Recommendations"
                          />
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        Provide educational and clinical recommendations based on evaluation findings
                      </p>
                      <FormControl>
                        <Textarea
                          className="min-h-[150px]"
                          placeholder="List specific recommendations for educational interventions, accommodations, or further assessment..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Clinician Notes */}
              <div className="space-y-4 border p-4 rounded-md bg-white dark:bg-gray-800">
                <h2 className="text-lg font-medium border-b pb-2">Clinician Notes</h2>
                <FormField
                  control={form.control}
                  name="clinicianNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Private Notes</FormLabel>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        These notes are for clinician reference only and will not appear in the final report
                      </p>
                      <FormControl>
                        <Textarea
                          className="min-h-[100px]"
                          placeholder="Enter any private notes, questions, or follow-up items..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Time Tracking */}
              <div className="space-y-4 border p-4 rounded-md bg-white dark:bg-gray-800">
                <h2 className="text-lg font-medium border-b pb-2">Practicum Time & Demographics Tracking</h2>
                <PracticumTimeTracker />
              </div>
              
              {/* Report Export */}
              <div className="space-y-4 border p-4 rounded-md bg-white dark:bg-gray-800">
                <h2 className="text-lg font-medium border-b pb-2">Export Final Report</h2>
                <ReportExporter 
                  studentName={`${form.getValues("firstName")} ${form.getValues("lastName")}`}
                />
              </div>
              
              {/* Submit Button */}
              <div className="flex justify-end pt-2">
                <Button 
                  type="submit" 
                  className="bg-green-600 hover:bg-green-700"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? "Creating..." : "Create Evaluation"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
