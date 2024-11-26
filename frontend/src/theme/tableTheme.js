import { defineStyleConfig } from "@chakra-ui/react";


const tableTheme = defineStyleConfig({
    baseStyle: {
      th: {
        bg: "gray.900", // Dark gray background for the header
        color: "gray.200", // Light gray text for better readability
        fontWeight: "bold",
        textTransform: "uppercase",
        fontSize: "sm",
        letterSpacing: "wide",
        paddingY: 4,
        borderBottom: "1px solid",
        borderColor: "gray.600", // Subtle border for header cells
      },
      td: {
        bg: "gray.800", // Slightly lighter than the app background for cells
        color: "gray.300", // Text color for table rows
        borderBottom: "1px solid",
        borderColor: "gray.700", // Subtle border for row separation
      },
      caption: {
        color: "gray.400",
        fontSize: "md",
      },
    },
    defaultProps: {
      variant: "striped", // Keep alternating row colors
      size: "md",
    },
  });

export default tableTheme;