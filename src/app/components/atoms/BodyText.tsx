import { Text, TextProps } from "@chakra-ui/react";

type BodyTextProps = TextProps & {
  children: React.ReactNode;
};

export const BodyText = ({ children, ...props }: BodyTextProps) => (
  <Text fontSize={{ base: "sm", md: "md" }} color="gray.600" {...props}>
    {children}
  </Text>
);
