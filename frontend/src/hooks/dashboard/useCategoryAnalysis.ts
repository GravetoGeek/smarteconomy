import { useQuery } from '@apollo/client';
import { CATEGORY_ANALYSIS } from '../../graphql/queries/dashboard.queries';

interface CategoryAnalysisVariables {
  userId: string;
  period?: string;
}

export const useCategoryAnalysis = (userId: string, period?: string) => {
  const { data, loading, error, refetch } = useQuery(CATEGORY_ANALYSIS, {
    variables: { userId, period },
    skip: !userId,
  });

  const parseData = () => {
    if (!data?.categoryAnalysis) return { expenses: [], income: [] };
    
    try {
      const parsed = JSON.parse(data.categoryAnalysis);
      return {
        expenses: parsed.expenses || [],
        income: parsed.income || [],
      };
    } catch (err) {
      console.error('Error parsing category analysis:', err);
      return { expenses: [], income: [] };
    }
  };

  return {
    categoryData: parseData(),
    loading,
    error,
    refetch,
  };
};
