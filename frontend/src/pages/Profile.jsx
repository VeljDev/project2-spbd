import { Alert, AlertIcon, Center, Heading, Text } from "@chakra-ui/react";
import useAuth from "../hooks/useAuth";

const Profile = () => {
  const { employee } = useAuth();
  const { Email, FirstName, LastName, Verified, createdAt } = employee;
  return (
    <Center mt={16} flexDir="column">
      <Heading mb={4}>My Account</Heading>
      {!Verified && (
        <Alert status="warning" w="fit-content" borderRadius={12} mb={3}>
          <AlertIcon />
          Please verify your email
        </Alert>
      )}
      <Text color="white" mb={2}>
        Email:{" "}
        <Text as="span" color="gray.300">
          {Email}
        </Text>
      </Text>
      <Text color="white" mb={2}>
        First name:{" "}
        <Text as="span" color="gray.300">
          {FirstName}
        </Text>
      </Text>
      <Text color="white" mb={2}>
        Last name:{" "}
        <Text as="span" color="gray.300">
          {LastName}
        </Text>
      </Text>
      <Text color="white">
        Created on{" "}
        <Text as="span" color="gray.300">
          {new Date(createdAt).toLocaleDateString("en-US")}
        </Text>
      </Text>
    </Center>
  );
};
export default Profile;