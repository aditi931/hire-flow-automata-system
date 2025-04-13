
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Calendar, Clock, Users } from 'lucide-react';

const Index = () => {
  const features = [
    {
      title: 'Resume Screener',
      description: 'Efficiently screen and shortlist candidate resumes',
      icon: <FileText className="h-8 w-8 text-hiring-primary" />,
      path: '/resume-screener',
      color: 'bg-blue-50'
    },
    {
      title: 'Interviewer Availability',
      description: 'Set your available time slots for interviews',
      icon: <Calendar className="h-8 w-8 text-hiring-secondary" />,
      path: '/interviewer-availability',
      color: 'bg-purple-50'
    },
    {
      title: 'Candidate Slot Selection',
      description: 'Allow candidates to select their preferred interview slots',
      icon: <Clock className="h-8 w-8 text-green-500" />,
      path: '/candidate-slot-selection',
      color: 'bg-green-50'
    },
    {
      title: 'HR Panel',
      description: 'Manage the entire hiring process from one dashboard',
      icon: <Users className="h-8 w-8 text-indigo-500" />,
      path: '/hr-panel',
      color: 'bg-indigo-50'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-4 text-hiring-dark">
          HireFlow <span className="text-hiring-primary">Automata</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Streamline your hiring process from resume screening to interview scheduling
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild className="bg-hiring-primary hover:bg-hiring-primary/90">
            <Link to="/resume-screener">Get Started</Link>
          </Button>
          <Button variant="outline">Learn More</Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl animate-fade-in">
        {features.map((feature, index) => (
          <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className={`${feature.color} rounded-t-lg`}>
              <div className="flex items-center gap-4">
                {feature.icon}
                <CardTitle>{feature.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <CardDescription className="text-base">{feature.description}</CardDescription>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link to={feature.path}>
                  Go to {feature.title}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Index;
