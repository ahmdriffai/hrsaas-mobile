import { Colors } from "@/constans/color";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";

type Variant = "primary" | "secondary" | "third" | "outline" | "ghost" | "danger" | "link";
type Size = "sm" | "md" | "lg";

type Props = {
  children: React.ReactNode;
  icon?: boolean;
  variant?: Variant;
  size?: Size;
  style?: ViewStyle;
  loading?: boolean;
  disabled?: boolean;
  onPress?: () => void;
};

const BG: Record<Variant, string> = {
  primary:   Colors.light.primary,
  secondary: Colors.light.gray900,
  third:     Colors.light.gray100,
  outline:   "transparent",
  ghost:     "transparent",
  danger:    Colors.light.error,
  link:      "transparent",
};

const TEXT_COLOR: Record<Variant, string> = {
  primary:   Colors.light.white,
  secondary: Colors.light.white,
  third:     Colors.light.black,
  outline:   Colors.light.gray900,
  ghost:     Colors.light.gray900,
  danger:    Colors.light.white,
  link:      Colors.light.black,
};

const BORDER_COLOR: Partial<Record<Variant, string>> = {
  outline: Colors.light.border,
};

const PADDING: Record<Size, { paddingHorizontal: number; paddingVertical: number }> = {
  sm: { paddingHorizontal: 12, paddingVertical: 6 },
  md: { paddingHorizontal: 24, paddingVertical: 12 },
  lg: { paddingHorizontal: 24, paddingVertical: 14 },
};

const FONT_SIZE: Record<Size, number> = {
  sm: 12,
  md: 16,
  lg: 18,
};

export default function Button({
  children,
  icon = false,
  variant = "primary",
  size = "md",
  style,
  disabled,
  loading,
  onPress,
}: Props) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={[
        styles.base,
        PADDING[size],
        {
          backgroundColor: BG[variant],
          borderRadius: icon || variant === "third" ? 999 : 8,
          borderWidth: variant === "outline" ? 1 : 0,
          borderColor: BORDER_COLOR[variant] ?? "transparent",
          opacity: isDisabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={Colors.light.white} />
      ) : (
        <Text
          style={[
            styles.text,
            {
              color: TEXT_COLOR[variant],
              fontSize: FONT_SIZE[size],
              textDecorationLine: variant === "link" ? "underline" : "none",
            },
          ]}
        >
          {children}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  text: {
    fontWeight: "500",
  },
});
