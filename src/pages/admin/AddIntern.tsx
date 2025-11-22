import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { storageService } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { extractTextFromPDF } from '@/utils/extractTextFromPDF';
import MentorSuggestion from '@/components/MentorSuggestion';
import { ArrowLeft } from 'lucide-react';

import skillsData from '@/data/skills.json';
import branchData from '@/data/branch.json';

const allSkillsFromJSON = (skillsData && Object.values(skillsData).flat() as string[]) || [];
const allBranchesFromJSON = (branchData && Array.isArray(branchData.engineering_branches_india)) ? branchData.engineering_branches_india : [];

const AddIntern = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [collegeLabels, setCollegeLabels] = useState<string[]>([]);
  
  useEffect(() => {
    if (allBranchesFromJSON.length === 0) {
      console.error("Configuration Error: Branch list is empty. Check 'src/data/branch.json'.");
      toast({
        title: "System Configuration Error",
        description: "Could not load the list of academic branches. Please contact an administrator.",
        variant: "destructive",
        duration: 9000,
      });
    }

    const fetchColleges = async () => {
      try {
        const response = await fetch('/api/colleges'); 
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Network response was not ok: ${response.status} ${response.statusText}. Server says: ${errorText}`);
        }
        const responseData = await response.json();
        if (!responseData || !Array.isArray(responseData.allCollege)) {
          throw new Error("API response did not contain an 'allCollege' array.");
        }
        const data: { name: string }[] = responseData.allCollege;
        const names = data.map(item => item.name);
        setCollegeLabels(names);
      } catch (error: any) {
        console.error("CRITICAL: Failed to fetch or process colleges. Full error object:", error);
        toast({
          title: "Network Error",
          description: "Could not load the list of universities. Please check your connection or contact an administrator.",
          variant: "destructive",
          duration: 9000,
        });
      }
    };
    fetchColleges();
  }, [toast]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    university: '',
    department: '',
    otherDepartment: '',
    skills: '',
    startDate: '',
    endDate: '',
    duration: '',
  });

  const [suggestedMentors, setSuggestedMentors] = useState<
    { mentor: any; score: number }[]
  >([]);
  const [assignedMentorId, setAssignedMentorId] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');

  const durationOptions = [
    { value: '4w', label: '4 Weeks' },
    { value: '6w', label: '6 Weeks' },
    { value: '8w', label: '8 Weeks' },
    { value: '6m', label: '6 Months' },
  ];

  useEffect(() => {
    if (formData.startDate && formData.duration) {
      const startDate = new Date(formData.startDate);
      if (isNaN(startDate.getTime())) {
        setFormData(prev => ({ ...prev, endDate: '' }));
        return;
      };
      const newEndDate = new Date(startDate);
      switch (formData.duration) {
        case '4w': newEndDate.setDate(startDate.getDate() + 4 * 7); break;
        case '6w': newEndDate.setDate(startDate.getDate() + 6 * 7); break;
        case '8w': newEndDate.setDate(startDate.getDate() + 8 * 7); break;
        case '6m': newEndDate.setMonth(startDate.getMonth() + 6); break;
        default: setFormData(prev => ({ ...prev, endDate: '' })); return;
      }
      const formattedEndDate = newEndDate.toISOString().split('T')[0];
      setFormData(prev => ({ ...prev, endDate: formattedEndDate }));
    } else {
      setFormData(prev => ({ ...prev, endDate: '' }));
    }
  }, [formData.startDate, formData.duration]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const extractSkills = (text: string): string[] => {
    if (allSkillsFromJSON.length === 0) return [];
    const foundSkills = new Set<string>();
    allSkillsFromJSON.forEach(skill => {
      const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(^|[^a-zA-Z0-9])${escapedSkill}([^a-zA-Z0-9]|$)`, 'i');
      if (regex.test(text)) foundSkills.add(skill);
    });
    return Array.from(foundSkills);
  };

  const getMatchScore = (mentorSkills: string[], internSkills: string[]): number => {
    if (!mentorSkills || mentorSkills.length === 0) return 0;
    const lowerCaseInternSkills = internSkills.map(s => s.toLowerCase());
    const matched = mentorSkills.filter(skill => lowerCaseInternSkills.includes(skill.toLowerCase()));
    return Math.round((matched.length / mentorSkills.length) * 100);
  };

  const suggestMentors = (extractedSkills: string[]) => {
    const mentors = storageService.getMentorUsers();
    const scored = mentors.map(mentor => ({ mentor, score: getMatchScore(mentor.skills || [], extractedSkills) }));
    const sorted = scored.filter(m => m.score > 0).sort((a, b) => b.score - a.score);
    setSuggestedMentors(sorted);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      try {
        const text = await extractTextFromPDF(file);
        const extractedSkills = extractSkills(text);
        setFormData(prev => ({ ...prev, skills: extractedSkills.join(', ') }));
        toast({ title: "Skills Extracted", description: `Found ${extractedSkills.length} skills from the resume.` });
      } catch (error) {
        toast({ title: "Resume Error", description: "Could not read the uploaded PDF file. Please try another file.", variant: "destructive" });
        setFileName('');
        setFormData(prev => ({ ...prev, skills: '' }));
      }
    } else {
      setFileName('');
      setFormData(prev => ({ ...prev, skills: '' }));
    }
  };

  const handleAssignMentor = (mentorId: string) => {
    const targetIntern = storageService.getInterns().find(i => i.email === formData.email);
    if (targetIntern) {
      storageService.updateIntern(targetIntern.id, { status: 'assigned', mentorId });
      toast({ title: 'Mentor Assigned Successfully' });
      setAssignedMentorId(mentorId);
      navigate('/admin');
    } else {
      toast({ title: 'Error', description: 'Could not find the intern to assign a mentor. Please add the intern first.', variant: "destructive" });
    }
  };
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalDepartment = formData.department === 'Other' ? formData.otherDepartment : formData.department;
    const internData = { ...formData, department: finalDepartment };
    delete (internData as any).otherDepartment; 
    
    storageService.addIntern(internData);
    toast({ title: 'Intern Added', description: 'Mentor suggestions are now available below.' });
    const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(Boolean);
    suggestMentors(skillsArray);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Button variant="ghost" onClick={() => navigate('/admin')} className="mb-4 text-gray-600 hover:text-gray-900">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <Card className="shadow-lg border-gray-200">
          <CardHeader className="bg-gray-50/50 border-b">
            <CardTitle className="text-2xl font-bold text-gray-800">Onboard New Intern</CardTitle>
            <CardDescription>Fill out the form below to add a new intern to the system.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleFormSubmit} className="space-y-8">
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-800 border-b border-blue-100 pb-2">Personal Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={formData.name} onChange={e => handleInputChange('name', e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} type="email" required />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
                    <Input id="phoneNumber" value={formData.phoneNumber} onChange={e => handleInputChange('phoneNumber', e.target.value)} type="tel" pattern="[0-9]{10}" title="Phone number must be 10 digits." />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-800 border-b border-blue-100 pb-2">Academic & Internship Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="university">University</Label>
                    <Input id="university" list="colleges-list" value={formData.university} onChange={e => handleInputChange('university', e.target.value)} placeholder={collegeLabels.length > 0 ? "Search or type university name" : "Loading colleges..."} autoComplete="off" required />
                    <datalist id="colleges-list">{collegeLabels.map(college => (<option key={college} value={college} />))}</datalist>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Branch / Department</Label>
                    <select id="department" value={formData.department} onChange={e => handleInputChange('department', e.target.value)} className="w-full border rounded-md p-2" required>
                      <option value="">Select a Branch</option>
                      {allBranchesFromJSON.map(dep => (<option key={dep} value={dep}>{dep}</option>))}
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  {formData.department === 'Other' && (
                    <div className="space-y-2">
                      <Label htmlFor="otherDepartment">Other Branch</Label>
                      <Input id="otherDepartment" value={formData.otherDepartment} onChange={e => handleInputChange('otherDepartment', e.target.value)} placeholder="Please specify" required />
                    </div>
                  )}
                  <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-4 items-end">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input id="startDate" value={formData.startDate} onChange={e => handleInputChange('startDate', e.target.value)} type="date" min={new Date().toISOString().split('T')[0]} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration</Label>
                      <select id="duration" value={formData.duration} onChange={e => handleInputChange('duration', e.target.value)} className="w-full border rounded-md p-2" required>
                        <option value="">Select...</option>
                        {durationOptions.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <Input id="endDate" value={formData.endDate} readOnly disabled className="bg-gray-100 cursor-not-allowed" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-800 border-b border-blue-100 pb-2">Skills & Resume</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Upload Resume (PDF)</Label>
                    <Label htmlFor="resume" className="w-full text-center cursor-pointer bg-blue-50 text-blue-700 font-semibold py-2 px-4 rounded-md border border-blue-200 hover:bg-blue-100 transition-colors duration-200 block truncate">
                      {fileName || 'Choose File'}
                    </Label>
                    <Input id="resume" type="file" accept="application/pdf" onChange={handleFileUpload} className="hidden" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="skills">Extracted Skills</Label>
                    <Textarea id="skills" value={formData.skills} readOnly placeholder="Skills will be auto-filled from resume." rows={3} className="bg-gray-100 cursor-not-allowed" />
                  </div>
                </div>
              </div>
              
              <Button type="submit" className="w-full text-lg font-semibold py-3">Add Intern & Suggest Mentors</Button>
            </form>

            {suggestedMentors.length > 0 && (
              <div className="mt-10 pt-8 border-t">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Suggested Mentors</h3>
                <div className="space-y-4">
                  {suggestedMentors.map(({ mentor, score }) => (
                    <MentorSuggestion key={mentor.email} mentor={mentor} matchScore={score} isAssigned={assignedMentorId === mentor.id} onAssign={() => handleAssignMentor(mentor.id)} />
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddIntern;