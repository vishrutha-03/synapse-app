import { TextInput } from "react-native";
import { GlobalStyles } from "../theme/theme";

type Props = {
  placeholder: string;
  secureTextEntry?: boolean;
};

export default function InputField({ placeholder, secureTextEntry }: Props) {
  return (
    <TextInput
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      style={GlobalStyles.input}
      placeholderTextColor="#A08080"
    />
  );
}