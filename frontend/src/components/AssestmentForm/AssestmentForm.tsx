import React, { useState } from "react";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AssestmentForm.css";
import type { User, AssessmentAnswers, AssessmentFormProps } from "../../types";
import DotGrid from "../ActiveBackground/index";
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
  sections,
  choiceLabels,
  getSectionColorClass
} from "../../config/constants";
import TooltipButton from "../TootltipButton/TooltipButton";
import NavigationBar from "../NavigationBarComponents/NavigationBar";
import ProgressSideBar from "../ProgressSideBar/ProgressSideBar";

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
  const [completedSections, setCompletedSections] = useState<number[]>([]);

  const section = sections[currentSection];
  const { base, active } = sectionDotColors[section] || {
    base: "#000",
    active: "#000",
  };

  // Add this function to check if all learning style questions are answered
  const isLearningStyleComplete = () => {
    const learningAnswers = formData.learningStyle;
    return questions.learningStyle.every(
      (ls) =>
        learningAnswers[ls.question] !== undefined &&
        learningAnswers[ls.question] !== ""
    );
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

  const saveAnswersLocally = () => {
    try {
      const timestamp = new Date().toISOString();
      const dataToSave = {
        answers: formData,
        timestamp: timestamp,
        section: categoryTitles[sections[currentSection]],
        currentSection: currentSection,
      };

      const blob = new Blob([JSON.stringify(dataToSave, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `assessment-answers-${timestamp.split("T")[0]}.json`;
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
        // Scroll to the unanswered question
        setCurrentQuestionIndex(firstUnansweredIndex);

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
      // Special validation for learning style section before moving to review
      if (currentSection === 3 && !isLearningStyleComplete()) {
        toast.warning(
          "Please answer all Learning Style questions before proceeding.",
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
        return;
      }

      setCompletedSections((prev) => [...prev, currentSection]);

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

  const renderReviewSection = () => {
    return (
      <div className="review-section">
        <h2 className="review-header">
          <Eye size={24} /> Review Your Answers
        </h2>

        <div className="review-content scrollbar-thin-blue">
          {sections.map((sectionKey, sectionIndex) => (
            <div key={sectionKey} className="review-section-item">
              <div className="review-section-header">
                <h3 className="review-section-title">
                  {categoryTitles[sectionKey]}
                </h3>
                <button
                  type="button"
                  onClick={() => navigateToSection(sectionIndex)}
                  className="review-edit-button"
                >
                  <Edit size={16} /> Edit
                </button>
              </div>

              <div className="review-answers-container">
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
    <div className="assessment-container">
      <div className="background-overlay">
        <div className="background-full">
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
      <ProgressSideBar
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
      />

      <div className="main-content">
        <form
          onSubmit={handleSubmit}
          className={`assessment-form ${
            sectionFormBgColors[sections[currentSection]]
          }`}
        >
          {showReview ? (
            renderReviewSection()
          ) : (
            <>
              {/* Academic Aptitude Section */}
              {currentSection === 0 && (
                <div className="form-section">
                  <div className="section-header">
                    <h3 className="section-title font-poppins">
                      Academic Aptitude
                    </h3>
                  </div>
                  {/* Progress Section */}
                  <div className="progress-info">
                    <span className="progress-text academic">
                      Question {currentQuestionIndex + 1} of{" "}
                      {questions.academicAptitude.length}
                    </span>

                    <div className="progress-controls">
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentQuestionIndex((prev) =>
                            Math.max(0, prev - 1)
                          )
                        }
                        disabled={currentQuestionIndex === 0}
                        className={`navigation-button academic ${
                          currentQuestionIndex === 0 ? "bg-gray-400" : ""
                        } transition-all duration-300 hover:scale-110`}
                      >
                        <ChevronLeft size={20} />
                      </button>

                      <div className="progress-dots">
                        {questions.academicAptitude.map((_, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setCurrentQuestionIndex(index)}
                            className={`progress-dot ${
                              index === currentQuestionIndex
                                ? "bg-blue-500 scale-125 active"
                                : formData.academicAptitude[
                                    questions.academicAptitude[index]
                                  ]
                                ? "bg-green-500 hover:bg-green-400"
                                : "bg-gray-400 hover:bg-gray-300"
                            } transition-all duration-300 hover:scale-125`}
                          />
                        ))}
                      </div>

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
                        className={`navigation-button academic ${
                          currentQuestionIndex ===
                          questions.academicAptitude.length - 1
                            ? "bg-gray-400"
                            : ""
                        } transition-all duration-300 hover:scale-110`}
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="progress-bar-container">
                    <div
                      className="progress-bar academic"
                      style={{
                        width: `${
                          ((currentQuestionIndex + 1) /
                            questions.academicAptitude.length) *
                          100
                        }%`,
                      }}
                    />
                  </div>

                  {/* Animated Question Content */}
                  <div className="scrollable-content scrollbar-thin-blue">
                    <div
                      key={currentQuestionIndex}
                      className="question-container question-transition-enter-active"
                    >
                      <h4 className="question-text animate-fade-in-up">
                        {questions.academicAptitude[currentQuestionIndex]}
                      </h4>

                      <div className="choices-grid">
                        {[1, 2, 3, 4, 5].map((val, index) => (
                          <label
                            key={val}
                            className={`choice-label choice-animate choice-animate-delay-${
                              index + 1
                            } ${
                              formData.academicAptitude[
                                questions.academicAptitude[currentQuestionIndex]
                              ] === val
                                ? "border-blue-500 bg-blue-500/20 scale-105 choice-selected"
                                : "border-gray-300 hover:border-blue-400 hover:bg-blue-500/10 hover:scale-105"
                            } transition-all duration-300`}
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
                              className="choice-input transition-all duration-300 hover:scale-110"
                            />
                            <span className="choice-text transition-all duration-300">
                              {
                                [
                                  "Strongly Agree",
                                  "Agree",
                                  "Neutral",
                                  "Disagree",
                                  "Strongly Disagree",
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

              {/* Technical Skills Section */}
              {currentSection === 1 && (
                <div className="form-section">
                  <div className="section-header">
                    <h3 className="section-title  font-poppins">
                      Technical Skills
                    </h3>
                  </div>

                  <div className="skills-container">
                    <div className="skills-list scrollbar-thin-orange">
                      {questions.technicalSkills.map((skill, index) => (
                        <label
                          key={skill}
                          className="skill-label fade-in-up hover:border-orange-400 hover:bg-orange-500/10"
                          style={{
                            animationDelay: `${index * 100}ms`,
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
                            className="skill-checkbox"
                          />
                          <span className="font-medium">{skill}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Career Interest Section */}
              {currentSection === 2 && (
                <div className="form-section">
                  <div className="section-header">
                    <h3 className="section-title text-orange-500 font-poppins">
                      Career Interest
                    </h3>
                  </div>
                  {/* Progress Section */}
                  <div className="progress-info">
                    <span className="progress-text career">
                      Question {currentQuestionIndex + 1} of{" "}
                      {questions?.careerInterest?.length ?? 0}
                    </span>

                    <div className="progress-controls">
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentQuestionIndex((prev) =>
                            Math.max(0, prev - 1)
                          )
                        }
                        disabled={currentQuestionIndex === 0}
                        className={`navigation-button career ${
                          currentQuestionIndex === 0 ? "bg-gray-400" : ""
                        }`}
                      >
                        <ChevronLeft size={20} />
                      </button>

                      <div className="progress-dots">
                        {(questions?.careerInterest ?? []).map((_, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setCurrentQuestionIndex(index)}
                            className={`progress-dot ${
                              index === currentQuestionIndex
                                ? "bg-purple-500 scale-125 career-active"
                                : formData.careerInterest[
                                    questions.careerInterest[index]
                                  ]
                                ? "bg-green-500 hover:bg-green-400"
                                : "bg-gray-400 hover:bg-gray-300"
                            } transition-all duration-300 hover:scale-125`}
                          />
                        ))}
                      </div>

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
                        className={`navigation-button career ${
                          currentQuestionIndex ===
                          questions.careerInterest.length - 1
                            ? "bg-gray-400"
                            : ""
                        }`}
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="progress-bar-container">
                    <div
                      className="progress-bar career"
                      style={{
                        width: `${
                          ((currentQuestionIndex + 1) /
                            questions.careerInterest.length) *
                          100
                        }%`,
                      }}
                    />
                  </div>

                  {/* Animated Question Content */}
                  <div className="scrollable-content scrollbar-thin-purple">
                    <div
                      key={currentQuestionIndex}
                      className="question-container"
                    >
                      <h4 className="question-text animate-fade-in-up">
                        {questions.careerInterest[currentQuestionIndex]}
                      </h4>

                      <div className="choices-grid text-text-primary font-poppins ">
                        {[1, 2, 3, 4, 5].map((val, index) => {
                          const isSelected =
                            formData.careerInterest[
                              questions.careerInterest[currentQuestionIndex]
                            ] === val;

                          return (
                            <label
                              key={val}
                              className={`career-choice-label career-choice-animate career-choice-animate-delay-${
                                index + 1
                              } ${
                                isSelected
                                  ? "border-purple-500 bg-purple-500/20 scale-105"
                                  : "border-gray-300"
                              } transition-all duration-300`}
                              onAnimationEnd={(e) => {
                                if (e.animationName === "careerPulse") {
                                  e.currentTarget.classList.remove(
                                    "career-choice-selected"
                                  );
                                }
                              }}
                            >
                              <input
                                type="radio"
                                name={`career-question-${currentQuestionIndex}`}
                                value={val}
                                checked={isSelected}
                                onChange={() => {
                                  handleChange(
                                    "careerInterest",
                                    questions.careerInterest[
                                      currentQuestionIndex
                                    ],
                                    val
                                  );
                                  setTimeout(() => {
                                    const element = document
                                      .querySelector(
                                        `input[name="career-question-${currentQuestionIndex}"][value="${val}"]`
                                      )
                                      ?.closest("label");
                                    if (element) {
                                      element.classList.add(
                                        "career-choice-selected"
                                      );
                                    }
                                  }, 10);
                                }}
                                className="career-choice-input"
                              />
                              <span className="career-choice-text">
                                {val}️⃣ {choiceLabels[val]}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Learning Style Section */}
              {currentSection === 3 && (
                <div className="form-section">
                  <div className="section-header">
                    <h3 className="section-title text-pink-600 font-poppins">
                      Learning Style
                    </h3>
                  </div>

                  {/* Progress Section */}
                  <div className="progress-info">
                    <span className="progress-text learning">
                      Question {currentQuestionIndex + 1} of{" "}
                      {questions.learningStyle.length}
                    </span>

                    <div className="progress-controls">
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentQuestionIndex((prev) =>
                            Math.max(0, prev - 1)
                          )
                        }
                        disabled={currentQuestionIndex === 0}
                        className={`navigation-button learning ${
                          currentQuestionIndex === 0 ? "bg-gray-400" : ""
                        } transition-all duration-300 hover:scale-110`}
                      >
                        <ChevronLeft size={20} />
                      </button>

                      <div className="progress-dots">
                        {questions.learningStyle.map((_, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setCurrentQuestionIndex(index)}
                            className={`progress-dot ${
                              index === currentQuestionIndex
                                ? "bg-pink-500 scale-125 learning-active"
                                : formData.learningStyle[
                                    questions.learningStyle[index].question
                                  ]
                                ? "bg-green-500 hover:bg-green-400"
                                : "bg-gray-400 hover:bg-gray-300"
                            } transition-all duration-300 hover:scale-125`}
                          />
                        ))}
                      </div>

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
                        className={`navigation-button learning ${
                          currentQuestionIndex ===
                          questions.learningStyle.length - 1
                            ? "bg-gray-400"
                            : ""
                        } transition-all duration-300 hover:scale-110`}
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>

                  {/* FIXED Progress Bar - Now shows accurate completion */}
                  <div className="progress-bar-container">
                    <div
                      className="progress-bar learning"
                      style={{
                        width: `${
                          ((currentQuestionIndex + 1) /
                            questions.learningStyle.length) *
                          100
                        }%`,
                      }}
                    />
                  </div>

                  {/* Animated Question Content */}
                  <div className="scrollable-content scrollbar-thin-pink">
                    <div className="question-container">
                      <h4 className="question-text animate-fade-in-up">
                        {
                          questions.learningStyle[currentQuestionIndex]
                            ?.question
                        }
                      </h4>

                      <div className="learning-options">
                        {questions.learningStyle[
                          currentQuestionIndex
                        ]?.options.map((opt, index) => {
                          const isSelected =
                            formData.learningStyle[
                              questions.learningStyle[currentQuestionIndex]
                                .question
                            ] === opt;

                          return (
                            <label
                              key={opt}
                              className={`learning-choice-label learning-choice-animate learning-choice-animate-delay-${
                                index + 1
                              } ${
                                isSelected
                                  ? "border-pink-500 bg-pink-500/20 scale-105"
                                  : "border-gray-300 hover:border-pink-400 hover:bg-pink-500/10"
                              } transition-all duration-300 hover:scale-105`}
                            >
                              <input
                                type="radio"
                                name={`learning-question-${currentQuestionIndex}`}
                                value={opt}
                                checked={isSelected}
                                onChange={() => {
                                  handleChange(
                                    "learningStyle",
                                    questions.learningStyle[
                                      currentQuestionIndex
                                    ].question,
                                    opt
                                  );
                                }}
                                className="learning-choice-input"
                              />
                              <span className="learning-choice-text">
                                {opt}
                              </span>
                            </label>
                          );
                        })}
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
          <div className="nav-buttons-container">
            <div className="nav-buttons-group">
              {currentSection > 0 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className={`nav-button ${getSectionColorClass(
                    sections[currentSection - 1]
                  )}`}
                >
                  Previous Section
                </button>
              )}

              {currentSection < sections.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className={`nav-button ${getSectionColorClass(
                    sections[currentSection]
                  )}`}
                >
                  Next Section
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className={`nav-button ${
                    isLearningStyleComplete()
                      ? "bg-green-600 hover:bg-green-500 border-green-500"
                      : "bg-gray-500 hover:bg-gray-400 border-gray-400 cursor-not-allowed"
                  }`}
                  disabled={!isLearningStyleComplete()}
                >
                  {isLearningStyleComplete()
                    ? "Review Answers"
                    : "Complete All Questions"}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Review Section Buttons */}
        {showReview && (
          <div className="review-buttons-container">
            <button
              type="button"
              onClick={() => setShowReview(false)}
              className="review-button bg-gray-600 hover:bg-gray-500 border-gray-500"
            >
              Back to Form
            </button>

            <button
              type="button"
              onClick={saveAnswersLocally}
              className="review-button bg-blue-600 hover:bg-blue-500 border-blue-500 flex items-center gap-2"
            >
              <Download size={18} />
              Save Answers Locally
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className={`review-button ${
                loading
                  ? "bg-gray-500 cursor-not-allowed border-gray-400"
                  : "bg-green-600 hover:bg-green-500 border-green-500"
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
        contentClassName="modal-content-custom"
      >
        <Modal.Header closeButton className="modal-header-custom">
          <Modal.Title className="modal-title-custom">
            Confirm Reset
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-custom">
          {sectionToReset
            ? `Are you sure you want to reset the ${categoryTitles[sectionToReset]} section?`
            : "Are you sure you want to reset ALL sections?"}
        </Modal.Body>
        <Modal.Footer className="modal-footer-custom">
          <button
            type="button"
            className="modal-button modal-button-cancel"
            onClick={() => setShowResetModal(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="modal-button modal-button-confirm"
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
