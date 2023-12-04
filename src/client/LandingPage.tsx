import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Box,
  Container,
  Button,
  Flex,
  Heading,
  Text,
  Highlight
} from '@chakra-ui/react'

import {
  ArrowForwardIcon
} from '@chakra-ui/icons'

import backgroundImgUrl from './images/background.svg'

const LandingPage = () => {

  return (
    <Box
      backgroundImage={backgroundImgUrl}
      backgroundPosition={{ base: 'center bottom', md: 'center bottom'}}
      backgroundRepeat={'no-repeat'}
      backgroundSize={'cover'}
    >
      <Container maxW='container.lg'>
        <Flex
          direction={'column'} justify={'center'} align={'center'} h='80vh'
        >
          <Heading
            as='h1'
            fontSize={{ base: '2.25rem', sm: '3rem', lg: '4rem' }}
            color={'primary.800'}
          >
            <Highlight query={'.'} styles={{ color: 'secondary.500' }}>
              Reflect Every Day.
            </Highlight>
          </Heading>
          <Heading
            mt={8}
            fontSize={{ base: 'xl', lg: '2xl' }}
            color={'gray.500'}
            textAlign={'center'}
          >
            <Highlight query={'momentum'} styles={{ color: 'gray.600', fontWeight: 'extrabold' }}>
              Create momentum and achieve your dreams.
            </Highlight>
          </Heading>

          <Box mt={8}>
            <Link to='dashboard'>
              <Button
                h='4rem'
                px='40px'
                fontSize='1.2rem'
                size='lg'
                variant='brandInverted'
                rightIcon={<ArrowForwardIcon />}
              >
                Start reflecting
              </Button>
            </Link>
          </Box>

        </Flex>
      </Container>
    </Box>
  )
}

export default LandingPage