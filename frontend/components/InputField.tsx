import { TextInput, TextInputProps } from "react-native";
import { GlobalStyles } from "../theme/theme";

interface Props extends TextInputProps {
  placeholder: string;
}

export default function InputField({ placeholder, style, ...rest }: Props) {
  return (
    <TextInput
      placeholder={placeholder}
      style={[GlobalStyles.input, style]}
      placeholderTextColor="#A08080"
      {...rest}
    />
  );
}