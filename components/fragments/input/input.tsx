import Feather from "@expo/vector-icons/Feather";
import clsx from "clsx";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

type Props = {
  label: string;
  value: any;
  onChange?: (val: string) => void;
  className?: string;
  type?: "number" | "text" | "password";
  prefix?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  readonly?: boolean;
  disabled?: boolean;
};

export default function Input({
  label,
  value,
  onChange,
  className,
  type = "text",
  onFocus,
  onBlur,
  prefix,
  readonly,
  disabled,
}: Props) {
  const [isSecure, setIsSecure] = useState(type === "password");
  const [isFocused, setIsFocused] = useState(false);

  const isActive = isFocused || (value !== null && value !== "" && value !== 0);

  return (
    <View className={clsx("relative w-full", className)}>
      {/* Wrapper */}
      <View
        className={clsx(
          "flex-row items-center rounded-xl border px-3 pt-4",
          isFocused ? "border-black" : "border-gray-400",
          disabled && "bg-gray-200",
        )}
      >
        {/* Prefix */}
        {prefix && isActive && (
          <Text className="mr-2 text-gray-500">{prefix}</Text>
        )}

        {/* Input */}
        <TextInput
          editable={!disabled && !readonly}
          value={value === 0 ? "" : String(value)}
          onChangeText={(text) => onChange?.(text)}
          onFocus={() => {
            setIsFocused(true);
            onFocus?.();
          }}
          onBlur={() => {
            setIsFocused(false);
            onBlur?.();
          }}
          secureTextEntry={type === "password" && isSecure}
          keyboardType={type === "number" ? "numeric" : "default"}
          className="text-md w-full bg-transparent text-md text-black"
        />
        {type === "password" && (
          <Pressable
            className="absolute right-3"
            onPress={() => setIsSecure(!isSecure)}
          >
            {isSecure ? (
              <Feather name="eye" size={24} color="black" />
            ) : (
              <Feather name="eye-off" size={24} color="black" />
            )}
          </Pressable>
        )}
      </View>

      {/* Label */}
      <Text
        className={clsx(
          "absolute left-4 text-gray-500",
          isActive ? "top-2 text-xs" : "top-1/2 -translate-y-1/2 text-md",
        )}
      >
        {label}
      </Text>
    </View>
  );
}
