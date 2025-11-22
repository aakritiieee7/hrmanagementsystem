import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  UserPlus,
  Users,
  ClipboardList,
  Award,
  UserCog,
  LogOut,
  BarChart3,
  FileText,
  Lightbulb,
  GraduationCap,
  ShieldCheck,
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigationItems = [
    {
      title: 'Add New Intern',
      description: 'Register new interns via form and resume upload',
      icon: UserPlus,
      path: '/admin/add-intern',
      color: 'bg-blue-800',
    },
    {
      title: 'Assign Mentor',
      description: 'Assign mentors to pending interns',
      icon: Users,
      path: '/admin/assign-mentor',
      color: 'bg-blue-800',
    },
    {
      title: 'Project Details',
      description: 'View ongoing and completed projects',
      icon: ClipboardList,
      path: '/admin/projects',
      color: 'bg-blue-800',
    },
    {
      title: 'Certificate Generation',
      description: 'Generate certificates for completed internships',
      icon: Award,
      path: '/admin/certificate',
      color: 'bg-blue-800',
    },
    {
      title: 'Add Mentor',
      description: 'Create new mentor accounts',
      icon: UserCog,
      path: '/admin/add-mentor',
      color: 'bg-blue-800',
    },
    {
      title: 'Analytics',
      description: 'View system analytics and reports',
      icon: BarChart3,
      path: '/admin/analytics',
      color: 'bg-blue-00',
    },
  ];

  const heroFeatures = [
    {
      title: 'Resume Matching',
      description: 'Automated resume upload, NLP based skill extraction, and mentor matching.',
      icon: UserPlus,
      color: 'text-blue-800',
    },
    {
      title: 'Unified Management',
      description: 'Add mentors, assign interns, track projects, and issue certificates: all in one dashboard.',
      icon: ClipboardList,
      color: 'text-blue-800',
    },
    {
      title: 'Data-Driven Oversight',
      description: 'View clean, interactive analytics to monitor performance and internship trends.',
      icon: BarChart3,
      color: 'text-blue-800',
    },
    {
      title: 'Secure & Compliant',
      description: 'DRDO-grade data protection ensuring security, privacy, and regulatory compliance.',
      icon: ShieldCheck,
      color: 'text-blue-800',
    },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#e3f0ff] to-white">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full bg-white/90 border-b border-gray-200/80 shadow-soft z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10">
                <img
                  src="/drdo_logo.png"
                  alt="DRDO Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-drdo-navy tracking-wide">DRDO HR Portal</h1>
                <p className="text-sm text-muted-foreground">Admin Dashboard</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="border-drdo-navy text-drdo-navy">
                {user?.department}
              </Badge>
              <div className="text-right">
                <p className="text-sm font-medium">{user?.username}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <Button
                aria-label="Logout of admin dashboard"
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-screen pt-24 w-full overflow-hidden bg-gradient-to-b from-[#e3f0ff] via-white to-blue-100">
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[60vh] rounded-full bg-blue-200 opacity-30 blur-3xl"></div>
          <div className="absolute right-0 bottom-0 w-1/3 h-1/3 rounded-full bg-blue-300 opacity-20 blur-2xl"></div>
          <div className="absolute left-0 top-0 w-1/4 h-1/4 rounded-full bg-blue-100 opacity-30 blur-2xl"></div>
        </div>
        <div className="relative z-10 flex flex-col items-center w-full">
          <img
            src="/drdo_logo.png"
            alt="DRDO Logo"
            className="h-28 w-28 mb-8 object-contain"
          />
          <motion.h1
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 text-blue-900 leading-tight text-center w-full"
          >
            Transforming the Way <br /> DRDO Manages Talent.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl text-gray-700 mb-10 font-medium w-full text-center"
          >
            Empowering DRDO with a seamless digital ecosystem for people, projects, and performance.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
              onClick={() => navigate('/admin/add-intern')}
              className="bg-drdo-navy hover:bg-drdo-navy/90 text-white w-full sm:w-auto rounded-none"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Onboard New Intern
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/admin/assign-mentor')}
              className="border-drdo-navy text-drdo-navy hover:bg-drdo-navy/5 hover:text-drdo-navy w-full sm:w-auto rounded-none"
            >
              <UserCog className="w-5 h-5 mr-2" />
              Assign Mentors
            </Button>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto items-stretch h-full"
        >
          {heroFeatures.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center h-full p-6 bg-white/70 backdrop-blur-md rounded-xl shadow-md hover:shadow-lg transition-shadow text-center"
            >
              <feature.icon className={`w-8 h-8 mb-3 ${feature.color}`} />
              <h3 className="font-semibold text-blue-900 text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-700 text-justify">{feature.description}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Main Dashboard */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Welcome, {user?.username}</h2>
          <p className="text-muted-foreground">
            Manage the DRDO internship program from this central hub. Monitor progress, assign mentors, and track achievements.
          </p>
        </div>
        
        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {navigationItems.map((item, index) => (
            <Card
              key={index}
              className="cursor-pointer hover:shadow-elevated transition-all duration-200 hover:scale-105 shadow-card"
              onClick={() => navigate(item.path)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-drdo-navy">{item.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  {item.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;