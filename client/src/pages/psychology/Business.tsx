import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie } from "recharts";
import { DollarSign, BarChart3, ShoppingCart, Plus, ArrowUpRight, ArrowDownRight, Eye, LineChart as LineChartIcon, PlusCircle } from "lucide-react";

export default function Business() {
  const [activeTab, setActiveTab] = useState("turning-point");
  const [showAddRevenueDialog, setShowAddRevenueDialog] = useState(false);
  const [showAddInventoryDialog, setShowAddInventoryDialog] = useState(false);

  // Sample data for demonstration
  const revenueData = [
    { month: 'Jan', revenue: 4000, expenses: 2400 },
    { month: 'Feb', revenue: 3000, expenses: 1398 },
    { month: 'Mar', revenue: 9800, expenses: 2000 },
    { month: 'Apr', revenue: 3908, expenses: 2780 },
    { month: 'May', revenue: 4800, expenses: 1890 },
    { month: 'Jun', revenue: 3800, expenses: 2390 },
  ];

  const inventoryData = [
    { name: 'Test Materials', value: 65, color: '#0088FE' },
    { name: 'Assessment Forms', value: 15, color: '#00C49F' },
    { name: 'Office Supplies', value: 10, color: '#FFBB28' },
    { name: 'Technology', value: 10, color: '#FF8042' },
  ];

  const inventoryItems = [
    { id: 1, name: "WISC-V Record Forms", category: "Assessment Forms", quantity: 12, threshold: 5, unitPrice: 75.99, lastOrdered: "2025-04-15" },
    { id: 2, name: "WIAT-4 Response Booklets", category: "Assessment Forms", quantity: 3, threshold: 5, unitPrice: 69.50, lastOrdered: "2025-04-02" },
    { id: 3, name: "BASC-3 Parent Rating Scales", category: "Assessment Forms", quantity: 8, threshold: 10, unitPrice: 42.75, lastOrdered: "2025-03-20" },
    { id: 4, name: "iPad Pro (12.9\")", category: "Technology", quantity: 2, threshold: 1, unitPrice: 1099.00, lastOrdered: "2024-11-10" },
    { id: 5, name: "Color Printer Toner", category: "Office Supplies", quantity: 1, threshold: 2, unitPrice: 129.99, lastOrdered: "2025-04-10" },
  ];

  const revenueCategories = [
    { name: "Assessments", amount: 12500, percentChange: 8.5, direction: "up" },
    { name: "Consultations", amount: 8750, percentChange: 12.3, direction: "up" },
    { name: "Training", amount: 5200, percentChange: -2.1, direction: "down" },
    { name: "Grants", amount: 15000, percentChange: 0, direction: "none" },
  ];

  return (
    <div className="container p-4 mx-auto">
      <h1 className="text-3xl font-bold mb-6">Business Operations</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="turning-point">Turning Point Collective</TabsTrigger>
          <TabsTrigger value="pivot-point">Pivot Point Psychology</TabsTrigger>
          <TabsTrigger value="biscuit-sisters">Biscuit Sisters'</TabsTrigger>
          <TabsTrigger value="investment">Investment LLC</TabsTrigger>
        </TabsList>
        
        {/* Turning Point Collective Tab */}
        <TabsContent value="turning-point" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Turning Point Collective, LLC</CardTitle>
                <CardDescription>Umbrella company for clinical services and retail operations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total YTD Revenue</p>
                    <p className="text-2xl font-bold">$170,500</p>
                    <p className="text-xs text-muted-foreground mt-1">Combined from all subsidiaries</p>
                  </div>
                  <div className="flex items-center text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-1 rounded-full text-xs">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    15.3%
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    New Transaction
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Reports
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Portfolio Summary</CardTitle>
                <CardDescription>Performance by subsidiary</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Pivot Point Psychology:</span>
                    <span className="text-sm font-medium">$64,750.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Biscuit Sisters' Northern Batch:</span>
                    <span className="text-sm font-medium">$18,250.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Investment LLC:</span>
                    <span className="text-sm font-medium">$87,500.00</span>
                  </div>
                  <div className="pt-1 border-t">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Total Portfolio Value:</span>
                      <span className="text-sm font-medium text-emerald-600 dark:text-emerald-500">$170,500.00</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="revenue" className="w-full">
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="revenue">Revenue & Expenses</TabsTrigger>
              <TabsTrigger value="clients">Client Management</TabsTrigger>
              <TabsTrigger value="reports">Financial Reports</TabsTrigger>
              <TabsTrigger value="documents">Invoices & Tax Forms</TabsTrigger>
            </TabsList>
            
            <TabsContent value="revenue" className="mt-4 space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Revenue Overview</CardTitle>
                    <CardDescription>Monthly revenue and expenses</CardDescription>
                  </div>
                  <Button onClick={() => setShowAddRevenueDialog(true)} size="sm" className="h-8">
                    <Plus className="h-4 w-4 mr-1" /> Add Entry
                  </Button>
                </CardHeader>
                <CardContent className="pl-2">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="revenue" name="Revenue" fill="#8884d8" />
                      <Bar dataKey="expenses" name="Expenses" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Latest financial activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>May 20, 2025</TableCell>
                        <TableCell>WISC-V Assessment</TableCell>
                        <TableCell>Assessment</TableCell>
                        <TableCell>Income</TableCell>
                        <TableCell className="text-right text-emerald-600 dark:text-emerald-500">$550.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>May 19, 2025</TableCell>
                        <TableCell>Parent Consultation</TableCell>
                        <TableCell>Consultation</TableCell>
                        <TableCell>Income</TableCell>
                        <TableCell className="text-right text-emerald-600 dark:text-emerald-500">$175.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>May 18, 2025</TableCell>
                        <TableCell>Assessment Materials</TableCell>
                        <TableCell>Supplies</TableCell>
                        <TableCell>Expense</TableCell>
                        <TableCell className="text-right text-rose-600 dark:text-rose-500">-$245.75</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>May 15, 2025</TableCell>
                        <TableCell>School Workshop</TableCell>
                        <TableCell>Training</TableCell>
                        <TableCell>Income</TableCell>
                        <TableCell className="text-right text-emerald-600 dark:text-emerald-500">$1,200.00</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="clients" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Client Management</CardTitle>
                  <CardDescription>Manage your client relationships and services</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    Client management interface will be implemented here
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reports" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Financial Reports</CardTitle>
                  <CardDescription>View and export financial reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    Financial reporting interface will be implemented here
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="documents" className="mt-4 space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Invoice Generator</CardTitle>
                    <CardDescription>Create and manage client invoices</CardDescription>
                  </div>
                  <Button size="sm" className="h-8">
                    <Plus className="h-4 w-4 mr-1" /> New Invoice
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="col-span-1">
                        <Label htmlFor="invoice-template">Template</Label>
                        <Select defaultValue="clinical">
                          <SelectTrigger id="invoice-template">
                            <SelectValue placeholder="Select template" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="clinical">Clinical Services</SelectItem>
                            <SelectItem value="consulting">Consulting</SelectItem>
                            <SelectItem value="retail">Retail Products</SelectItem>
                            <SelectItem value="training">Training & Workshop</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-1">
                        <Label htmlFor="invoice-client">Client</Label>
                        <Select>
                          <SelectTrigger id="invoice-client">
                            <SelectValue placeholder="Select client" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="smith-district">Smith School District</SelectItem>
                            <SelectItem value="johnson-clinic">Johnson Family Clinic</SelectItem>
                            <SelectItem value="riverside">Riverside Medical Center</SelectItem>
                            <SelectItem value="individual">Individual Client</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-1">
                        <Label htmlFor="invoice-date">Invoice Date</Label>
                        <Input
                          id="invoice-date"
                          type="date"
                          defaultValue={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </div>
                    
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[300px]">Description</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Rate</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <Input placeholder="Item description" defaultValue="Psychological Assessment" />
                          </TableCell>
                          <TableCell>
                            <Input type="number" defaultValue="1" className="w-20" />
                          </TableCell>
                          <TableCell>
                            <Input type="number" defaultValue="350.00" className="w-24" />
                          </TableCell>
                          <TableCell className="text-right">$350.00</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <Input placeholder="Item description" defaultValue="Report Writing (hours)" />
                          </TableCell>
                          <TableCell>
                            <Input type="number" defaultValue="3" className="w-20" />
                          </TableCell>
                          <TableCell>
                            <Input type="number" defaultValue="150.00" className="w-24" />
                          </TableCell>
                          <TableCell className="text-right">$450.00</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={3} className="text-right font-medium">
                            Subtotal
                          </TableCell>
                          <TableCell className="text-right font-medium">$800.00</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={3} className="text-right font-medium">
                            Tax (0%)
                          </TableCell>
                          <TableCell className="text-right font-medium">$0.00</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={3} className="text-right font-bold">
                            Total
                          </TableCell>
                          <TableCell className="text-right font-bold">$800.00</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                    
                    <div className="flex justify-end gap-2">
                      <Button variant="outline">Save Draft</Button>
                      <Button>Generate PDF</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Tax Forms</CardTitle>
                    <CardDescription>Manage business tax documentation</CardDescription>
                  </div>
                  <Button size="sm" className="h-8">
                    <Plus className="h-4 w-4 mr-1" /> New Form
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Form Type</TableHead>
                        <TableHead>Tax Year</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Form 1099-NEC</TableCell>
                        <TableCell>2024</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                            In Progress
                          </span>
                        </TableCell>
                        <TableCell>Jan 31, 2025</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">Edit</Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Schedule C</TableCell>
                        <TableCell>2024</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                            In Progress
                          </span>
                        </TableCell>
                        <TableCell>Apr 15, 2025</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">Edit</Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Form W-9</TableCell>
                        <TableCell>2024</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            Completed
                          </span>
                        </TableCell>
                        <TableCell>N/A</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">View</Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Form 941</TableCell>
                        <TableCell>2024 Q1</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            Completed
                          </span>
                        </TableCell>
                        <TableCell>Apr 30, 2024</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">View</Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>
        
        {/* Pivot Point Psychology Tab */}
        <TabsContent value="pivot-point" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Pivot Point Psychology</CardTitle>
                <CardDescription>Clinical psychology practice</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">YTD Revenue</p>
                    <p className="text-2xl font-bold">$64,750</p>
                  </div>
                  <div className="flex items-center text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-1 rounded-full text-xs">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    8.3%
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    New Transaction
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Reports
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Financial Summary</CardTitle>
                <CardDescription>Past 30 days performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Revenue:</span>
                    <span className="text-sm font-medium">$9,250.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Expenses:</span>
                    <span className="text-sm font-medium">$2,750.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Net Profit:</span>
                    <span className="text-sm font-medium text-emerald-600 dark:text-emerald-500">$6,500.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Profit Margin:</span>
                    <span className="text-sm font-medium">70.27%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Pending Invoices:</span>
                    <span className="text-sm font-medium">$2,450.00</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="revenue" className="w-full">
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="revenue">Revenue & Expenses</TabsTrigger>
              <TabsTrigger value="insurance">Insurance Billing</TabsTrigger>
              <TabsTrigger value="schedules">Schedules</TabsTrigger>
              <TabsTrigger value="documents">Invoices & Tax Forms</TabsTrigger>
            </TabsList>
            
            <TabsContent value="revenue" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Management</CardTitle>
                  <CardDescription>Track and manage your clinical revenue</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    Revenue management interface will be implemented here
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="insurance" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Insurance Billing</CardTitle>
                  <CardDescription>Manage insurance claims and reimbursements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    Insurance billing interface will be implemented here
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="schedules" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Clinical Schedules</CardTitle>
                  <CardDescription>Manage appointment schedules</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    Schedule management interface will be implemented here
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="documents" className="mt-4 space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Clinical Invoice Generator</CardTitle>
                    <CardDescription>Create invoices for clinical services</CardDescription>
                  </div>
                  <Button size="sm" className="h-8">
                    <Plus className="h-4 w-4 mr-1" /> New Invoice
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="col-span-1">
                        <Label htmlFor="clinical-invoice-type">Service Type</Label>
                        <Select defaultValue="assessment">
                          <SelectTrigger id="clinical-invoice-type">
                            <SelectValue placeholder="Select service type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="assessment">Psychological Assessment</SelectItem>
                            <SelectItem value="therapy">Therapy Session</SelectItem>
                            <SelectItem value="consultation">Consultation</SelectItem>
                            <SelectItem value="evaluation">Educational Evaluation</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-1">
                        <Label htmlFor="clinical-patient">Patient/Client</Label>
                        <Select>
                          <SelectTrigger id="clinical-patient">
                            <SelectValue placeholder="Select patient" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="smith">J. Smith</SelectItem>
                            <SelectItem value="johnson">E. Johnson</SelectItem>
                            <SelectItem value="williams">N. Williams</SelectItem>
                            <SelectItem value="brown">O. Brown</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-1">
                        <Label htmlFor="clinical-date">Service Date</Label>
                        <Input
                          id="clinical-date"
                          type="date"
                          defaultValue={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="col-span-1">
                        <Label htmlFor="insurance-provider">Insurance Provider</Label>
                        <Select defaultValue="bcbs">
                          <SelectTrigger id="insurance-provider">
                            <SelectValue placeholder="Select provider" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bcbs">Blue Cross Blue Shield</SelectItem>
                            <SelectItem value="aetna">Aetna</SelectItem>
                            <SelectItem value="cigna">Cigna</SelectItem>
                            <SelectItem value="unitedhealth">UnitedHealthcare</SelectItem>
                            <SelectItem value="self">Self-Pay</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-1">
                        <Label htmlFor="cpt-code">CPT Code</Label>
                        <Select defaultValue="90791">
                          <SelectTrigger id="cpt-code">
                            <SelectValue placeholder="Select CPT code" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="90791">90791 - Psychiatric Diagnostic Evaluation</SelectItem>
                            <SelectItem value="96101">96101 - Psychological Testing</SelectItem>
                            <SelectItem value="90834">90834 - Psychotherapy, 45 min</SelectItem>
                            <SelectItem value="90846">90846 - Family Therapy without Patient</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-1">
                        <Label htmlFor="diagnosis-code">Diagnosis Code (ICD-10)</Label>
                        <Select>
                          <SelectTrigger id="diagnosis-code">
                            <SelectValue placeholder="Select diagnosis code" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="f41.1">F41.1 - Generalized Anxiety Disorder</SelectItem>
                            <SelectItem value="f32.1">F32.1 - Major Depressive Disorder</SelectItem>
                            <SelectItem value="f90.0">F90.0 - ADHD</SelectItem>
                            <SelectItem value="f84.0">F84.0 - Autism Spectrum Disorder</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[300px]">Service Description</TableHead>
                          <TableHead>CPT Code</TableHead>
                          <TableHead>Units</TableHead>
                          <TableHead className="text-right">Rate</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <Input placeholder="Service description" defaultValue="Psychological Assessment" />
                          </TableCell>
                          <TableCell>
                            <Input defaultValue="96101" className="w-20" />
                          </TableCell>
                          <TableCell>
                            <Input type="number" defaultValue="1" className="w-16" />
                          </TableCell>
                          <TableCell>
                            <Input type="number" defaultValue="225.00" className="w-24" />
                          </TableCell>
                          <TableCell className="text-right">$225.00</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={4} className="text-right font-medium">
                            Total Charges
                          </TableCell>
                          <TableCell className="text-right font-medium">$225.00</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={4} className="text-right font-medium">
                            Insurance Responsibility (80%)
                          </TableCell>
                          <TableCell className="text-right font-medium">$180.00</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={4} className="text-right font-bold">
                            Patient Responsibility
                          </TableCell>
                          <TableCell className="text-right font-bold">$45.00</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                    
                    <div className="flex justify-end gap-2">
                      <Button variant="outline">Save Draft</Button>
                      <Button>Submit to Insurance</Button>
                      <Button>Generate PDF</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Tax Forms & Compliance</CardTitle>
                    <CardDescription>Manage healthcare-specific tax documents</CardDescription>
                  </div>
                  <Button size="sm" className="h-8">
                    <Plus className="h-4 w-4 mr-1" /> New Form
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Form Type</TableHead>
                        <TableHead>Purpose</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">HIPAA Compliance</TableCell>
                        <TableCell>Annual Assessment</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            Completed
                          </span>
                        </TableCell>
                        <TableCell>Mar 31, 2025</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">View</Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Form 1099-NEC</TableCell>
                        <TableCell>Contractor Payments</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                            In Progress
                          </span>
                        </TableCell>
                        <TableCell>Jan 31, 2025</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">Edit</Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">NPI Registration</TableCell>
                        <TableCell>Provider Identification</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            Completed
                          </span>
                        </TableCell>
                        <TableCell>N/A</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">View</Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Schedule C</TableCell>
                        <TableCell>Tax Filing</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                            Not Started
                          </span>
                        </TableCell>
                        <TableCell>Apr 15, 2025</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">Start</Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>
        
        {/* Biscuit Sisters' Tab */}
        <TabsContent value="biscuit-sisters" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Biscuit Sisters' Northern Batch</CardTitle>
                <CardDescription>Artisan dog treats business</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">YTD Revenue</p>
                    <p className="text-2xl font-bold">$18,250</p>
                  </div>
                  <div className="flex items-center text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-1 rounded-full text-xs">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    23.7%
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="w-full justify-start">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Inventory
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Sales Report
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Inventory Status</CardTitle>
                <CardDescription>Current product inventory</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm">Peanut Butter Biscuits:</span>
                      <span className="text-sm font-medium">65 units</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm">Chicken & Sweet Potato:</span>
                      <span className="text-sm font-medium">32 units</span>
                    </div>
                    <Progress value={32} className="h-2" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm">Blueberry Treats:</span>
                      <span className="text-sm font-medium text-amber-600 dark:text-amber-500">8 units</span>
                    </div>
                    <Progress value={8} className="h-2" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm">Salmon Crisps:</span>
                      <span className="text-sm font-medium text-rose-600 dark:text-rose-500">3 units</span>
                    </div>
                    <Progress value={3} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="inventory" className="w-full">
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="recipes">Recipes</TabsTrigger>
              <TabsTrigger value="documents">Invoices & Tax Forms</TabsTrigger>
            </TabsList>
            
            <TabsContent value="inventory" className="mt-4 space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Inventory Management</CardTitle>
                    <CardDescription>Track and manage your product inventory</CardDescription>
                  </div>
                  <Button onClick={() => setShowAddInventoryDialog(true)} size="sm" className="h-8">
                    <Plus className="h-4 w-4 mr-1" /> Add Item
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Unit Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Peanut Butter Biscuits</TableCell>
                        <TableCell>Treats</TableCell>
                        <TableCell>65</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            In Stock
                          </span>
                        </TableCell>
                        <TableCell className="text-right">$8.99</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Chicken & Sweet Potato</TableCell>
                        <TableCell>Treats</TableCell>
                        <TableCell>32</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            In Stock
                          </span>
                        </TableCell>
                        <TableCell className="text-right">$10.99</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Blueberry Treats</TableCell>
                        <TableCell>Treats</TableCell>
                        <TableCell>8</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                            Low Stock
                          </span>
                        </TableCell>
                        <TableCell className="text-right">$9.49</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Salmon Crisps</TableCell>
                        <TableCell>Treats</TableCell>
                        <TableCell>3</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                            Very Low
                          </span>
                        </TableCell>
                        <TableCell className="text-right">$12.99</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="orders" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Order Management</CardTitle>
                  <CardDescription>Track and fulfill customer orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    Order management interface will be implemented here
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="recipes" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recipe Management</CardTitle>
                  <CardDescription>Manage product recipes and ingredients</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    Recipe management interface will be implemented here
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="documents" className="mt-4 space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Retail Invoice Generator</CardTitle>
                    <CardDescription>Create invoices for retail sales and B2B orders</CardDescription>
                  </div>
                  <Button size="sm" className="h-8">
                    <Plus className="h-4 w-4 mr-1" /> New Invoice
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="col-span-1">
                        <Label htmlFor="retail-invoice-type">Invoice Type</Label>
                        <Select defaultValue="retail">
                          <SelectTrigger id="retail-invoice-type">
                            <SelectValue placeholder="Select invoice type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="retail">Retail Sale</SelectItem>
                            <SelectItem value="wholesale">Wholesale Order</SelectItem>
                            <SelectItem value="custom">Custom Order</SelectItem>
                            <SelectItem value="subscription">Subscription Box</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-1">
                        <Label htmlFor="retail-customer">Customer</Label>
                        <Select>
                          <SelectTrigger id="retail-customer">
                            <SelectValue placeholder="Select customer" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="petco">Petco Downtown</SelectItem>
                            <SelectItem value="natural-pets">Natural Pets Market</SelectItem>
                            <SelectItem value="doggy-daycare">Happy Tails Doggy Daycare</SelectItem>
                            <SelectItem value="individual">Individual Customer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-1">
                        <Label htmlFor="invoice-date">Invoice Date</Label>
                        <Input
                          id="invoice-date"
                          type="date"
                          defaultValue={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </div>
                    
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[300px]">Product</TableHead>
                          <TableHead>SKU</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead className="text-right">Unit Price</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <Input placeholder="Product name" defaultValue="Peanut Butter Biscuits (12oz bag)" />
                          </TableCell>
                          <TableCell>
                            <Input defaultValue="PBB-12OZ" className="w-24" />
                          </TableCell>
                          <TableCell>
                            <Input type="number" defaultValue="24" className="w-16" />
                          </TableCell>
                          <TableCell>
                            <Input type="number" defaultValue="5.75" className="w-20" />
                          </TableCell>
                          <TableCell className="text-right">$138.00</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <Input placeholder="Product name" defaultValue="Chicken & Sweet Potato Treats (8oz bag)" />
                          </TableCell>
                          <TableCell>
                            <Input defaultValue="CSP-8OZ" className="w-24" />
                          </TableCell>
                          <TableCell>
                            <Input type="number" defaultValue="12" className="w-16" />
                          </TableCell>
                          <TableCell>
                            <Input type="number" defaultValue="6.50" className="w-20" />
                          </TableCell>
                          <TableCell className="text-right">$78.00</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={4} className="text-right font-medium">
                            Subtotal
                          </TableCell>
                          <TableCell className="text-right font-medium">$216.00</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={4} className="text-right font-medium">
                            Discount (10%)
                          </TableCell>
                          <TableCell className="text-right font-medium">-$21.60</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={4} className="text-right font-medium">
                            Tax (6%)
                          </TableCell>
                          <TableCell className="text-right font-medium">$11.66</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={4} className="text-right font-bold">
                            Total
                          </TableCell>
                          <TableCell className="text-right font-bold">$206.06</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                    
                    <div className="flex justify-end gap-2">
                      <Button variant="outline">Save Draft</Button>
                      <Button>Generate PDF</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Tax & Regulatory Forms</CardTitle>
                    <CardDescription>Manage food business tax and regulatory documentation</CardDescription>
                  </div>
                  <Button size="sm" className="h-8">
                    <Plus className="h-4 w-4 mr-1" /> New Form
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Form Type</TableHead>
                        <TableHead>Purpose</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Food Handler Permit</TableCell>
                        <TableCell>Health Department</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            Current
                          </span>
                        </TableCell>
                        <TableCell>Oct 15, 2025</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">View</Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Sales Tax License</TableCell>
                        <TableCell>State Revenue Dept</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            Current
                          </span>
                        </TableCell>
                        <TableCell>Annual Renewal</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">View</Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Form 1099-K</TableCell>
                        <TableCell>Payment Processing</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                            Pending
                          </span>
                        </TableCell>
                        <TableCell>Jan 31, 2025</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">View</Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Schedule C</TableCell>
                        <TableCell>Business Income</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                            Not Started
                          </span>
                        </TableCell>
                        <TableCell>Apr 15, 2025</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">Start</Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>
        
        {/* Investment LLC Tab */}
        <TabsContent value="investment" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Investment LLC</CardTitle>
                <CardDescription>Investment portfolio management</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Portfolio Value</p>
                    <p className="text-2xl font-bold">$143,250</p>
                  </div>
                  <div className="flex items-center text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-1 rounded-full text-xs">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    6.2%
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="w-full justify-start">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    New Position
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <LineChartIcon className="h-4 w-4 mr-2" />
                    View Performance
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Portfolio Allocation</CardTitle>
                <CardDescription>Current asset distribution</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="h-[160px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Stocks', value: 45, fill: '#8884d8' },
                          { name: 'ETFs', value: 30, fill: '#82ca9d' },
                          { name: 'Bonds', value: 15, fill: '#ffc658' },
                          { name: 'Cash', value: 10, fill: '#ff8042' },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="portfolio" className="w-full">
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
              <TabsTrigger value="documents">Invoices & Tax Forms</TabsTrigger>
            </TabsList>
            
            <TabsContent value="portfolio" className="mt-4 space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Investment Portfolio</CardTitle>
                    <CardDescription>Current holdings and performance</CardDescription>
                  </div>
                  <Button size="sm" className="h-8">
                    <Plus className="h-4 w-4 mr-1" /> Add Position
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Symbol</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Avg. Cost</TableHead>
                        <TableHead>Current</TableHead>
                        <TableHead className="text-right">Gain/Loss</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">AAPL</TableCell>
                        <TableCell>Apple Inc.</TableCell>
                        <TableCell>25 shares</TableCell>
                        <TableCell>$175.32</TableCell>
                        <TableCell>$198.75</TableCell>
                        <TableCell className="text-right text-emerald-600 dark:text-emerald-500">+13.36%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">MSFT</TableCell>
                        <TableCell>Microsoft Corp</TableCell>
                        <TableCell>15 shares</TableCell>
                        <TableCell>$310.45</TableCell>
                        <TableCell>$342.88</TableCell>
                        <TableCell className="text-right text-emerald-600 dark:text-emerald-500">+10.45%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">VTI</TableCell>
                        <TableCell>Vanguard Total Stock Market ETF</TableCell>
                        <TableCell>40 shares</TableCell>
                        <TableCell>$220.14</TableCell>
                        <TableCell>$235.67</TableCell>
                        <TableCell className="text-right text-emerald-600 dark:text-emerald-500">+7.05%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">BND</TableCell>
                        <TableCell>Vanguard Total Bond Market ETF</TableCell>
                        <TableCell>50 shares</TableCell>
                        <TableCell>$72.88</TableCell>
                        <TableCell>$71.45</TableCell>
                        <TableCell className="text-right text-rose-600 dark:text-rose-500">-1.96%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Performance Chart</CardTitle>
                  <CardDescription>Portfolio performance over time</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={[
                      { month: 'Jan', portfolio: 132500, benchmark: 130000 },
                      { month: 'Feb', portfolio: 134800, benchmark: 131200 },
                      { month: 'Mar', portfolio: 137200, benchmark: 132500 },
                      { month: 'Apr', portfolio: 140100, benchmark: 134000 },
                      { month: 'May', portfolio: 143250, benchmark: 135800 },
                    ]} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="portfolio" name="Portfolio" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="benchmark" name="Benchmark" stroke="#82ca9d" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="transactions" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>Record of all investment transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Symbol</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>May 18, 2025</TableCell>
                        <TableCell>AAPL</TableCell>
                        <TableCell>Buy</TableCell>
                        <TableCell>5</TableCell>
                        <TableCell>$198.75</TableCell>
                        <TableCell className="text-right">$993.75</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>May 12, 2025</TableCell>
                        <TableCell>VTI</TableCell>
                        <TableCell>Buy</TableCell>
                        <TableCell>10</TableCell>
                        <TableCell>$235.67</TableCell>
                        <TableCell className="text-right">$2,356.70</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>May 5, 2025</TableCell>
                        <TableCell>INTC</TableCell>
                        <TableCell>Sell</TableCell>
                        <TableCell>20</TableCell>
                        <TableCell>$32.45</TableCell>
                        <TableCell className="text-right">$649.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Apr 28, 2025</TableCell>
                        <TableCell>MSFT</TableCell>
                        <TableCell>Buy</TableCell>
                        <TableCell>3</TableCell>
                        <TableCell>$342.88</TableCell>
                        <TableCell className="text-right">$1,028.64</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="watchlist" className="mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Investment Watchlist</CardTitle>
                    <CardDescription>Track potential investments</CardDescription>
                  </div>
                  <Button size="sm" className="h-8">
                    <Plus className="h-4 w-4 mr-1" /> Add to Watchlist
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Symbol</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Current Price</TableHead>
                        <TableHead>1d Change</TableHead>
                        <TableHead>7d Change</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">NVDA</TableCell>
                        <TableCell>NVIDIA Corporation</TableCell>
                        <TableCell>$925.75</TableCell>
                        <TableCell className="text-emerald-600 dark:text-emerald-500">+2.34%</TableCell>
                        <TableCell className="text-emerald-600 dark:text-emerald-500">+8.65%</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">TSLA</TableCell>
                        <TableCell>Tesla Inc</TableCell>
                        <TableCell>$187.32</TableCell>
                        <TableCell className="text-rose-600 dark:text-rose-500">-1.25%</TableCell>
                        <TableCell className="text-emerald-600 dark:text-emerald-500">+3.45%</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">AMZN</TableCell>
                        <TableCell>Amazon.com Inc</TableCell>
                        <TableCell>$182.45</TableCell>
                        <TableCell className="text-emerald-600 dark:text-emerald-500">+0.85%</TableCell>
                        <TableCell className="text-emerald-600 dark:text-emerald-500">+2.75%</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">SCHD</TableCell>
                        <TableCell>Schwab US Dividend Equity ETF</TableCell>
                        <TableCell>$78.34</TableCell>
                        <TableCell className="text-emerald-600 dark:text-emerald-500">+0.45%</TableCell>
                        <TableCell className="text-rose-600 dark:text-rose-500">-0.25%</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="documents" className="mt-4 space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Investment Tax Documents</CardTitle>
                    <CardDescription>Manage investment-related tax forms</CardDescription>
                  </div>
                  <Button size="sm" className="h-8">
                    <Plus className="h-4 w-4 mr-1" /> New Document
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="col-span-1">
                        <Label htmlFor="tax-year">Tax Year</Label>
                        <Select defaultValue="2024">
                          <SelectTrigger id="tax-year">
                            <SelectValue placeholder="Select tax year" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2024">2024</SelectItem>
                            <SelectItem value="2023">2023</SelectItem>
                            <SelectItem value="2022">2022</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-1">
                        <Label htmlFor="document-type">Document Type</Label>
                        <Select defaultValue="1099-div">
                          <SelectTrigger id="document-type">
                            <SelectValue placeholder="Select document type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1099-div">1099-DIV (Dividends)</SelectItem>
                            <SelectItem value="1099-b">1099-B (Securities Sales)</SelectItem>
                            <SelectItem value="1099-int">1099-INT (Interest Income)</SelectItem>
                            <SelectItem value="k1">Schedule K-1</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-1">
                        <Label htmlFor="institution">Financial Institution</Label>
                        <Select>
                          <SelectTrigger id="institution">
                            <SelectValue placeholder="Select institution" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="vanguard">Vanguard</SelectItem>
                            <SelectItem value="fidelity">Fidelity</SelectItem>
                            <SelectItem value="schwab">Charles Schwab</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Form Type</TableHead>
                          <TableHead>Tax Year</TableHead>
                          <TableHead>Institution</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">1099-DIV</TableCell>
                          <TableCell>2024</TableCell>
                          <TableCell>Vanguard</TableCell>
                          <TableCell>
                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                              Received
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">View</Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">1099-B</TableCell>
                          <TableCell>2024</TableCell>
                          <TableCell>Fidelity</TableCell>
                          <TableCell>
                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                              Pending
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">View</Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Schedule K-1</TableCell>
                          <TableCell>2024</TableCell>
                          <TableCell>Real Estate Partnership</TableCell>
                          <TableCell>
                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400">
                              Expected Feb 2025
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">Remind</Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Capital Gains Planner</CardTitle>
                    <CardDescription>Plan and track investment tax impacts</CardDescription>
                  </div>
                  <Button size="sm" className="h-8">
                    <Plus className="h-4 w-4 mr-1" /> Add Transaction
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="bg-gray-50 dark:bg-gray-900">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Year-to-Date Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Short-term Gains</p>
                              <p className="text-lg font-medium text-emerald-600 dark:text-emerald-500">$2,450.00</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Long-term Gains</p>
                              <p className="text-lg font-medium text-emerald-600 dark:text-emerald-500">$5,785.00</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Tax Rate (Est.)</p>
                              <p className="text-lg font-medium">22% / 15%</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Estimated Tax</p>
                              <p className="text-lg font-medium text-rose-600 dark:text-rose-500">$1,407.00</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-gray-50 dark:bg-gray-900">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Tax Loss Harvesting</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Realized Losses</p>
                              <p className="text-lg font-medium text-amber-600 dark:text-amber-500">-$950.00</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Tax Savings (Est.)</p>
                              <p className="text-lg font-medium text-emerald-600 dark:text-emerald-500">$209.00</p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-sm text-muted-foreground">Harvesting Opportunities</p>
                              <p className="text-lg font-medium">3 positions identified</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Symbol</TableHead>
                          <TableHead>Purchase Date</TableHead>
                          <TableHead>Cost Basis</TableHead>
                          <TableHead>Current Value</TableHead>
                          <TableHead>Gain/Loss</TableHead>
                          <TableHead className="text-right">Tax Impact</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">AAPL</TableCell>
                          <TableCell>Jan 15, 2023</TableCell>
                          <TableCell>$4,383.00</TableCell>
                          <TableCell>$4,968.75</TableCell>
                          <TableCell className="text-emerald-600 dark:text-emerald-500">+$585.75</TableCell>
                          <TableCell className="text-right text-rose-600 dark:text-rose-500">$87.86</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">INTC</TableCell>
                          <TableCell>Mar 22, 2024</TableCell>
                          <TableCell>$1,675.00</TableCell>
                          <TableCell>$1,298.00</TableCell>
                          <TableCell className="text-rose-600 dark:text-rose-500">-$377.00</TableCell>
                          <TableCell className="text-right text-emerald-600 dark:text-emerald-500">-$82.94</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">VTI</TableCell>
                          <TableCell>Nov 5, 2021</TableCell>
                          <TableCell>$8,805.60</TableCell>
                          <TableCell>$9,426.80</TableCell>
                          <TableCell className="text-emerald-600 dark:text-emerald-500">+$621.20</TableCell>
                          <TableCell className="text-right text-rose-600 dark:text-rose-500">$93.18</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
      
      {/* Add Revenue Dialog */}
      <Dialog open={showAddRevenueDialog} onOpenChange={setShowAddRevenueDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Revenue Entry</DialogTitle>
            <DialogDescription>
              Record a new revenue or expense transaction.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="transaction-date" className="text-right">
                Date
              </Label>
              <Input
                id="transaction-date"
                type="date"
                defaultValue={new Date().toISOString().split('T')[0]}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="transaction-type" className="text-right">
                Type
              </Label>
              <Select defaultValue="income">
                <SelectTrigger className="col-span-3" id="transaction-type">
                  <SelectValue placeholder="Select transaction type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="transaction-category" className="text-right">
                Category
              </Label>
              <Select>
                <SelectTrigger className="col-span-3" id="transaction-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="assessment">Assessment</SelectItem>
                  <SelectItem value="consultation">Consultation</SelectItem>
                  <SelectItem value="training">Training</SelectItem>
                  <SelectItem value="supplies">Supplies</SelectItem>
                  <SelectItem value="rent">Rent/Office</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="transaction-amount" className="text-right">
                Amount
              </Label>
              <Input
                id="transaction-amount"
                type="number"
                placeholder="0.00"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="transaction-description" className="text-right">
                Description
              </Label>
              <Input
                id="transaction-description"
                placeholder="Brief description"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddRevenueDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowAddRevenueDialog(false)}>Save Transaction</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Inventory Dialog */}
      <Dialog open={showAddInventoryDialog} onOpenChange={setShowAddInventoryDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Inventory Item</DialogTitle>
            <DialogDescription>
              Add a new item to your inventory.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="item-name" className="text-right">
                Name
              </Label>
              <Input
                id="item-name"
                placeholder="Item name"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="item-category" className="text-right">
                Category
              </Label>
              <Select>
                <SelectTrigger className="col-span-3" id="item-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="treats">Treats</SelectItem>
                  <SelectItem value="supplements">Supplements</SelectItem>
                  <SelectItem value="toys">Toys</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                  <SelectItem value="ingredients">Ingredients</SelectItem>
                  <SelectItem value="packaging">Packaging</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="item-quantity" className="text-right">
                Quantity
              </Label>
              <Input
                id="item-quantity"
                type="number"
                placeholder="0"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="item-threshold" className="text-right">
                Alert Threshold
              </Label>
              <Input
                id="item-threshold"
                type="number"
                placeholder="5"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="item-price" className="text-right">
                Unit Price
              </Label>
              <Input
                id="item-price"
                type="number"
                placeholder="0.00"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddInventoryDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowAddInventoryDialog(false)}>Add Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}