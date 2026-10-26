// Text colours are chosen to meet WCAG AA (4.5:1) against `background` and `surface`.
const light = {
  background: "#F2F2F7",
  surface: "#FFFFFF",
  surfaceBorder: "#E5E5EA",
  separator: "#E5E5EA",
  text: "#111111",
  textSecondary: "#5F5F66",
  textTertiary: "#8A8A90",
  primary: "#0069E0",
  onPrimary: "#FFFFFF",
  link: "#0069E0",
  success: "#18803A",
  successFill: "#2DA44E",
  successSurface: "#E3F4E8",
  dangerSurface: "#FDECEC",
  warning: "#A15C00",
  danger: "#C62828",
  featuredSurface: "#EAF1FB",
  featuredBorder: "#DCE6F5",
  progressTrack: "#D1D5DB",
  progressContainer: "#FFFFFF",
  inverse: "#111111",
  onInverse: "#FFFFFF",
  linkSurface: "#E4ECF8",
  illustrationPaper: "#FFFFFF",
  illustrationPhoto: "#D9E6F8",
  illustrationIcon: "#7FA5DB",
  illustrationInk: "#4A4A50",
  illustrationLine: "#ECECF0",
  illustrationDotWarm: "#F5C6A5",
  illustrationDotCool: "#BFE3C8",
  illustrationDash: "#AEB4BE",
  illustrationShadow: "rgba(17, 17, 17, 0.14)",
};

export type ThemeColors = typeof light;

const dark: ThemeColors = {
  background: "#000000",
  surface: "#1C1C1E",
  surfaceBorder: "#2C2C2E",
  separator: "#38383A",
  text: "#FFFFFF",
  textSecondary: "#AEAEB2",
  textTertiary: "#8E8E93",
  primary: "#0069E0",
  onPrimary: "#FFFFFF",
  link: "#5AA2FF",
  success: "#5FD68A",
  successFill: "#34C759",
  successSurface: "#143D22",
  dangerSurface: "#3D1414",
  warning: "#F5B041",
  danger: "#FF6B6B",
  featuredSurface: "#13233A",
  featuredBorder: "#1F3556",
  progressTrack: "#3A3A3C",
  progressContainer: "#2C2C2E",
  inverse: "#FFFFFF",
  onInverse: "#111111",
  linkSurface: "#1A2F4D",
  illustrationPaper: "#2C2C2E",
  illustrationPhoto: "#1F3556",
  illustrationIcon: "#7FA5DB",
  illustrationInk: "#C7C7CC",
  illustrationLine: "#3A3A3C",
  illustrationDotWarm: "#B5835F",
  illustrationDotCool: "#5E9A6D",
  illustrationDash: "#636366",
  illustrationShadow: "rgba(0, 0, 0, 0.6)",
};

export const Colors = { light, dark };

// White initials stay above 4.5:1 on every swatch.
export const AvatarText = "#FFFFFF";
export const AvatarColors = ["#C2185B", "#7B5E57", "#1565C0", "#5E35B1", "#00796B", "#AD1457"];

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 20,
  pill: 999,
};

export const FontSize = {
  caption: 12,
  footnote: 13,
  subhead: 15,
  body: 17,
  heading: 20,
  title: 24,
  balanceFraction: 28,
  balance: 44,
};

export const TouchTarget = 44;
