import { Pressable, Text } from "react-native";
import { GlobalStyles } from "../theme/theme";

type Props = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
};

export default function PrimaryButton({
  label,
  onPress,
  variant = "primary",
  disabled = false,
}: Props) {
  const btnStyle =
    variant === "primary" ? GlobalStyles.btnPrimary : GlobalStyles.btnSecondary;

  const textStyle =
    variant === "primary"
      ? GlobalStyles.btnPrimaryText
      : GlobalStyles.btnSecondaryText;

  return (
  <Pressable
  style={btnStyle}
  onPress={onPress}
  disabled={disabled}
></Pressable>
  );
}