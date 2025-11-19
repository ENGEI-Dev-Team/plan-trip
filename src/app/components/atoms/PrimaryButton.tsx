import { Button, ButtonProps } from "@chakra-ui/react";

type PrimaryButtonProps = ButtonProps & {
  label: string;
};

export const PrimaryButton = ({ label, ...props }: PrimaryButtonProps) => {
  return (
    <Button
      borderRadius="full"
      colorScheme="orange"
      size="lg"
      w={{ base: "100%", md: "auto" }}
      boxShadow="0 10px 20px rgba(255,127,80,0.35)"
      _hover={{
        boxShadow: "0 12px 24px rgba(255,127,80,0.4)",
        transform: "translateY(-1px)",
      }}
      _active={{
        boxShadow: "0 6px 12px rgba(255,127,80,0.3)",
        transform: "translateY(0)",
      }}
      {...props}
    >
      {label}
    </Button>
  );
};
