import {
  Box,
  Heading,
  Text,
  Badge,
  Image,
  Stack,
  Spinner,
  HStack,
  SimpleGrid,
  Button,
} from '@chakra-ui/react';

import {
  Stat,
  StatLabel,
  StatNumber,
} from '@chakra-ui/stat'; // ✅ fixed path (Chakra v2 includes Stat here)

import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

type PokemonDetailProps = {
  pokemon: any;
};

export default function PokemonDetail({ pokemon }: PokemonDetailProps) {
  const router = useRouter();

  if (!pokemon) {
    return (
      <Box p={10} textAlign="center">
        <Spinner size="xl" />
      </Box>
    );
  }

  const types = pokemon.types.map((t: any) => t.type.name);
  const imageUrl =
    pokemon.sprites.other['official-artwork'].front_default ||
    pokemon.sprites.front_default;

  return (
    <Box px={8} py={12} maxW="800px" mx="auto" bg="gray.50" minH="100vh" borderRadius="lg">
      <Button onClick={() => router.back()} mb={4} variant="ghost"  color={"#000"}>
        ← Back
      </Button>

      <Stack gap={6} align="center" textAlign="center">
        <Image
          src={imageUrl}
          alt={pokemon.name}
          w="200px"
          h="200px"
          objectFit="contain"
          bg="white"
          borderRadius="full"
          boxShadow="lg"
        />

        <Heading textTransform="capitalize" fontSize="4xl" color="gray.800">
          {pokemon.name}
        </Heading>

        <HStack gap={3}>
          {types.map((type: string) => (
            <Badge key={type} colorScheme="teal" px={3} py={1} borderRadius="full" fontSize="sm">
              {type}
            </Badge>
          ))}
        </HStack>

        {/* Info grid with color-fixed stats */}
        <SimpleGrid columns={[1, 2]} gap={6} w="100%" mt={4}>
          <Stat>
            <StatLabel color="black">Height</StatLabel>
            <StatNumber color="gray">{pokemon.height / 10} m</StatNumber>
          </Stat>

          <Stat>
            <StatLabel color="black">Weight</StatLabel>
            <StatNumber color="gray">{pokemon.weight / 10} kg</StatNumber>
          </Stat>

          <Stat>
            <StatLabel color="black">Base Experience</StatLabel>
            <StatNumber color="gray">{pokemon.base_experience}</StatNumber>
          </Stat>

          <Stat>
            <StatLabel color="black">Abilities</StatLabel>
            <StatNumber fontSize="md" color="gray" textTransform={"capitalize"}>
              {pokemon.abilities.map((a: any) => a.ability.name).join(', ')}
            </StatNumber>
          </Stat>
        </SimpleGrid>

        <Box w="100%" mt={8}>
          <Heading fontSize="xl" mb={4} textAlign="left" color="gray.800">
            Stats
          </Heading>
          <SimpleGrid columns={[1, 2]} gap={4}>
            {pokemon.stats.map((stat: any) => (
              <Box
                key={stat.stat.name}
                bg="white"
                p={4}
                borderRadius="md"
                boxShadow="sm"
                textAlign="left"
              >
                <Text fontWeight="semibold" textTransform="capitalize" color="gray.700">
                  {stat.stat.name}
                </Text>
                <Text color="teal.500" fontSize="lg">
                  {stat.base_stat}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      </Stack>
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };

  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!res.ok) throw new Error('Not found');

    const pokemon = await res.json();

    return {
      props: {
        pokemon,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
