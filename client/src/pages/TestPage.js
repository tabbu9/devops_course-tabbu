import React, { useState } from 'react';
import {
  Box, Heading, Text, Button, VStack, useToast
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const questions = {
  docker: [
    { q: "What is Docker?", a: "A container platform" },
    { q: "Which command runs a container?", a: "docker run" }
  ],
  kubernetes: [
    { q: "What is a pod?", a: "Smallest deployable unit" },
    { q: "kubectl applies to?", a: "Kubernetes clusters" }
  ],
  aws: [
    { q: "What does EC2 provide?", a: "Virtual servers" },
    { q: "What is S3?", a: "Object storage" }
  ],
  sonarqube: [
    { q: "What is SonarQube used for?", a: "Code quality analysis" },
    { q: "What is a Quality Gate?", a: "Code quality checkpoint" }
  ],
  jenkins: [
    { q: "Jenkins is mainly used for?", a: "CI/CD Automation" },
    { q: "What is a Jenkins Pipeline?", a: "CI/CD workflow" }
  ]
};

const MotionButton = motion(Button);

const TestPage = ({ user }) => {
  const { topicKey } = useParams();
  const [ans, setAns] = useState(Array((questions[topicKey] || []).length).fill(''));
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = () => {
    let score = 0;
    (questions[topicKey] || []).forEach((q, i) => {
      if (ans[i].toLowerCase().trim().includes(q.a.toLowerCase().split(' ')[0])) score++;
    });
    setSubmitted(true);
    toast({ title: `Test submitted! Your Score: ${score}/${questions[topicKey]?.length}`, status: "info" });
    setTimeout(() => navigate('/profile'), 1800);
  };

  return (
    <Box maxW="2xl" mx="auto" mt={16} p={6} bg="white" borderRadius="lg" boxShadow="xl">
      <Heading mb={6} color="teal.600">Test for {topicKey.toUpperCase()}</Heading>
      <VStack spacing={6} align="stretch">
        {(questions[topicKey] || []).map((q, idx) => (
          <Box key={idx}>
            <Text fontWeight="semibold">{q.q}</Text>
            <input
              type="text"
              value={ans[idx]}
              onChange={e => {
                const arr = [...ans];
                arr[idx] = e.target.value;
                setAns(arr);
              }}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #319795',
                borderRadius: '6px',
                marginTop: '8px'
              }}
              disabled={submitted}
            />
          </Box>
        ))}
      </VStack>
      <MotionButton
        colorScheme="teal"
        size="lg"
        mt={8}
        width="100%"
        onClick={handleSubmit}
        isDisabled={submitted}
        whileTap={{ scale: 0.93 }}
        _hover={{ bg: "teal.700", transform: "scale(1.04)" }}
        transition="all 0.2s"
      >
        {submitted ? "Submitted" : "Submit Test"}
      </MotionButton>
    </Box>
  );
};

export default TestPage;