import { Heading, HeadingProps } from "@chakra-ui/react";

type PageTitleProps = HeadingProps & {
  children: React.ReactNode;
};

export const PageTitle = ({ children, ...props }: PageTitleProps) => (
  <Heading
    as="h1"
    fontSize={{ base: "2xl", md: "3xl" }}
    lineHeight={1.4}
    {...props}
  >
    {children}
  </Heading>
);
