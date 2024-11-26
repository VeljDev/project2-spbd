import { useState } from "react";
import { Box, Container, Flex, FormControl, FormLabel, Heading, Input, Stack, Link as ChakraLink, Button, Text } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { register } from "../lib/api";


function Register() {

    const navigate = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const {
        mutate: createAccount,
        isPending,
        isError,
        error
    } = useMutation({
        mutationFn: register,
        onSuccess: () => {
            navigate("/", {
                replace: true
            })
        }
    });
    return (
        <Flex minH="100vh" align="center" justify="center">
            <Container mx="auto" maxW="md" py={12} px={6} textAlign="center">
                <Heading fontSize="4xl" mb={8}>
                    Create an account
                </Heading>
                <Box rounded="lg" bg="gray.700" boxShadow="lg" p={8}>
                    {
                        isError && (
                            <Box mb={3} color="red.400">
                                {
                                    error?.message || "An error occurred"
                                }
                            </Box>
                        )
                    }
                    <Stack spacing={4}>
                        <FormControl id="email">
                            <FormLabel>Email address</FormLabel>
                            <Input
                                type="email"
                                autoFocus
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </FormControl>
                        <FormControl id="firstName">
                            <FormLabel>First name</FormLabel>
                            <Input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </FormControl>
                        <FormControl id="lastName">
                            <FormLabel>Last name</FormLabel>
                            <Input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </FormControl>
                        <FormControl id="password">
                            <FormLabel>Password</FormLabel>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Text color="text.muted" fontSize="xs" textAlign="left" mt={2}>
                                - Must be between 6 to 14 characters long.
                            </Text>
                            <Text color="text.muted" fontSize="xs" textAlign="left" mt={2}>
                                - Must include at least one uppercase letter (A-Z).
                            </Text>
                            <Text color="text.muted" fontSize="xs" textAlign="left" mt={2}>
                                - Must include at least one lowercase letter (a-z).
                            </Text>
                            <Text color="text.muted" fontSize="xs" textAlign="left" mt={2}>
                                - Must include at least one number (0-9).
                            </Text>
                            <Text color="text.muted" fontSize="xs" textAlign="left" mt={2}>
                                - Must include at least one special character (e.g., !, @, #, $, %).
                            </Text>
                        </FormControl>
                        <FormControl id="confirmPassword">
                            <FormLabel>Confirm Password</FormLabel>
                            <Input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                onKeyDown={
                                    (e) => e.key === "Enter" && createAccount({ email, password, confirmPassword, firstName, lastName })
                                }
                            />
                        </FormControl>
                        <Button my={2} isDisabled={!email || !firstName || !lastName || password.length < 6 || password !== confirmPassword}
                            isLoading={isPending}
                            onClick={
                                () => createAccount({ email, firstName, lastName, password, confirmPassword })
                            }
                        >
                            Create Account
                        </Button>
                        <Text align="center" fontSize="sm" color="text.muted">
                            Already have an account?{" "}
                            <ChakraLink as={Link} to="/login">
                                Sign in
                            </ChakraLink>
                        </Text>
                    </Stack>
                </Box>
            </Container>
        </Flex>
    )
};

export default Register;