import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Upload, Clock, CheckCircle, AlertTriangle, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { SmartFiltersPanel } from "@/components/SmartFiltersPanel";
import { useSmartFilters } from "@/hooks/useSmartFilters";

interface Evaluation {
  id: string;
  studentId: string;
  pseudonym?: string;
  school?: string;
  grade?: string;
  service?: string;
  logDate: string;
  reviewDate?: string;
  status: "completed" | "in_progress";
  requestDate?: string;
  permissionDate?: string;
  dueDate?: string;
  test?: string;
  reportWritten?: boolean;
  eligibilityDate?: string;
  eligibilityDecision?: string;
  dateToMeeting?: string;
  notes?: string;
  createdAt: string;
}

export default function EvaluationList() {
  const [page, setPage] = useState(1);
  const pageSize = 100;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedEvaluations, setSelectedEvaluations] = useState<string[]>([]);
  const [sortField, setSortField] = useState<string>('studentId');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Excel upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      // Validate file type client-side first
      if (!file.name.match(/\.(xlsx|xls)$/i)) {
        throw new Error('Please select an Excel file (.xlsx or .xls)');
      }

      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size must be less than 10MB');
      }

      const formData = new FormData();
      formData.append('excel', file);
      
      const response = await fetch('/api/evaluations/upload-excel', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload Excel file');
      }
      
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Success!",
        description: `Updated ${data.updated} cases and created ${data.created} new cases from your Excel log.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/evaluations"] });
    },
    onError: (error) => {
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to process Excel file",
        variant: "destructive",
      });
    },
  });

  // Delete mutation - using POST with special action to avoid Vite interference
  const deleteMutation = useMutation({
    mutationFn: async (evaluationIds: string[]) => {
      const promises = evaluationIds.map(id =>
        fetch(`/api/evaluations/${id}/delete`, { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'delete' })
        })
      );
      await Promise.all(promises);
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: `Deleted ${selectedEvaluations.length} evaluations.`,
      });
      setSelectedEvaluations([]);
      queryClient.invalidateQueries({ queryKey: ["/api/evaluations"] });
    },
    onError: () => {
      toast({
        title: "Delete Failed",
        description: "Failed to delete selected evaluations",
        variant: "destructive",
      });
    },
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked && data?.evaluations) {
      setSelectedEvaluations(data.evaluations.map(e => e.id));
    } else {
      setSelectedEvaluations([]);
    }
  };

  const handleSelectEvaluation = (evaluationId: string, checked: boolean) => {
    if (checked) {
      setSelectedEvaluations(prev => [...prev, evaluationId]);
    } else {
      setSelectedEvaluations(prev => prev.filter(id => id !== evaluationId));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedEvaluations.length > 0) {
      deleteMutation.mutate(selectedEvaluations);
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const handleExcelUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadMutation.mutate(file);
    }
    // Reset the input
    event.target.value = '';
  };
  
  const { data, isLoading, isError, error } = useQuery<{ evaluations: Evaluation[], total: number }>({
    queryKey: ["/api/evaluations", page],
    queryFn: async () => {
      const res = await fetch(`/api/evaluations?page=${page}&limit=${pageSize}`);
      if (!res.ok) {
        throw new Error("Failed to fetch evaluations");
      }
      return res.json();
    }
  });

  // Initialize Smart Filters with real student data
  const {
    filters,
    setFilters,
    filteredEvaluations,
    selectedItems,
    quickFilters,
    batchActions,
    hasActiveFilters
  } = useSmartFilters(data?.evaluations || []);
  
  // Handle pagination
  const totalPages = data ? Math.ceil(data.total / pageSize) : 0;
  
  const goToPage = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Sort and filter evaluations based on current settings
  const sortedEvaluations = useMemo(() => {
    if (!data?.evaluations) return [];
    
    // First apply filters
    let filtered = [...data.evaluations];
    
    if (filters.showCompleted) {
      filtered = filtered.filter(evaluation => evaluation.eligibilityDate != null);
    }
    
    if (filters.showInProgress) {
      filtered = filtered.filter(evaluation => evaluation.permissionDate != null && evaluation.eligibilityDate == null);
    }
    
    // Then apply sorting
    const sorted = filtered.sort((a, b) => {
      const aValue = a[sortField as keyof typeof a];
      const bValue = b[sortField as keyof typeof b];
      
      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortDirection === 'asc' ? 1 : -1;
      if (bValue == null) return sortDirection === 'asc' ? -1 : 1;
      
      // Handle dates
      if (sortField.includes('Date') || sortField === 'createdAt' || sortField === 'updatedAt') {
        const aDate = new Date(aValue as string).getTime();
        const bDate = new Date(bValue as string).getTime();
        return sortDirection === 'asc' ? aDate - bDate : bDate - aDate;
      }
      
      // Handle strings and numbers
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();
      
      if (aStr < bStr) return sortDirection === 'asc' ? -1 : 1;
      if (aStr > bStr) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    return sorted;
  }, [data?.evaluations, sortField, sortDirection, filters]);
  
  // Calculate metrics for tracking indicators
  const metrics = useMemo(() => {
    if (!data?.evaluations) return { total: 0, completed: 0, inProgress: 0, overdue: 0 };
    
    const now = new Date();
    const evaluations = data.evaluations;
    
    // Status is "Completed" if there is a date in the Eligibility Date column
    // Status is "In Progress" if there is a permission date
    const completedEvaluations = evaluations.filter(e => e.eligibilityDate != null);
    const inProgressEvaluations = evaluations.filter(e => e.permissionDate != null && e.eligibilityDate == null);
    
    return {
      total: evaluations.length,
      completed: completedEvaluations.length,
      inProgress: inProgressEvaluations.length,
      overdue: evaluations.filter(e => e.dueDate && new Date(e.dueDate) < now && e.eligibilityDate == null).length
    };
  }, [data?.evaluations]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Dashboard Header with Tracking Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Assessments</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{metrics.total}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400">Completed</p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">{metrics.completed}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">In Progress</p>
              <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{metrics.inProgress}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600 dark:text-red-400">Overdue</p>
              <p className="text-2xl font-bold text-red-900 dark:text-red-100">{metrics.overdue}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </Card>
      </div>

      <Card className="bg-white dark:bg-gray-800 shadow-lg overflow-hidden sm:rounded-lg border-0 shadow-gray-200 dark:shadow-gray-900">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Assessment Log</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Track all student assessments with dates, status, and evaluation progress.
            </p>
            <div className="mt-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
              <p className="text-xs text-blue-700 dark:text-blue-300 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                FERPA/HIPAA Secure: All student data is encrypted and access-controlled per federal privacy requirements.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleExcelUpload}
              className="hidden"
              id="excel-upload"
            />
            <label htmlFor="excel-upload">
              <Button
                className="bg-green-600 hover:bg-green-700"
                variant="outline"
                disabled={uploadMutation.isPending}
                asChild
              >
                <span>
                  {uploadMutation.isPending ? (
                    <>
                      <Upload className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Excel Log
                    </>
                  )}
                </span>
              </Button>
            </label>
            {selectedEvaluations.length > 0 && (
              <Button
                variant="destructive"
                onClick={handleDeleteSelected}
                disabled={deleteMutation.isPending}
              >
                Delete Selected ({selectedEvaluations.length})
              </Button>
            )}
            <Link href="/evaluations/new">
              <Button className="bg-primary-600 hover:bg-primary-700">
                New Evaluation
              </Button>
            </Link>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
          <div className="flex flex-wrap gap-6 items-center">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Filter by:</span>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.showCompleted}
                onChange={(e) => setFilters(prev => ({ ...prev, showCompleted: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">Completed Only</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.showInProgress}
                onChange={(e) => setFilters(prev => ({ ...prev, showInProgress: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">In Progress Only</span>
            </label>
            {(filters.showCompleted || filters.showInProgress) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilters({ showCompleted: false, showInProgress: false })}
                className="text-xs"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
        
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide border-b border-slate-200 dark:border-slate-600">
                  <input
                    type="checkbox"
                    checked={data?.evaluations?.length > 0 && selectedEvaluations.length === data?.evaluations?.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 shadow-sm"
                  />
                </th>
                <th scope="col" className="px-6 py-4 text-left text-sm font-bold text-slate-700 dark:text-slate-200 tracking-wide border-b border-slate-200 dark:border-slate-600">
                  <button 
                    onClick={() => handleSort('studentId')}
                    className="flex items-center space-x-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-bold"
                  >
                    <span>Student</span>
                    <span className="text-xs">{getSortIcon('studentId')}</span>
                  </button>
                </th>
                <th scope="col" className="px-6 py-4 text-left text-sm font-bold text-slate-700 dark:text-slate-200 tracking-wide border-b border-slate-200 dark:border-slate-600">
                  <button 
                    onClick={() => handleSort('school')}
                    className="flex items-center space-x-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-bold"
                  >
                    <span>School</span>
                    <span className="text-xs">{getSortIcon('school')}</span>
                  </button>
                </th>
                <th scope="col" className="px-6 py-4 text-left text-sm font-bold text-slate-700 dark:text-slate-200 tracking-wide border-b border-slate-200 dark:border-slate-600">
                  <button 
                    onClick={() => handleSort('grade')}
                    className="flex items-center space-x-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-bold"
                  >
                    <span>Grade</span>
                    <span className="text-xs">{getSortIcon('grade')}</span>
                  </button>
                </th>
                <th scope="col" className="px-6 py-4 text-left text-sm font-bold text-slate-700 dark:text-slate-200 tracking-wide border-b border-slate-200 dark:border-slate-600">
                  Service
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  <button 
                    onClick={() => handleSort('logDate')}
                    className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-100 transition-colors"
                  >
                    <span>Log Date</span>
                    <span className="text-xs">{getSortIcon('logDate')}</span>
                  </button>
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Review Date
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  <button 
                    onClick={() => handleSort('status')}
                    className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-100 transition-colors"
                  >
                    <span>Staff</span>
                    <span className="text-xs">{getSortIcon('status')}</span>
                  </button>
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Request Date
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  <button 
                    onClick={() => handleSort('permissionDate')}
                    className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-100 transition-colors"
                  >
                    <span>Permission Date</span>
                    <span className="text-xs">{getSortIcon('permissionDate')}</span>
                  </button>
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  <button 
                    onClick={() => handleSort('dueDate')}
                    className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-100 transition-colors"
                  >
                    <span>Due Date</span>
                    <span className="text-xs">{getSortIcon('dueDate')}</span>
                  </button>
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Test
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Report Written
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Eligibility Date
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Eligibility Decision
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-200 tracking-wide border-b border-slate-200 dark:border-slate-600">
                  Date to MET
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Notes
                </th>
                <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-600">
              {isLoading ? (
                // Show skeleton loading state
                Array.from({ length: 3 }).map((_, index) => (
                  <tr key={index}>
                    {Array.from({ length: 17 }).map((_, cellIndex) => (
                      <td key={cellIndex} className="px-3 py-4 whitespace-nowrap">
                        <Skeleton className="h-4 w-20" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td colSpan={17} className="px-6 py-4 text-center text-red-500">
                    Error: {error instanceof Error ? error.message : "Failed to load evaluations"}
                  </td>
                </tr>
              ) : sortedEvaluations.length === 0 ? (
                <tr>
                  <td colSpan={17} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No evaluations found. Create your first evaluation.
                  </td>
                </tr>
              ) : (
                sortedEvaluations.map((evaluation) => (
                  <tr key={evaluation.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-200 border-b border-slate-100 dark:border-slate-600 group">
                    <td className="px-6 py-6 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedEvaluations.includes(evaluation.id)}
                        onChange={(e) => handleSelectEvaluation(evaluation.id, e.target.checked)}
                        className="rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 shadow-sm scale-110"
                      />
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap text-sm font-bold text-slate-900 dark:text-white bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-900/20 group-hover:from-blue-100 dark:group-hover:from-blue-800/30">
                      {evaluation.pseudonym || evaluation.studentId}
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap text-sm font-medium text-slate-700 dark:text-slate-200">
                      {evaluation.school || "—"}
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap text-sm font-medium text-slate-700 dark:text-slate-200">
                      {evaluation.grade || "—"}
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap text-sm font-medium text-slate-700 dark:text-slate-200">
                      {evaluation.service || "—"}
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap text-sm font-medium text-slate-700 dark:text-slate-200">
                      {evaluation.logDate ? formatDate(evaluation.logDate) : "—"}
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap text-sm font-medium text-slate-700 dark:text-slate-200">
                      {evaluation.reviewDate ? formatDate(evaluation.reviewDate) : "—"}
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap text-sm font-medium text-slate-700 dark:text-slate-200">
                      {evaluation.status || "—"}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {evaluation.requestDate ? formatDate(evaluation.requestDate) : "-"}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {evaluation.permissionDate ? formatDate(evaluation.permissionDate) : "-"}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {evaluation.dueDate ? formatDate(evaluation.dueDate) : "-"}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {evaluation.test || "-"}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {evaluation.reportWritten ? "Yes" : "No"}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {evaluation.eligibilityDate ? formatDate(evaluation.eligibilityDate) : "-"}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {evaluation.eligibilityDecision || "-"}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {evaluation.dateToMeeting ? formatDate(evaluation.dateToMeeting) : "-"}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                      {evaluation.notes || "-"}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link href={`/evaluations/${evaluation.id}`} className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mr-4">
                        View
                      </Link>
                      {evaluation.status === "completed" && (
                        <Button 
                          variant="link" 
                          size="sm"
                          className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 p-0 h-auto"
                          onClick={() => {
                            // Generate report functionality
                            window.location.href = `/api/reports/${evaluation.id}`;
                          }}
                        >
                          Generate Report
                        </Button>
                      )}
                      {evaluation.status !== "completed" && (
                        <span className="text-gray-400 cursor-not-allowed">Generate Report</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {!isLoading && !isError && data && (
          <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <Button
                variant="outline"
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => goToPage(page + 1)}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Showing <span className="font-medium">{((page - 1) * pageSize) + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(page * pageSize, data.total)}
                  </span>{" "}
                  of <span className="font-medium">{data.total}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <Button
                    variant="outline"
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600"
                    onClick={() => goToPage(page - 1)}
                    disabled={page === 1}
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  
                  {/* Page numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(num => 
                      num === 1 || 
                      num === totalPages || 
                      (num >= page - 1 && num <= page + 1)
                    )
                    .map((num, i, arr) => {
                      // Add ellipsis where there are gaps
                      const prevNum = arr[i - 1];
                      const showEllipsisBefore = prevNum && num - prevNum > 1;
                      
                      return (
                        <div key={num}>
                          {showEllipsisBefore && (
                            <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300">
                              ...
                            </span>
                          )}
                          <Button
                            variant={num === page ? "default" : "outline"}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              num === page
                                ? "z-10 bg-primary-50 dark:bg-primary-900 border-primary-500 dark:border-primary-500 text-primary-600 dark:text-primary-200"
                                : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600"
                            }`}
                            onClick={() => goToPage(num)}
                          >
                            {num}
                          </Button>
                        </div>
                      );
                    })}
                  
                  <Button
                    variant="outline"
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600"
                    onClick={() => goToPage(page + 1)}
                    disabled={page === totalPages}
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
