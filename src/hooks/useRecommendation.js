import { useAssessment } from "../context/Assessmentcontext";

export function useRecommendations() {
  const { recommendations, assessmentAnswers } = useAssessment();

  const hasResults = recommendations && recommendations.length > 0;

  const getCourseById = (id) =>
    recommendations?.find((r) => r.id === parseInt(id)) || null;

  return {
    recommendations,
    assessmentAnswers,
    hasResults,
    getCourseById,
    strand: assessmentAnswers?.strand || null,
  };
}