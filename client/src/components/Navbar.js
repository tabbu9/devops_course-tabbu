import React from 'react';
import { Box, Flex, Button, Heading, Spacer } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();
  return (
    <Flex bg="teal.500" p={3} color="white" align="center" boxShadow="md">
      <Heading size="md" letterSpacing="wider" cursor="pointer" onClick={() => navigate('/')}>
        DevOps Spaces
      </Heading>
      <Spacer />
      {user ? (
        <>
          <Button
            leftIcon={<FaUserCircle />}
            colorScheme="whiteAlpha"
            variant="ghost"
            onClick={() => navigate('/profile')}
            _hover={{ bg: "teal.700", transform: "scale(1.05)" }}
            transition="all 0.2s"
          >
            Profile
          </Button>
          <Button
            colorScheme="red"
            ml={3}
            onClick={() => {
              localStorage.removeItem('token');
              setUser(null);
              navigate('/');
            }}
            _hover={{ bg: "red.600", transform: "scale(1.08)" }}
            transition="all 0.2s"
          >
            Logout
          </Button>
        </>
      ) : (
        <Button as={Link} to="/" variant="outline" colorScheme="whiteAlpha">
          Login
        </Button>
      )}
    </Flex>
  );
};

export default Navbar;