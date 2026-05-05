export type TeamTabConfig = { key: string; label: string };

export const TEAM_TAB_ORDER = [
  { key: "all", label: "All" },
  { key: "advisory_board", label: "Advisory Board" },
  { key: "executive_council", label: "Executive Council" },
  { key: "management_team", label: "Management Team" },
  { key: "fellows", label: "Fellows" },
] as const;

export type CanonicalTeamTabKey = (typeof TEAM_TAB_ORDER)[number]["key"];

export function normalizeTeamTabs(configuredTabs: TeamTabConfig[] | undefined): TeamTabConfig[] {
  const labelByKey = new Map(
    (configuredTabs ?? []).map((tab) => [String(tab.key).trim().toLowerCase(), String(tab.label).trim()])
  );

  return TEAM_TAB_ORDER.map((tab) => ({
    key: tab.key,
    label: labelByKey.get(tab.key) || tab.label,
  }));
}
