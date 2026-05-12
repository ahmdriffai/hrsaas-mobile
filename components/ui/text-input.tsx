import { TextInput as RNTextInput, TextInputProps } from "react-native";

const TextInput = ({ style, ...props }: TextInputProps) => {
  return (
    <RNTextInput
      style={[{ fontFamily: "Inter_400Regular" }, style]}
      {...props}
    />
  );
};

export { TextInput };
export default TextInput;
