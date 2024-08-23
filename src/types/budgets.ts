export interface BudgetFilterParams {
  startDate?: string;
  endDate?: string;
}

export interface BudgetSortingParams {
  orderBy?: string;
  orderType?: 'asc' | 'desc';
}

export interface Budget {
  id: string;
  date: string;
  budget: number;
  recordedExpense: number;
  otherExpense: number;
  surplus: number;
  notes: string;
}

export interface BudgetsOverview {
  month: number;
  currentYear: Budget;
  lastYear: Budget;
}
