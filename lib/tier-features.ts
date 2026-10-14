/**
 * Tier-based Feature Gating & Entitlements Engine
 * Compliant with Bara Product & Design Specification:
 * - Basic: Core POS, offline ledger, inventory management, single device / 1 branch
 * - Pro: Multi-staff PINs & audit trails, full Reports & Consumables logging, up to 3 branches
 * - Premium: Unlimited branches, AI Demand Forecasting, AI Leakage/Variance anomaly alerts, Automated Restock orders
 */

export interface TierFeatures {
  tier: "basic" | "pro" | "premium"
  tierLabel: string
  canAccessReports: boolean
  canAccessConsumables: boolean
  canAccessAiInsights: boolean
  canManageStaff: boolean
  canTrackMovements: boolean
  maxBranches: number
  hasAiAlerts: boolean
  featuresList: string[]
}

export function getTierFeatures(tier: "basic" | "pro" | "premium" = "pro"): TierFeatures {
  switch (tier) {
    case "premium":
      return {
        tier: "premium",
        tierLabel: "Bara Premium",
        canAccessReports: true,
        canAccessConsumables: true,
        canAccessAiInsights: true,
        canManageStaff: true,
        canTrackMovements: true,
        maxBranches: Infinity,
        hasAiAlerts: true,
        featuresList: [
          "Practical Kitchen AI & Conversational Demand Assistant",
          "Leakage, Recipe Variance & Void Incident Anomaly Audits",
          "Automated 7-Day Restock Order Generator",
          "Multi-Staff Security PIN Roster & Audit Trails",
          "Full Sales Trajectories & Consumables Spend Breakdowns",
          "Unlimited Restaurant Branch Switching",
        ],
      }

    case "pro":
      return {
        tier: "pro",
        tierLabel: "Bara Pro",
        canAccessReports: true,
        canAccessConsumables: true,
        canAccessAiInsights: false,
        canManageStaff: true,
        canTrackMovements: true,
        maxBranches: 3,
        hasAiAlerts: false,
        featuresList: [
          "Multi-Staff Security PIN Roster & Audit Trails",
          "Financial Sales Totals & Daily Trajectory Charts",
          "Consumables Spend Logging & Monthly Category Analysis",
          "Read-Only Stock Movement History Log per Ingredient",
          "Multi-Branch Support (up to 3 locations)",
        ],
      }

    case "basic":
    default:
      return {
        tier: "basic",
        tierLabel: "Bara Basic",
        canAccessReports: false,
        canAccessConsumables: false,
        canAccessAiInsights: false,
        canManageStaff: false,
        canTrackMovements: false,
        maxBranches: 1,
        hasAiAlerts: false,
        featuresList: [
          "Offline-First Fast POS & Shared Tablet Service",
          "Core Menu Management & Recipe Builder",
          "Ingredient Stock & Low-Stock Thresholds",
          "Single Location / Sole Operator Workspace",
        ],
      }
  }
}
