import { Alert, AlertIcon, Box, Button, Center, Heading, HStack, Spinner, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import useCustomers from "../hooks/useCustomers";
import { useState } from "react";

const Customers = () => {
    const { customers, isLoading } = useCustomers();

    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10; // Number of rows per page

    if (isLoading) {
        return (
            <Center w="100vw" h="90vh" flexDir="column">
                <Spinner mb={4} />
            </Center>
        );
    }

    if (!customers) {
        return (
            <Center mt={16} flexDir="column">
                <Heading mb={4}>My Customers</Heading>
                <Alert status="error" w="fit-content" borderRadius={12} mb={3}>
                    <AlertIcon />
                    Error while loading customers
                </Alert>
            </Center>
        );
    }

    if (customers.length == 0) {
        return (
            <Center mt={16} flexDir="column">
                <Heading mb={4}>My Customers</Heading>
                <Alert status="info" w="fit-content" borderRadius={12} mb={3}>
                    <AlertIcon />
                    You have no customers
                </Alert>
            </Center>
        );
    }

    // Calculate pagination data
    const totalPages = Math.ceil(customers.length / rowsPerPage);
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = customers.slice(indexOfFirstRow, indexOfLastRow);

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const handlePreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    return (
        <Center mt={16} flexDir="column">
            <Heading mb={4}>My Customers</Heading>
            <TableContainer w="90%">
                <Table variant="striped" size="md">
                    <Thead>
                        <Tr>
                            <Th>First Name</Th>
                            <Th>Last Name</Th>
                            <Th>Email</Th>
                            <Th>Phone</Th>
                            <Th>City</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {currentRows.map((customer) => (
                            <Tr key={customer._id}>
                                <Td>{customer.FirstName}</Td>
                                <Td>{customer.LastName}</Td>
                                <Td>{customer.Email}</Td>
                                <Td>{customer.Phone || "N/A"}</Td>
                                <Td>{customer.City || "N/A"}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
            <Box mt={4} display="flex" alignItems="center">
                <Button onClick={handlePreviousPage} isDisabled={currentPage === 1} mr={2}>
                    Previous
                </Button>
                <Box>
                    Page {currentPage} of {totalPages}
                </Box>
                <Button onClick={handleNextPage} isDisabled={currentPage === totalPages} ml={2}>
                    Next
                </Button>
            </Box>
        </Center>
    );
};
export default Customers;