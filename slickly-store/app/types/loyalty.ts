export interface LoyaltyLevel {
  level: number;
  name: string;
  minPoints: number;
  color: string;
  colorType: 'solid' | 'gradient';
}

export interface LoyaltySummary {
  availablePoints: number;
  totalEarned: number;
  totalSpent: number;
  level: number;
  levelName: string;
  levelColor: string;
  colorType: 'solid' | 'gradient';
  nextLevel: number | null;
  nextLevelName: string | null;
  nextLevelMinPoints: number | null;
  pointsToNextLevel: number | null;
  progressPercent: number;
  levels: LoyaltyLevel[];
}

export interface LoyaltyTransaction {
  id: string;
  points: number;
  type: 'purchase' | 'registration' | 'review' | 'redemption' | 'manual';
  description: string;
  createdAt: string;
}

export interface LoyaltyReward {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  type: 'percentage' | 'fixed' | 'free_shipping' | 'gift';
  discountValue: number;
  validDays: number;
  canRedeem: boolean;
}

export interface RedeemResult {
  success: boolean;
  code?: string;
  expiresAt?: string;
  pointsSpent?: number;
  error?: string;
}
