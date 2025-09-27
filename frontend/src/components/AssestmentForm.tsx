import React, { useState } from "react";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type { User, AssessmentAnswers } from "../types";
import DotGrid from "../components/ActiveBackground/index";
import {
  Info,
  BookOpen,
  Wrench,
  Eye,
  Edit,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";
import { Modal } from "react-bootstrap";
import {
  categoryTitles,
  questions,
  sectionBgColors,
  sectionFormBgColors,
  sectionHoverColors,
  sectionDotColors,
} from "../config/constants";
import TooltipButton from "./TootltipButton/TooltipButton";
import NavigationBar from "./NavigationBarComponents/NavigationBar";
import ProgressSideBar from "./ProgressSideBar/ProgressSideBar";

interface AssessmentFormProps {
  currentUser: User | null;
  setCurrentUser: (user: User) => void;
  onSubmit: (answers: AssessmentAnswers) => void;
  onNextSection: () => void;
  onPrevSection: () => void;
  currentSectionIndex: number;
  totalSections: number;
  loading?: boolean;
}

const AssessmentForm: React.FC<AssessmentFormProps> = ({
  currentUser,
  setCurrentUser,
  onSubmit,
  loading,
}) => {
  const [formData, setFormData] = useState<AssessmentAnswers>({
    academicAptitude: {},
    technicalSkills: {},
    careerInterest: {},
    learningStyle: {},
  });

  const [showResetModal, setShowResetModal] = useState(false);
  const [sectionToReset, setSectionToReset] = useState<
    keyof AssessmentAnswers | null
  >(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showReview, setShowReview] = useState(false);

  const sections: (keyof AssessmentAnswers)[] = [
    "academicAptitude",
    "technicalSkills",
    "careerInterest",
    "learningStyle",
  ];

  const section = sections[currentSection];
  const { base, active } = sectionDotColors[section] || {
    base: "#000",
    active: "#000",
  };

  const handleChange = (
    section: keyof AssessmentAnswers,
    question: string,
    value: string | boolean | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [question]: value,
      },
    }));
  };

  const handleReset = (section?: keyof AssessmentAnswers) => {
    if (section) {
      setFormData((prev) => ({
        ...prev,
        [section]: {},
      }));
      // Reset question index for academic section
      if (section === "academicAptitude") {
        setCurrentQuestionIndex(0);
      }
    } else {
      setFormData({
        academicAptitude: {},
        technicalSkills: {},
        careerInterest: {},
        learningStyle: {},
      });
      setCurrentQuestionIndex(0);
    }
    setShowResetModal(false);
  };

  const confirmReset = (section: keyof AssessmentAnswers) => {
    setSectionToReset(section);
    setShowResetModal(true);
  };

  // New function to save answers locally
  const saveAnswersLocally = () => {
    try {
      const timestamp = new Date().toISOString();
      const dataToSave = {
        answers: formData,
        timestamp: timestamp,
        section: categoryTitles[sections[currentSection]],
        currentSection: currentSection,
      };
      
      // Create a blob and download link
      const blob = new Blob([JSON.stringify(dataToSave, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `assessment-answers-${timestamp.split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Answers saved successfully!", {
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

  const validateSection = (): boolean => {
    const answers = formData[section];

    if (section === "academicAptitude") {
      const firstUnansweredIndex = questions.academicAptitude.findIndex(
        (q) => answers[q] === undefined || answers[q] === ""
      );

      if (firstUnansweredIndex !== -1) {
        toast.warning("Please answer all Academic Aptitude questions.", {
          position: "top-right",
          autoClose: 3000,
          style: {
            backgroundColor: "rgba(33, 150, 243, 0.3)",
            backdropFilter: "blur(6px)",
            border: "2px solid #2196F3",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "14px",
            borderRadius: "8px",
            fontFamily: "Poppins",
          },
          transition: Bounce,
        });

        setCurrentQuestionIndex(firstUnansweredIndex);
        return false;
      }
    }

    if (section === "technicalSkills") {
      const hasAtLeastOne = Object.values(answers).some((val) => val === true);
      if (!hasAtLeastOne) {
        toast.warning("Please select at least one Technical Skill.", {
          position: "top-right",
          style: {
            backgroundColor: "rgba(255, 165, 0, 0.5)",
            color: "#fff",
            border: "2px solid #FF8C00",
            borderRadius: "8px",
            fontWeight: "500",
            fontFamily: "Poppins",
          },
        });
        return false;
      }
    }

    if (section === "careerInterest") {
      const firstUnansweredIndex = questions.careerInterest.findIndex(
        (q) => answers[q] === undefined || answers[q] === ""
      );

      if (firstUnansweredIndex !== -1) {
        toast.warning("Please answer all Career Interest questions.", {
          position: "top-right",
          autoClose: 3000,
          style: {
            backgroundColor: "rgb(147, 51, 234, 0.3)",
            backdropFilter: "blur(6px)",
            border: "2px solid #9333ea",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "14px",
            borderRadius: "8px",
            fontFamily: "Poppins",
          },
          transition: Bounce,
        });

        // Navigate to the first unanswered question for Career Interest
        setCurrentQuestionIndex(firstUnansweredIndex);
        return false;
      }
    }

    if (section === "learningStyle") {
      const firstUnansweredIndex = questions.learningStyle.findIndex(
        (ls) =>
          answers[ls.question] === undefined || answers[ls.question] === ""
      );

      if (firstUnansweredIndex !== -1) {
        toast.warning(
          "Please select an option for all Learning Style questions.",
          {
            position: "top-right",
            autoClose: 3000,
            style: {
              backgroundColor: "rgba(236, 72, 153, 0.3)",
              backdropFilter: "blur(6px)",
              border: "2px solid #EC4899",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "14px",
              borderRadius: "8px",
              fontFamily: "Poppins",
            },
            transition: Bounce,
          }
        );
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateSection()) {
      if (currentSection < sections.length - 1) {
        setCurrentSection((prev) => prev + 1);
        setCurrentQuestionIndex(0);
      } else {
        setShowReview(true);
      }
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection((prev) => prev - 1);
      setCurrentQuestionIndex(0);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateSection()) {
      onSubmit(formData);
    }
  };

  const navigateToSection = (sectionIndex: number) => {
    setCurrentSection(sectionIndex);
    setCurrentQuestionIndex(0);
    setShowReview(false);
  };

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

  // Render the review/summary section
  const renderReviewSection = () => {
    return (
      <div className="review-section bg-gray-800 p-6 rounded-xl text-white flex flex-col max-h-[calc(100vh-8rem)]">
        {/* Header */}
        <h2 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2 shrink-0">
          <Eye size={24} /> Review Your Answers
        </h2>

        {/* Scrollable Review Content */}
        <div className="flex-1 overflow-y-auto pr-2 
                        scrollbar-thin scrollbar-thumb-blue-400/40 
                        scrollbar-track-transparent space-y-8">
          {sections.map((sectionKey, sectionIndex) => (
            <div key={sectionKey}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">
                  {categoryTitles[sectionKey]}
                </h3>
                <button
                  type="button"
                  onClick={() => navigateToSection(sectionIndex)}
                  className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <Edit size={16} /> Edit
                </button>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                {sectionKey === "technicalSkills" ? (
                  <div>
                    <h4 className="font-medium mb-2">Selected Skills:</h4>
                    <ul className="list-disc list-inside">
                      {questions.technicalSkills
                        .filter((skill) => formData.technicalSkills[skill])
                        .map((skill) => (
                          <li key={skill}>{skill}</li>
                        ))}
                      {Object.values(formData.technicalSkills).filter((v) => v)
                        .length === 0 && (
                        <li className="text-gray-400">No skills selected</li>
                      )}
                    </ul>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {questions[sectionKey].map((question, qIndex) => {
                      const questionText =
                        typeof question === "string"
                          ? question
                          : question.question;
                      const answer = formData[sectionKey][questionText];

                      return (
                        <div
                          key={questionText}
                          className="border-b border-gray-600 pb-3 last:border-0"
                        >
                          <p className="font-medium">
                            {qIndex + 1}. {questionText}
                          </p>
                          <p className="text-blue-300">
                            {getAnswerLabel(sectionKey, questionText, answer)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full min-h-screen flex bg-gray-900 overflow-hidden">
      {/* Fullscreen DotGrid background */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-black">
          <DotGrid
            dotSize={5}
            gap={15}
            baseColor="#393E46"
            activeColor={active}
            proximity={120}
            shockRadius={250}
            shockStrength={5}
            resistance={750}
            returnDuration={1.5}
            className="w-full h-full"
          />
        </div>
      </div>

      <ToastContainer />
      <NavigationBar />
      <ProgressSideBar />

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center pt-16 pb-8 pr-96 pl-4 z-10">
        <form
          onSubmit={handleSubmit}
          className={`
            relative w-full max-w-4xl p-8
            ${sectionFormBgColors[sections[currentSection]]} 
            border border-white rounded-xl shadow-lg
            max-h-[calc(100vh-8rem)] overflow-hidden flex flex-col
          `}
        >
          {showReview ? (
            renderReviewSection()
          ) : (
            <>
              {/* Academic Aptitude Section */}
              {currentSection === 0 && (
                <div className="form-section flex flex-col h-full">
                  {/* Progress Section */}
                  <div className="flex justify-between items-center mb-4 shrink-0">
                    <span className="text-lg font-semibold text-blue-400">
                      Question {currentQuestionIndex + 1} of{" "}
                      {questions.academicAptitude.length}
                    </span>

                    <div className="flex items-center space-x-3">
                      {/* Previous Question Button */}
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentQuestionIndex((prev) =>
                            Math.max(0, prev - 1)
                          )
                        }
                        disabled={currentQuestionIndex === 0}
                        className={`p-2 rounded-full transition-all duration-300 ${
                          currentQuestionIndex === 0
                            ? "bg-gray-400 cursor-not-allowed opacity-50"
                            : "bg-blue-500 hover:bg-blue-600 text-white"
                        }`}
                      >
                        <ChevronLeft size={20} />
                      </button>

                      {/* Progress Dots */}
                      <div className="flex space-x-2">
                        {questions.academicAptitude.map((_, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setCurrentQuestionIndex(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                              index === currentQuestionIndex
                                ? "bg-blue-500 scale-125"
                                : formData.academicAptitude[
                                    questions.academicAptitude[index]
                                  ]
                                ? "bg-green-500 hover:bg-green-400"
                                : "bg-gray-400 hover:bg-gray-300"
                            }`}
                          />
                        ))}
                      </div>

                      {/* Next Question Button */}
                      <button
                        type="button"
                        onClick={() => {
                          if (
                            currentQuestionIndex <
                            questions.academicAptitude.length - 1
                          ) {
                            setCurrentQuestionIndex((prev) => prev + 1);
                          }
                        }}
                        disabled={
                          currentQuestionIndex ===
                          questions.academicAptitude.length - 1
                        }
                        className={`p-2 rounded-full transition-all duration-300 ${
                          currentQuestionIndex ===
                          questions.academicAptitude.length - 1
                            ? "bg-gray-400 cursor-not-allowed opacity-50"
                            : "bg-blue-500 hover:bg-blue-600 text-white"
                        }`}
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-6 shrink-0">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-in-out"
                      style={{
                        width: `${
                          ((currentQuestionIndex + 1) /
                            questions.academicAptitude.length) *
                          100
                        }%`,
                      }}
                    />
                  </div>

                  {/* Scrollable Question Content */}
                  <div className="flex-1 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-blue-500/40 scrollbar-track-transparent">
                    <div className="text-center">
                      <h4 className="text-2xl font-bold text-text-primary font-poppins mb-8">
                        {questions.academicAptitude[currentQuestionIndex]}
                      </h4>

                      {/* Choices */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                        {[1, 2, 3, 4, 5].map((val) => (
                          <label
                            key={val}
                            className={`flex items-center justify-center gap-3 cursor-pointer 
                              p-4 rounded-lg border-2 transition-all duration-300 ease-in-out
                              ${
                                formData.academicAptitude[
                                  questions.academicAptitude[
                                    currentQuestionIndex
                                  ]
                                ] === val
                                  ? "border-blue-500 bg-blue-500/20 scale-105"
                                  : "border-gray-300 hover:border-blue-400 hover:bg-blue-500/10"
                              }`}
                          >
                            <input
                              type="radio"
                              name={`academic-question-${currentQuestionIndex}`}
                              value={val}
                              checked={
                                formData.academicAptitude[
                                  questions.academicAptitude[
                                    currentQuestionIndex
                                  ]
                                ] === val
                              }
                              onChange={() =>
                                handleChange(
                                  "academicAptitude",
                                  questions.academicAptitude[
                                    currentQuestionIndex
                                  ],
                                  val
                                )
                              }
                              className="accent-blue-500 w-5 h-5"
                            />
                            <span className="text-lg font-poppins font-medium text-text-primary">
                              {
                                [
                                  "Strongly Disagree",
                                  "Disagree",
                                  "Neutral",
                                  "Agree",
                                  "Strongly Agree",
                                ][val - 1]
                              }
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentSection === 1 && (
                <div className="form-section flex flex-col h-screen">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6 shrink-0">
                    <h3 className="text-3xl font-bold text-orange-500 py-2">
                      Technical Skills
                    </h3>
                    <TooltipButton
                      id="technical"
                      paragraph="Pick at least one technical skill you feel confident in."
                      buttonBgColor="bg-orange-500"
                      icon={<Info size={20} />}
                    />
                  </div>

                  {/* Scrollable List */}
                  <div className="flex-1 min-h-0">
                    <div
                      className="h-full overflow-y-auto pr-4 
        scrollbar-thin scrollbar-thumb-orange-500/40 scrollbar-track-transparent 
        hover:scrollbar-thumb-orange-500/60"
                    >
                      <div className="space-y-4 pb-4">
                        {questions.technicalSkills.map((skill, index) => (
                          <label
                            key={skill}
                            className={`
                flex items-center gap-3 cursor-pointer font-poppins p-3 
                rounded-lg border border-transparent 
                hover:border-orange-400 hover:bg-orange-500/10 
                transition-all duration-300 ease-in-out transform
                hover:scale-[1.02] hover:shadow-md
                text-text-primary text-lg
                animate-fadeInUp
              `}
                            style={{
                              animationDelay: `${index * 100}ms`, // stagger effect
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={!!formData.technicalSkills[skill]}
                              onChange={(e) =>
                                handleChange(
                                  "technicalSkills",
                                  skill,
                                  e.target.checked
                                )
                              }
                              className="accent-orange-500 w-5 h-5"
                            />
                            <span className="font-medium">{skill}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {currentSection === 2 && (
                <div className="form-section flex flex-col h-full">
                  {/* Progress Section */}
                  <div className="flex justify-between items-center mb-4 shrink-0">
                    <span className="text-lg font-semibold text-purple-400">
                      Question {currentQuestionIndex + 1} of{" "}
                      {questions?.careerInterest?.length ?? 0}
                    </span>

                    <div className="flex items-center space-x-3">
                      {/* Previous Question Button */}
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentQuestionIndex((prev) =>
                            Math.max(0, prev - 1)
                          )
                        }
                        disabled={currentQuestionIndex === 0}
                        className={`p-2 rounded-full transition-all duration-300 ${
                          currentQuestionIndex === 0
                            ? "bg-gray-400 cursor-not-allowed opacity-50"
                            : "bg-purple-500 hover:bg-purple-600 text-white"
                        }`}
                      >
                        <ChevronLeft size={20} />
                      </button>

                      {/* Progress Dots */}
                      <div className="flex space-x-2">
                        {(questions?.careerInterest ?? []).map((_, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setCurrentQuestionIndex(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                              index === currentQuestionIndex
                                ? "bg-purple-500 scale-125"
                                : formData.careerInterest[
                                    questions.careerInterest[index]
                                  ]
                                ? "bg-green-500 hover:bg-green-400"
                                : "bg-gray-400 hover:bg-gray-300"
                            }`}
                          />
                        ))}
                      </div>

                      {/* Next Question Button */}
                      <button
                        type="button"
                        onClick={() => {
                          if (
                            currentQuestionIndex <
                            questions.careerInterest.length - 1
                          ) {
                            setCurrentQuestionIndex((prev) => prev + 1);
                          }
                        }}
                        disabled={
                          currentQuestionIndex ===
                          questions.careerInterest.length - 1
                        }
                        className={`p-2 rounded-full transition-all duration-300 ${
                          currentQuestionIndex ===
                          questions.careerInterest.length - 1
                            ? "bg-gray-400 cursor-not-allowed opacity-50"
                            : "bg-purple-500 hover:bg-purple-600 text-white"
                        }`}
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-6 shrink-0">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all duration-500 ease-in-out"
                      style={{
                        width: `${
                          ((currentQuestionIndex + 1) /
                            questions.careerInterest.length) *
                          100
                        }%`,
                      }}
                    />
                  </div>

                  {/* Scrollable Question Content */}
                  <div className="flex-1 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-purple-500/40 scrollbar-track-transparent">
                    <div className="text-center">
                      <h4 className="text-2xl font-bold text-text-primary font-poppins mb-8">
                        {questions.careerInterest[currentQuestionIndex]}
                      </h4>

                      {/* Choices 1–5 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                        {[1, 2, 3, 4, 5].map((val) => (
                          <label
                            key={val}
                            className={`flex items-center justify-center gap-3 cursor-pointer 
                p-4 rounded-lg border-2 transition-all duration-300 ease-in-out
                ${
                  formData.careerInterest[
                    questions.careerInterest[currentQuestionIndex]
                  ] === val
                    ? "border-purple-500 bg-purple-500/20 scale-105"
                    : "border-gray-300 hover:border-purple-400 hover:bg-purple-500/10"
                }`}
                          >
                            <input
                              type="radio"
                              name={`career-question-${currentQuestionIndex}`}
                              value={val}
                              checked={
                                formData.careerInterest[
                                  questions.careerInterest[currentQuestionIndex]
                                ] === val
                              }
                              onChange={() =>
                                handleChange(
                                  "careerInterest",
                                  questions.careerInterest[
                                    currentQuestionIndex
                                  ],
                                  val
                                )
                              }
                              className="accent-purple-500 w-5 h-5"
                            />
                            <span className="text-lg font-poppins font-medium text-text-primary">
                              {val}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {currentSection === 3 && (
                <div className="form-section flex flex-col h-full">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4 shrink-0">
                    <h3 className="text-3xl font-bold font-poppins text-pink-600 py-2">
                      Learning Style
                    </h3>
                    <TooltipButton
                      id="learning-style"
                      icon={<Wrench size={20} />}
                      paragraph="This section identifies how you prefer to learn and process information."
                    />
                  </div>

                  {/* Progress Section */}
                  <div className="flex justify-between items-center mb-4 shrink-0">
                    <span className="text-lg font-semibold text-pink-500">
                      Question {currentQuestionIndex + 1} of{" "}
                      {questions.learningStyle.length}
                    </span>

                    <div className="flex items-center space-x-3">
                      {/* Previous Button */}
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentQuestionIndex((prev) =>
                            Math.max(0, prev - 1)
                          )
                        }
                        disabled={currentQuestionIndex === 0}
                        className={`p-2 rounded-full transition-all duration-300 ${
                          currentQuestionIndex === 0
                            ? "bg-gray-400 cursor-not-allowed opacity-50"
                            : "bg-pink-500 hover:bg-pink-600 text-white"
                        }`}
                      >
                        <ChevronLeft size={20} />
                      </button>

                      {/* Progress Dots */}
                      <div className="flex space-x-2">
                        {questions.learningStyle.map((_, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setCurrentQuestionIndex(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                              index === currentQuestionIndex
                                ? "bg-pink-500 scale-125"
                                : formData.learningStyle[
                                    questions.learningStyle[index].question
                                  ]
                                ? "bg-green-500 hover:bg-green-400"
                                : "bg-gray-400 hover:bg-gray-300"
                            }`}
                          />
                        ))}
                      </div>

                      {/* Next Button */}
                      <button
                        type="button"
                        onClick={() => {
                          if (
                            currentQuestionIndex <
                            questions.learningStyle.length - 1
                          ) {
                            setCurrentQuestionIndex((prev) => prev + 1);
                          }
                        }}
                        disabled={
                          currentQuestionIndex ===
                          questions.learningStyle.length - 1
                        }
                        className={`p-2 rounded-full transition-all duration-300 ${
                          currentQuestionIndex ===
                          questions.learningStyle.length - 1
                            ? "bg-gray-400 cursor-not-allowed opacity-50"
                            : "bg-pink-500 hover:bg-pink-600 text-white"
                        }`}
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-6 shrink-0">
                    <div
                      className="bg-pink-500 h-2 rounded-full transition-all duration-500 ease-in-out"
                      style={{
                        width: `${
                          ((currentQuestionIndex + 1) /
                            questions.learningStyle.length) *
                          100
                        }%`,
                      }}
                    />
                  </div>

                  {/* Question Display */}
                  <div className="flex-1 pr-4">
                    <div className="text-center">
                      <h4 className="text-2xl font-bold text-text-primary font-poppins mb-6">
                        {
                          questions.learningStyle[currentQuestionIndex]
                            ?.question
                        }
                      </h4>

                      {/* Scrollable Choices */}
                      <div className="max-w-3xl mx-auto space-y-4 max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-pink-500/40 scrollbar-track-transparent">
                        {questions.learningStyle[
                          currentQuestionIndex
                        ]?.options.map((opt) => (
                          <label
                            key={opt}
                            className={`flex items-center justify-center gap-3 cursor-pointer 
                p-4 rounded-lg border-2 transition-all duration-300 ease-in-out w-full
                ${
                  formData.learningStyle[
                    questions.learningStyle[currentQuestionIndex].question
                  ] === opt
                    ? "border-pink-500 bg-pink-500/20 scale-105"
                    : "border-gray-300 hover:border-pink-400 hover:bg-pink-500/10"
                }`}
                          >
                            <input
                              type="radio"
                              name={`learning-${currentQuestionIndex}`}
                              value={opt}
                              checked={
                                formData.learningStyle[
                                  questions.learningStyle[currentQuestionIndex]
                                    .question
                                ] === opt
                              }
                              onChange={() =>
                                handleChange(
                                  "learningStyle",
                                  questions.learningStyle[currentQuestionIndex]
                                    .question,
                                  opt
                                )
                              }
                              className="accent-pink-500 w-5 h-5"
                            />
                            <span className="text-lg font-poppins font-medium text-text-primary">
                              {opt}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </form>

        {/* Section Navigation Buttons */}
        {!showReview && (
          <div className="absolute bottom-8 right-96 z-20">
            <div className="flex gap-4">
              {currentSection > 0 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className={`
                    ${sectionBgColors[sections[currentSection - 1]]} 
                    text-white p-3 font-inter rounded-lg font-medium px-6 border-2
                    ${sectionHoverColors[sections[currentSection - 1]]} 
                    transition-all duration-300 ease-in-out active:scale-95
                    shadow-lg hover:shadow-xl
                  `}
                >
                  Previous Section
                </button>
              )}

              {currentSection < sections.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className={`
                    ${sectionBgColors[sections[currentSection]]} 
                    text-white p-3 font-inter rounded-lg font-medium px-2 border-2
                    ${sectionHoverColors[sections[currentSection]]} 
                    transition-all duration-300 ease-in-out active:scale-95
                    shadow-lg hover:shadow-xl
                  `}
                >
                  Next Section
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 text-white font-inter font-medium border-2 transition-all duration-300 ease-in-out active:scale-95
                    bg-green-600 hover:bg-green-500 hover:scale-105
                    shadow-lg hover:shadow-xl rounded-lg"
                >
                  Review Answers
                </button>
              )}
            </div>
          </div>
        )}

        {/* Review Section Buttons - MOVED OUTSIDE THE FORM CONTAINER */}
        {showReview && (
          <div className="absolute bottom-8 right-96 z-20 flex gap-4">
            <button
              type="button"
              onClick={() => setShowReview(false)}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500 
                         transition-all duration-300 ease-in-out active:scale-95
                         shadow-lg hover:shadow-xl border-2 border-gray-500
                         font-inter font-medium"
            >
              Back to Form
            </button>
            
            {/* New Save Answers Locally Button */}
            <button
              type="button"
              onClick={saveAnswersLocally}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 
                         transition-all duration-300 ease-in-out active:scale-95
                         shadow-lg hover:shadow-xl border-2 border-blue-500
                         font-inter font-medium flex items-center gap-2"
            >
              <Download size={18} />
              Save Answers Locally
            </button>
            
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className={`px-6 py-3 rounded-lg transition-all duration-300 ease-in-out active:scale-95
                         shadow-lg hover:shadow-xl border-2 font-inter font-medium
                ${
                  loading
                    ? "bg-gray-500 cursor-not-allowed border-gray-400"
                    : "bg-green-600 hover:bg-green-500 border-green-500 text-white"
                }`}
            >
              {loading ? "Submitting..." : "Submit Assessment"}
            </button>
          </div>
        )}
      </div>

      <Modal
        show={showResetModal}
        onHide={() => setShowResetModal(false)}
        centered
        dialogClassName="transparent-modal"
        contentClassName="bg-white/20 backdrop-blur-md text-white border border-white/30"
      >
        <Modal.Header
          closeButton
          className="border-b border-white/30 text-white"
        >
          <Modal.Title className="font-semibold text-lg">
            Confirm Reset
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-white/90">
          {sectionToReset
            ? `Are you sure you want to reset the ${categoryTitles[sectionToReset]} section?`
            : "Are you sure you want to reset ALL sections?"}
        </Modal.Body>
        <Modal.Footer className="flex justify-end gap-3">
          <button
            type="button"
            className="bg-gray-600 text-white p-2 font-inter rounded-sm font-medium px-3 border-2 border-gray-500 hover:bg-gray-500 transition-all duration-300"
            onClick={() => setShowResetModal(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="bg-red-600 text-white p-2 font-inter rounded-sm font-medium px-4 border-2 border-red-500 hover:bg-red-500 transition-all duration-300"
            onClick={() => handleReset(sectionToReset)}
          >
            Yes, Reset
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AssessmentForm;