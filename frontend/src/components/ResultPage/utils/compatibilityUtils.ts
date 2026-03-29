export const getCompatibilityDescription = (percentage: number): string => {
  if (percentage >= 80)
    return "🎯 Excellent match with your profile and career goals";
  if (percentage >= 60)
    return "✅ Strong compatibility with your skills and interests";
  if (percentage >= 40)
    return "📊 Moderate alignment with your assessment results";
  if (percentage >= 20) return "ℹ️ Some relevant aspects match your profile";
  return "💡 Limited compatibility based on current assessment";
};
