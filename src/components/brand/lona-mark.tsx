import Svg, { Path } from "react-native-svg";

import { useThemeColors } from "@/hooks/use-theme";

/** Width / height of the mark's artwork. */
export const LONA_MARK_ASPECT = 48 / 40;

type LonaMarkProps = {
  /** Rendered width; height follows the artwork's aspect ratio. */
  size: number;
  color?: string;
};

/** The Lona mark: a swept arrow pointing forward. Decorative unless labelled by its parent. */
export function LonaMark({ size, color }: LonaMarkProps) {
  const colors = useThemeColors();

  return (
    <Svg width={size} height={size / LONA_MARK_ASPECT} viewBox="0 0 48 40">
      <Path
        d="M3 3 C18 9 34 15 46 20 C34 25 18 31 3 37 C10 30 14 25 14 20 C14 15 10 10 3 3 Z"
        fill={color ?? colors.primary}
      />
    </Svg>
  );
}
