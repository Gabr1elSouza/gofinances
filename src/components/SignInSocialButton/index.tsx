import React from "react";
import { ActivityIndicator } from "react-native";
import { RectButtonProps } from "react-native-gesture-handler";
import { SvgProps } from "react-native-svg";
import theme from "../../global/styles/theme";
import { Button, Center, ImageContainer, Text } from "./styles";

interface Props extends RectButtonProps {
  title: string;
  svg: React.FC<SvgProps>;
  isLoading: boolean;
}

export function SignInSocialButton({
  title,
  svg: Svg,
  isLoading,
  ...rest
}: Props) {
  return (
    <Button {...rest}>
      <ImageContainer>
        <Svg />
      </ImageContainer>
      {isLoading ? (
        <>
          <Center>
            <ActivityIndicator color={theme.colors.secondary} />
          </Center>
        </>
      ) : (
        <Text>{title}</Text>
      )}
    </Button>
  );
}
