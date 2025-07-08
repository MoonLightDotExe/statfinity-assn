import {
  Box,
  SimpleGrid,
  Heading,
  Text,
  Button,
  Image,
  VStack,
  Input,
  Spinner,
} from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';

type Card = {
  name: string;
  url: string;
};

type HomeProps = {
  cards: Card[];
};

export default function Home({ cards }: HomeProps) {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState('');
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState('');

  const handleClick = (name: string) => {
    router.push(`/pokemon/${name}`);
  };

  const handleSearch = async () => {
    if (!searchInput.trim()) return;

    setLoading(true);
    setSearchResult(null);
    setErrorText('');

    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchInput.toLowerCase()}`);
      if (!res.ok) throw new Error('Not Found');
      const data = await res.json();
      setSearchResult(data);
    } catch {
      setErrorText(`Pokémon "${searchInput}" not found.`);
    } finally {
      setLoading(false);
    }
  };

  const renderCard = (name: string, imageUrl: string, id: string | number | undefined) => (
    <Box
      bg="white"
      borderRadius="2xl"
      boxShadow="md"
      transition="all 0.2s ease-in-out"
      _hover={{ transform: 'translateY(-5px)', boxShadow: 'xl' }}
      overflow="hidden"
    >
      <Image
        src={imageUrl}
        alt={name}
        objectFit="contain"
        w="100%"
        h="200px"
        bg="gray.100"
      />

      <VStack gap={2} align="stretch" p={6}>
        <Heading size="md" textTransform="capitalize" textAlign="center" color="#000">
          {name}
        </Heading>

        <Text fontSize="sm" color="gray.500" textAlign="center">
          #{id}
        </Text>

        <Button
          colorScheme="teal"
          variant="outline"
          mt={4}
          onClick={() => handleClick(name)}
        >
          Learn More
        </Button>
      </VStack>
    </Box>
  );

  return (
    <Box px={8} py={12} maxW="100%" mx="auto" bg="gray.50" minH="100vh" bgColor="#000">
      <Heading mb={6} textAlign="center" fontWeight="bold" fontSize={{ base: '2xl', md: '3xl' }}>
        Discover Pokémon
      </Heading>

      <Box maxW="400px" mx="auto" mb={6}>
        <VStack gap={3}>
          <Input
            placeholder="Search Pokémon by name or ID"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            bg="white"
            color="black"
          />
          <Button colorScheme="teal" onClick={handleSearch}>
            Search
          </Button>
          {loading && <Spinner size="md" color="teal.300" />}
          {errorText && <Text color="red.400">{errorText}</Text>}
        </VStack>
      </Box>

      {searchResult && (
        <Box mb={12} maxW="400px" mx="auto">
          {renderCard(
            searchResult.name,
            searchResult.sprites.other['official-artwork'].front_default,
            searchResult.id
          )}
        </Box>
      )}

      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={8}>
        {cards.map((card, index) => {
          const pokemonId = card.url.split('/').filter(Boolean).pop();
          const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
          return (
            <Box key={index}>
              {renderCard(card.name, imageUrl, pokemonId)}
            </Box>
          );
        })}
      </SimpleGrid>
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20');
  const data = await res.json();

  return {
    props: {
      cards: data.results,
    },
  };
};
