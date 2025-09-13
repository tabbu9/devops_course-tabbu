import React, { useState } from 'react';
import {
  Box, Input, Button, Heading, VStack, Text, useToast
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const AuthPage = ({ setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const toast = useToast();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const url = isLogin ? '/api/auth/login' : '/api/auth/register';
    const body = isLogin
      ? { email: form.email, password: form.password }
      : { ...form };
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (res.ok) {
      if (isLogin) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
      } else {
        toast({ title: "Account created! Please login.", status: "success" });
        setIsLogin(true);
      }
    } else {
      toast({ title: data.msg || "Error", status: "error" });
    }
  };

  return (
    <MotionBox
      maxW="sm"
      mx="auto"
      mt={20}
      p={8}
      borderRadius="lg"
      boxShadow="2xl"
      bg="white"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <Heading mb={6} color="teal.600" textAlign="center">
        DevOps Spaces
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          {!isLogin &&
            <Input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
            />}
          <Input
            name="email"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <Input
            name="password"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <Button
            type="submit"
            colorScheme="teal"
            width="100%"
            size="lg"
            _hover={{ transform: "scale(1.05)", boxShadow: "lg" }}
            as={motion.button}
            whileTap={{ scale: 0.92 }}
          >
            {isLogin ? "Sign In" : "Create Account"}
          </Button>
        </VStack>
      </form>
      <Text mt={4} textAlign="center">
        {isLogin ? "Don't have an account?" : "Already have an account?"}
        <Button
          variant="link"
          color="teal.600"
          onClick={() => setIsLogin(!isLogin)}
          ml={2}
        >
          {isLogin ? "Register" : "Sign In"}
        </Button>
      </Text>
    </MotionBox>
  );
};

export default AuthPage;