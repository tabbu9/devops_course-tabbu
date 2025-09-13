import React, { useEffect, useState } from 'react';
import {
  Box, Heading, Text, List, ListItem, Button, Input, Flex, useToast
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionButton = motion(Button);

const ProfilePage = ({ user }) => {
  const [completions, setCompletions] = useState([]);
  const [pdfs, setPdfs] = useState([]);
  const [pdf, setPdf] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/user/profile', {
      headers: { Authorization: 'Bearer ' + token }
    })
      .then(res => res.json())
      .then(data => setCompletions(data.completions || []));
    fetch('/api/user/pdfs', {
      headers: { Authorization: 'Bearer ' + token }
    })
      .then(res => res.json())
      .then(setPdfs);
  }, []);

  const handlePdfUpload = async e => {
    const file = e.target.files[0];
    setPdf(file);
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('pdf', file);
    const res = await fetch('/api/upload-pdf', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    await fetch('/api/user/add-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
      body: JSON.stringify({ path: data.filePath, name: file.name })
    });
    toast({ title: "PDF uploaded", status: "success" });
    setTimeout(() => window.location.reload(), 1000);
  };

  return (
    <Box maxW="3xl" mx="auto" mt={12} p={6} bg="white" borderRadius="lg" boxShadow="lg">
      <Heading mb={4} color="teal.600">Profile: {user.name}</Heading>
      <Text fontWeight="bold">Completed Courses:</Text>
      <List mb={6} spacing={2}>
        {completions.length === 0 && <Text fontStyle="italic">No courses completed yet.</Text>}
        {completions.map(c => (
          <ListItem key={c.id}>{c.topic.toUpperCase()}</ListItem>
        ))}
      </List>
      <Flex align="center" mb={4}>
        <Input type="file" accept="application/pdf" onChange={handlePdfUpload} mr={4} />
        <MotionButton
          as="label"
          htmlFor="pdf-upload"
          colorScheme="teal"
          whileTap={{ scale: 0.94 }}
          _hover={{ bg: "teal.700", transform: "scale(1.06)" }}
          transition="all 0.2s"
        >
          Upload PDF
        </MotionButton>
      </Flex>
      <Text fontWeight="bold">Your PDFs:</Text>
      <List>
        {pdfs.length === 0 && <Text fontStyle="italic">No PDFs uploaded yet.</Text>}
        {pdfs.map(p => (
          <ListItem key={p.id}>
            <a href={p.path} target="_blank" rel="noopener noreferrer">{p.name}</a>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ProfilePage;