import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRef } from "react";
import {
  Animated,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";

const PRIMARY = "#3F9AAE";

type Variant = "primary" | "outline" | "ghost" | "secondary" | "danger" | "success";

interface Props {
  title: string;
  variant?: Variant;
  onPress?: () => void;
  icon?: keyof typeof MaterialIcons.glyphMap;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<
  Variant,
  { bg: string; border: string; text: string; iconColor: string }
> = {
  primary: {
    bg: PRIMARY,
    border: PRIMARY,
    text: "#fff",
    iconColor: "#fff",
  },
  outline: {
    bg: "transparent",
    border: PRIMARY,
    text: PRIMARY,
    iconColor: PRIMARY,
  },
  ghost: {
    bg: "transparent",
    border: "transparent",
    text: PRIMARY,
    iconColor: PRIMARY,
  },
  secondary: {
    bg: "#E8F4F7",
    border: "#E8F4F7",
    text: PRIMARY,
    iconColor: PRIMARY,
  },
  danger: {
    bg: "#DC2626",
    border: "#DC2626",
    text: "#fff",
    iconColor: "#fff",
  },
  success: {
    bg: "#16A34A",
    border: "#16A34A",
    text: "#fff",
    iconColor: "#fff",
  },
};

export default function Button({
  title,
  onPress,
  variant = "primary",
  icon,
  style,
  disabled = false,
  fullWidth = false,
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const { bg, border, text, iconColor } = variantStyles[variant];

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.93,
      useNativeDriver: true,
      speed: 50,
      bounciness: 0,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 14,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: bg,
          borderColor: border,
          opacity: disabled ? 0.5 : 1,
          transform: [{ scale }],
          alignSelf: fullWidth ? "stretch" : "flex-start",
        },
        style,
      ]}
    >
      <Pressable
        style={styles.pressable}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
      >
        {icon && (
          <MaterialIcons name={icon} size={18} color={iconColor} />
        )}
        <Text style={[styles.label, { color: text }]}>{title}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    borderRadius: 30,
    borderWidth: 1.5,
    overflow: "hidden",
  },
  pressable: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
});
