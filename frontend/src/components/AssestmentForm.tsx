import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import type { User, AssessmentAnswers, AssessmentResult } from '../types';

interface AssessmentFormProps {
  currentUser: User | null;
  setCurrentUser: (user: User) => void;
  setAssessmentResult: (result: AssessmentResult) => void;
}

const AssessmentForm: React.FC<AssessmentFormProps> = ({ 
  currentUser, 
  setCurrentUser,
  setAssessmentResult
}) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<AssessmentAnswers>({
    academicAptitude: {},
    technicalSkills: {},
    careerInterest: {},
    learningStyle: {}
  });

  const questions = {
    academicAptitude: [
      "I can solve math problems with confidence.",
      "I understand technical readings and manuals easily.",
      "I can write reports or essays clearly.",
      "I perform well on time-limited tests or quizzes.",
      "I retain information better when I write it down.",
      "I easily follow complex instructions."
    ],
    technicalSkills: [
      "Assembling or repairing electronics",
      "Creating websites or apps",
      "Troubleshooting computer hardware or software",
      "Editing photos, videos, or multimedia",
      "Designing systems, blueprints, or flowcharts",
      "Managing computer networks or databases",
      "Conducting experiments or simulations",
      "Operating machinery or technical equipment"
    ],
    careerInterest: [
      "Realistic: Working with tools/machines; Building/fixing electronics",
      "Investigative: Solving problems/analyzing data; Doing research/science",
      "Artistic: Designing/creative tasks; Working on media or digital arts",
      "Social: Teaching others; Team projects or mentoring",
      "Enterprising: Leading groups; Starting a business/tech startup",
      "Conventional: Organizing files/databases; Working with spreadsheets or documentation"
    ],
    learningStyle: [
      "A. Watch videos/see diagrams",
      "B. Listen to explanations/discussions",
      "C. Read instructions/books",
      "D. Try it out hands-on",
      "A. Use charts/color-coded notes",
      "B. Discuss with others",
      "C. Read silently",
      "D. Practice with real problems",
      "A. Prefer slides and visuals",
      "B. Focus on hearing the instructor",
      "C. Take notes to read later",
      "D. Want to try examples myself"
    ]
  };

  const handleInputChange = (section: keyof AssessmentAnswers, question: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [question]: parseInt(value)
      }
    }));
  };

  const scale = {
    1: "Strongly Disagree",
    2: "Disagree",
    3: "Neutral",
    4: "Agree",
    5: "Strongly Agree"
  };

  const transformAnswersForPrompt = (): AssessmentAnswers => {
    const transformed: any = {};
    for (const section in formData) {
      const entries = formData[section as keyof AssessmentAnswers];
      transformed[section] = {};
      for (const [question, value] of Object.entries(entries)) {
        transformed[section][question] = scale[value as keyof typeof scale] || value;
      }
    }
    return transformed;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      const name = prompt("Please enter your name:") || '';
      try {
        const response = await axios.post<User>('/api/user', { name });

        if (!response.data || !response.data._id) throw new Error('Invalid user data received');

        const userData: User = {
          _id: response.data._id,
          name: response.data.name,
          email: response.data.email,
          evaluations: response.data.evaluations || []
        };

        setCurrentUser(userData);
        localStorage.setItem('currentUser', JSON.stringify(userData));
      } catch (error) {
        console.error('User creation error:', error);
        alert('Failed to create user.');
        return;
      }
    }

    try {
      const cleanedAnswers = transformAnswersForPrompt();

      const response = await axios.post<AssessmentResult>('/api/evaluation/evaluate', {
        userId: currentUser?._id,
        answers: cleanedAnswers
      });

      console.log('Evaluation Result:', response.data);

      setAssessmentResult(response.data);
      navigate('/results');
    } catch (error) {
      console.error('Error during submission:', error);
      alert('There was an error submitting the form. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="assessment-form">
      {(Object.entries(questions) as [keyof AssessmentAnswers, string[]][]).map(([section, sectionQuestions]) => (
        <div key={section} className="form-section">
          <h3>{section.split(/(?=[A-Z])/).join(' ')}</h3>
          {sectionQuestions.map((question, index) => (
            <div key={index} className="question">
              <label>{question}</label>
              <select
                required
                onChange={(e) => handleInputChange(section, question, e.target.value)}
                value={formData[section][question] || ''}
              >
                <option value="" disabled>Select your response</option>
                <option value="1">Strongly Disagree</option>
                <option value="2">Disagree</option>
                <option value="3">Neutral</option>
                <option value="4">Agree</option>
                <option value="5">Strongly Agree</option>
              </select>
            </div>
          ))}
        </div>
      ))}

      <button type="submit" className="submit-btn">
        Get Program Recommendation
      </button>
    </form>
  );
};

export default AssessmentForm;
