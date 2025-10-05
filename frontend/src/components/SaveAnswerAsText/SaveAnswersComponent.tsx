import React from "react";
import { Download } from "lucide-react";
import { toast, Bounce } from "react-toastify";
import type { User, AssessmentAnswers } from "../../types";
import { categoryTitles, questions } from "../../config/constants";

interface SaveAnswersComponentProps {
  formData: AssessmentAnswers;
  currentUser: User | null;
  currentSection: number;
}

const SaveAnswersComponent: React.FC<SaveAnswersComponentProps> = ({
  formData,
  currentUser,
  currentSection,
}) => {
  const sections: (keyof AssessmentAnswers)[] = [
    "academicAptitude",
    "technicalSkills",
    "careerInterest",
    "learningStyle",
  ];

  const getAnswerLabel = (
    section: keyof AssessmentAnswers,
    question: string,
    value: any
  ): string => {
    if (section === "academicAptitude" || section === "careerInterest") {
      const labels = [
        "Strongly Disagree",
        "Disagree",
        "Neutral",
        "Agree",
        "Strongly Agree",
      ];
      return labels[value - 1] || "Not answered";
    }

    if (section === "technicalSkills") {
      return value ? "Yes" : "No";
    }

    if (section === "learningStyle") {
      return value || "Not answered";
    }

    return value?.toString() || "Not answered";
  };

  const saveAnswersAsTxt = () => {
    try {
      const timestamp = new Date().toLocaleString();
      const date = new Date().toISOString().split('T')[0];
      
      let textContent = `CCDI CAREER ASSESSMENT ANSWERS\n`;
      textContent += `================================\n\n`;
      textContent += `Generated on: ${timestamp}\n`;
      textContent += `Student: ${currentUser?.name || 'Not specified'}\n\n`;
      
      // Add each section with formatted answers
      sections.forEach((sectionKey) => {
        textContent += `\n${categoryTitles[sectionKey].toUpperCase()}\n`;
        textContent += `${'='.repeat(categoryTitles[sectionKey].length)}\n\n`;
        
        const sectionAnswers = formData[sectionKey];
        
        if (sectionKey === "technicalSkills") {
          // Technical Skills - list selected skills
          const selectedSkills = questions.technicalSkills.filter(
            skill => sectionAnswers[skill]
          );
          
          if (selectedSkills.length > 0) {
            textContent += `Selected Technical Skills:\n`;
            selectedSkills.forEach((skill, index) => {
              textContent += `${index + 1}. ${skill}\n`;
            });
          } else {
            textContent += `No technical skills selected\n`;
          }
        } else {
          // Other sections - show questions and answers
          questions[sectionKey].forEach((question, index) => {
            const questionText = typeof question === "string" ? question : question.question;
            const answer = sectionAnswers[questionText];
            
            textContent += `${index + 1}. ${questionText}\n`;
            textContent += `   Answer: ${getAnswerLabel(sectionKey, questionText, answer)}\n\n`;
          });
        }
      });
      
      // Add summary
      textContent += `\nSUMMARY\n`;
      textContent += `=======\n\n`;
      textContent += `Total Sections Completed: ${sections.length}\n`;
      
      // Count total questions answered
      let totalAnswered = 0;
      let totalQuestions = 0;
      
      sections.forEach(sectionKey => {
        if (sectionKey === "technicalSkills") {
          const answered = Object.values(formData[sectionKey]).filter(val => val === true).length;
          totalAnswered += answered;
          totalQuestions += questions.technicalSkills.length;
        } else {
          const sectionQuestions = questions[sectionKey];
          totalQuestions += sectionQuestions.length;
          const answered = sectionQuestions.filter(q => {
            const questionText = typeof q === "string" ? q : q.question;
            return formData[sectionKey][questionText] !== undefined && 
                   formData[sectionKey][questionText] !== "" && 
                   formData[sectionKey][questionText] !== null;
          }).length;
          totalAnswered += answered;
        }
      });
      
      textContent += `Questions Answered: ${totalAnswered} / ${totalQuestions}\n`;
      textContent += `Completion Rate: ${Math.round((totalAnswered / totalQuestions) * 100)}%\n\n`;
      
      textContent += `This assessment helps identify your strengths, interests, and learning preferences to guide your career path in technology and computer science fields.`;

      // Create and download the text file
      const blob = new Blob([textContent], { 
        type: 'text/plain; charset=utf-8'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `career-assessment-answers-${date}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Answers saved as text document!", {
        position: "top-right",
        autoClose: 3000,
        style: {
          backgroundColor: "rgba(34, 197, 94, 0.3)",
          backdropFilter: "blur(6px)",
          border: "2px solid #22c55e",
          color: "#fff",
          fontWeight: "bold",
          fontSize: "14px",
          borderRadius: "8px",
          fontFamily: "Poppins",
        },
        transition: Bounce,
      });
    } catch (error) {
      console.error('Error saving answers:', error);
      toast.error("Failed to save answers. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        style: {
          backgroundColor: "rgba(239, 68, 68, 0.3)",
          backdropFilter: "blur(6px)",
          border: "2px solid #ef4444",
          color: "#fff",
          fontWeight: "bold",
          fontSize: "14px",
          borderRadius: "8px",
          fontFamily: "Poppins",
        },
        transition: Bounce,
      });
    }
  };

  return (
    <button
      type="button"
      onClick={saveAnswersAsTxt}
      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 
                 transition-all duration-300 ease-in-out active:scale-95
                 shadow-lg hover:shadow-xl border-2 border-blue-500
                 font-inter font-medium flex items-center gap-2"
    >
      <Download size={18} />
      Save Answers as TXT
    </button>
  );
};

export default SaveAnswersComponent;