import { useEffect, useState } from 'react';
import {
  Box, Heading, SimpleGrid, Card, CardBody, Text, Button, HStack, Spinner
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { getTopics } from '../api/courses';
import { FiSettings } from 'react-icons/fi';

function titleize(slug) {
  return slug
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, c => c.toUpperCase());
}

export default function Dashboard() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const list = await getTopics(); // ["aws","docker",...]
        setTopics(list);
      } catch (e) {
        setError(e.message || 'Failed to load topics');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <Box py={16} textAlign="center">
        <Spinner size="lg" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box py={10} textAlign="center" color="red.500">
        {error}
      </Box>
    );
  }

  return (
    <Box px={{ base: 4, md: 8 }} py={10}>
      <Heading textAlign="center" mb={8}>
        Welcome Syed, Explore DevOps Courses!
      </Heading>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
        {topics.map((t) => (
          <Card key={t} shadow="lg" borderRadius="2xl" _hover={{ transform: 'translateY(-4px)' }} transition="all .2s">
            <CardBody>
              <HStack spacing={4} mb={3}>
                <FiSettings size={28} />
                <Heading size="md">{titleize(t)}</Heading>
              </HStack>
              <Text color="gray.600" mb={6}>
                Learn from basics to advanced with interactive subtopics.
              </Text>
              <Button
                as={Link}
                to={`/courses/${t}`}
                colorScheme="teal"
                size="sm"
              >
                Explore
              </Button>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  );
}
