export const budgetRecommendationPrompt = (data: {
  monthlyIncome: number;
  spending: { category: string; spent: number; currentBudget: number }[];
}) => `
You are a personal finance advisor.

Based on the user's monthly income and spending history below, recommend a realistic budget for each category.

MONTHLY INCOME: $${data.monthlyIncome}

CURRENT SPENDING:
${data.spending.map((s) => `- ${s.category}: spent $${s.spent}, current budget $${s.currentBudget}`).join("\n")}

Rules:
- Use the 50/30/20 rule as a guide (50% needs, 30% wants, 20% savings)
- Be realistic based on actual spending
- For each category give a recommended budget and a short reason why

Return ONLY a valid JSON object like this, no explanation, no markdown:
{
  "recommendations": [
    {
      "category": "Food & Dining",
      "currentBudget": 500,
      "recommendedBudget": 400,
      "status": "over",
      "reason": "You are overspending by $50. Try meal prepping to reduce costs."
    }
  ],
  "summary": "short overall financial health summary here"
}

status must be exactly one of: "over", "under", "good"
`;