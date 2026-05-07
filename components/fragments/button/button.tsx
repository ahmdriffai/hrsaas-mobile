import clsx from "clsx";
import { ActivityIndicator, Pressable, Text } from "react-native";

type Props = {
  children: React.ReactNode;
  icon?: boolean;
  variant?:
    | "primary"
    | "secondary"
    | "third"
    | "outline"
    | "ghost"
    | "danger"
    | "link";
  size?: "sm" | "md" | "lg";
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  onPress?: () => void;
};

export default function Button({
  children,
  icon = false,
  variant = "primary",
  size = "md",
  className,
  disabled,
  loading,
  onPress,
}: Props) {
  const isDisabled = disabled || loading;

  const baseStyle = "rounded-lg flex-row items-center justify-center gap-1";

  const variants = {
    primary: "bg-primary",
    secondary: "bg-zinc-900",
    third: "bg-zinc-100 rounded-full p-2",
    outline: "border border-zinc-300 bg-transparent",
    ghost: "bg-transparent p-2",
    danger: "bg-red-500",
    link: "bg-transparent p-1",
  };

  const textVariants = {
    primary: "text-white",
    secondary: "text-white",
    third: "text-black",
    outline: "text-zinc-900",
    ghost: "text-zinc-900",
    danger: "text-white",
    link: "text-black underline",
  };

  const sizes = {
    sm: "px-3 py-1.5",
    md: "px-6 py-3",
    lg: "px-6 py-3",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={clsx(
        baseStyle,
        variants[variant],
        sizes[size],
        icon && "rounded-full",
        isDisabled && "opacity-50",
        className,
      )}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text
          className={clsx(
            "font-medium",
            textVariants[variant],
            textSizes[size],
          )}
        >
          {children}
        </Text>
      )}
    </Pressable>
  );
}
