import { Text as RNText, TextProps } from "react-native";

const Text = ({ style, ...props }: TextProps) => {
  return (
    <RNText style={[{ fontFamily: "Inter_400Regular" }, style]} {...props} />
  );
};

export { Text };
export default Text;
