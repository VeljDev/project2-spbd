import {
    Alert,
    AlertIcon,
    Box,
    Button,
    Center,
    Flex,
    Heading,
    Input,
    Spinner,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import useCustomers from "../hooks/useCustomers";
import { useState } from "react";

const Customers = () => {
    const { customers, isLoading } = useCustomers();

    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10; // Number of rows per page

    // States for filtering
    const [filters, setFilters] = useState({
        FirstName: "",
        LastName: "",
        Email: "",
        Phone: "",
        City: "",
    });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
        setCurrentPage(1); // Reset to first page when filters change
    };

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

    if (customers.length === 0) {
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

    // Apply filters to customers
    const filteredCustomers = customers.filter((customer) => {
        return (
            (!filters.FirstName || customer.FirstName.toLowerCase().includes(filters.FirstName.toLowerCase())) &&
            (!filters.LastName || customer.LastName.toLowerCase().includes(filters.LastName.toLowerCase())) &&
            (!filters.Email || customer.Email.toLowerCase().includes(filters.Email.toLowerCase())) &&
            (!filters.Phone || customer.Phone?.toLowerCase().includes(filters.Phone.toLowerCase())) &&
            (!filters.City || customer.City?.toLowerCase().includes(filters.City.toLowerCase()))
        );
    });

    // Calculate pagination data
    const totalPages = Math.ceil(filteredCustomers.length / rowsPerPage);
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredCustomers.slice(indexOfFirstRow, indexOfLastRow);

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const handlePreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    return (
        <Center mt={16} flexDir="column">
            <Heading mb={4}>My Customers</Heading>

            {/* Filter inputs with responsive layout */}
            <Flex
                direction={{ base: "column", md: "row" }}
                w="90%"
                gap={4}
                mb={4}
            >
                <Input
                    placeholder="Filter by First Name"
                    name="FirstName"
                    value={filters.FirstName}
                    onChange={handleFilterChange}
                />
                <Input
                    placeholder="Filter by Last Name"
                    name="LastName"
                    value={filters.LastName}
                    onChange={handleFilterChange}
                />
                <Input
                    placeholder="Filter by Email"
                    name="Email"
                    value={filters.Email}
                    onChange={handleFilterChange}
                />
                <Input
                    placeholder="Filter by Phone"
                    name="Phone"
                    value={filters.Phone}
                    onChange={handleFilterChange}
                />
                <Input
                    placeholder="Filter by City"
                    name="City"
                    value={filters.City}
                    onChange={handleFilterChange}
                />
            </Flex>

            {/* Table */}
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

            {/* Pagination */}
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
