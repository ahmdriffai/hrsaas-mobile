import Feather from "@expo/vector-icons/Feather";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

interface Props {
  label?: string;
  secure?: boolean;
  onChange?: (value: string) => void;
  value?: string;
  prefixIcon?: React.ReactNode;
}
interface Props {
  label?: string;
  secure?: boolean;
  onChange?: (value: string) => void;
  value?: string;
  prefixIcon?: React.ReactNode;
  error?: string; // ✅ tambah prop error
}

export default function Input({
  label,
  secure,
  onChange,
  value,
  prefixIcon,
  error,
}: Props) {
  const [isSecure, setIsSecure] = useState(secure);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.text}>{label}</Text>}
      <View
        style={[styles.inputWrapper, error ? styles.inputWrapperError : null]}
      >
        {prefixIcon && <View style={styles.prefixIcon}>{prefixIcon}</View>}
        <TextInput
          secureTextEntry={isSecure}
          style={[
            styles.input,
            prefixIcon ? styles.inputWithPrefix : null,
            error ? styles.inputError : null,
          ]}
          onChangeText={onChange}
          value={value}
        />
        {secure && (
          <Pressable style={styles.eye} onPress={() => setIsSecure(!isSecure)}>
            {isSecure ? (
              <Feather name="eye" size={24} color="black" />
            ) : (
              <Feather name="eye-off" size={24} color="black" />
            )}
          </Pressable>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
      {/* ✅ tampilkan error */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: 10,
    flexWrap: "wrap",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
  },
  inputWrapperError: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FF4D4F",
  },
  text: {
    fontSize: 12,
    fontWeight: "400",
    marginBottom: 5,
    color: "#999",
  },
  input: {
    width: "100%",
    backgroundColor: "#F3F3F3",
    height: 45,
    borderRadius: 10,
    color: "#090909",
    paddingHorizontal: 15,
  },
  inputWithPrefix: {
    paddingLeft: 42,
  },
  inputError: {
    backgroundColor: "#FFF1F0",
  },
  prefixIcon: {
    position: "absolute",
    left: 13,
    zIndex: 1,
  },
  eye: { position: "absolute", right: 17 },
  errorText: {
    width: "100%",
    fontSize: 11,
    color: "#FF4D4F",
    marginTop: 4,
  },
});
