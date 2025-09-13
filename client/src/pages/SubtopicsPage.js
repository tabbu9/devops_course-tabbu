import React, { useEffect, useState } from 'react';
import { Box, Heading, Text, Spinner, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

const SubtopicsPage = () => {
  const { topicKey } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/courses/subtopics/${topicKey}`)
      .then(res => res.json())
      .then(data => { setCourse(data); setLoading(false); });
  }, [topicKey]);

  if (loading) return <Spinner mt={20} size="xl" />;

  return (
    <Box maxW="3xl" mx="auto" mt={12} p={6} bg="white" borderRadius="lg" boxShadow="lg">
      <Heading mb={4}>{course.title}</Heading>
      <Text mb={8}>{course.description}</Text>
      <Accordion allowToggle>
        {course.subtopics.map((s, idx) => (
          <AccordionItem key={idx}>
            <AccordionButton>
              <Box flex="1" textAlign="left" fontWeight="bold">{s.title}</Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Text>{s.content}</Text>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Box>
  );
};

export default SubtopicsPage;