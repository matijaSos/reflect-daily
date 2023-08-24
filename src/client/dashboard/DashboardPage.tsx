import {
  Heading,
  Box,
  Flex,
  Button,
  IconButton,
  useDisclosure,
  Highlight,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  useRadio,
  useRadioGroup,
  VStack,
  Textarea,
  Container,
  Text,
  UnorderedList,
  ListItem,
  UseRadioProps
} from '@chakra-ui/react'

import {
  ArrowForwardIcon,
  ArrowBackIcon,
  AddIcon,
  CheckCircleIcon
} from '@chakra-ui/icons';

import React, { useState } from 'react'

import createReflection from '@wasp/actions/createReflection'

import getReflections from "@wasp/queries/getReflections"
import { useQuery } from "@wasp/queries"

import ReflectionList from './ReflectionList'

const RadioCard = (props: { value: string; subtitle: string & UseRadioProps }) => {
  const { state, getInputProps, getRadioProps } = useRadio(props)

  const inputProps = getInputProps()
  const checkboxProps = getRadioProps()

  return (
    <Box as='label' w={'full'}>
      <input {...inputProps} />
      <Flex
        justify='space-between'
        align='center'
        {...checkboxProps}
        //w='325px'
        cursor='pointer'
        borderWidth='1px'
        borderRadius='md'
        boxShadow='md'
        _checked={{
          bg: 'primary.600',
          color: 'white',
          borderColor: 'primary.600',
        }}
        _focus={{
          //boxShadow: 'outline',
        }}
        px={5}
        py={2}
      >
        <Box>
          <Text fontSize='md' fontWeight='medium'>{props.value}</Text>
          <Text
            color={state.isChecked ? 'white' : 'gray.700'}
            fontSize='sm'
            fontWeight={'normal'}
          >
            {props.subtitle}
          </Text>
        </Box>
        {state.isChecked && <CheckCircleIcon />}
      </Flex>
    </Box>
  )
}

const DayRatingRadioGroup = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => {

  const options = [
    { value: '-2', subtitle: 'Everything went poorly.' },
    { value: '-1', subtitle: 'I did a thing or two right.' },
    { value: '1', subtitle: 'A good day, almost perfect.' },
    { value: '2', subtitle: 'I cherished every second.' },
  ]

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'dailyRating',
    defaultValue: value,
    onChange: onChange,
  })

  const group = getRootProps()

  return (
    <VStack {...group}>
      {options.map((option) => {
        const radio = getRadioProps({ value: option.value })
        return (
          <RadioCard
            value={option.value}
            subtitle={option.subtitle}
            {...radio}
          />
        )
      })}
    </VStack>
  )
}

interface onChangeFn {
  (value: string): void;
}

const DayRatingStep = ({ value, onChange }: { value: string; onChange: onChangeFn }) => (
  <Flex direction='column'>
    <Heading size='md' mb={2}>Rate your day from -2 to 2:</Heading>
    <Box alignSelf='center' mt={5} w={'full'}>
      <DayRatingRadioGroup onChange={onChange} value={value} />
    </Box>
  </Flex>
)

const DailyWinStep = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
  <Box>
    <Heading size='md' mb={2}>🏆 What was the win of the day?</Heading>
    <Text
      fontWeight={'normal'}
      color={'gray.600'}
    >
      <Highlight query={'Momentum'} styles={{ fontWeight: 'medium', color: 'gray.600' }}>
        Pause, reflect and celebrate progress. The result? Momentum.
      </Highlight>
    </Text>
    <Textarea
      mt={5}
      height={'125px'}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder='Recall what went well!'
    />
  </Box>
)

const WhatBetterStep = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
  <Box>
    <Heading size='md' mb={2}>🌩️ What could have gone better?</Heading>
    <Text
      fontWeight={'normal'}
      color={'gray.600'}
    >
      Find one moment and "do it over" in your mind:
    </Text>
    <UnorderedList
      mt={2}
      fontWeight={'normal'}
      color={'gray.600'}
    >
      <ListItem>What I did?</ListItem>
      <ListItem>What I should have done?</ListItem>
      <ListItem>How I'll remember to do it in the future?</ListItem>
    </UnorderedList>
    <Textarea
      mt={5}
      height={'125px'}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder='Recall one moment and "do it over" in your mind.'
    />
  </Box>
)

const SubmitReflectionStep = ({ isBeingSubmitted }: { isBeingSubmitted: boolean }) => (
  <Flex h={'full'} direction={'column'} justify={'center'} align={'center'}>
    <Heading size='md' mb={2}>🎉 Well done! 🎉</Heading>
    <Button
      isLoading={isBeingSubmitted}
      mt={5}
      variant={'brand'}
      type="submit"
    >
      Submit your reflection
    </Button>
  </Flex>
)

const MainPage = ({ user }: { user: any }) => {
  const { data: reflections, isLoading, error } = useQuery(getReflections)

  const { isOpen, onOpen, onClose } = useDisclosure()

  const [dayRating, setDayRating] = useState('1')
  const [biggestWin, setBiggestWin] = useState('')
  const [badMoment, setBadMoment] = useState('')

  const [isReflectionBeingSubmitted, setIsReflectionBeingSubmitted] = useState(false)

  // TODO(matija): rename to activeStepIdx (and everything else accordingly).
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0)

  const resetForm = () => {
    setDayRating('1')
    setBiggestWin('')
    setBadMoment('')
    setActiveQuestionIdx(0)
  }

  const Steps = [
    <DayRatingStep value={dayRating} onChange={setDayRating} />,
    <DailyWinStep value={biggestWin} onChange={setBiggestWin} />,
    <WhatBetterStep value={badMoment} onChange={setBadMoment} />,
    <SubmitReflectionStep isBeingSubmitted={isReflectionBeingSubmitted} />
  ] as const

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsReflectionBeingSubmitted(true)

    try {
      await createReflection({ dayRating, biggestWin, badMoment })
      onClose()
    } catch (err: any) {
      window.alert("Error: " + err.message)
    } finally {
      resetForm()
      setIsReflectionBeingSubmitted(false)
    }
  }

  const goBack = () => {
    setActiveQuestionIdx(Math.max(0, activeQuestionIdx - 1))
  }

  const goForward = () => {
    setActiveQuestionIdx(Math.min(Steps.length - 1, activeQuestionIdx + 1))
  }

  return (
    <Box px={10} py={5}>

      {/* New Reflection button + CTA */}
      <Flex flexDir='column' align='center' gap={5} my={10}>
        <Text fontWeight={'semibold'}>Have you already reflected today?</Text>
        <Button
          onClick={onOpen}
          leftIcon={<AddIcon />}
          variant='brandInverted'
        >
          New Reflection
        </Button>
      </Flex>

      {/* Reflection survey form */}
      {/* TODO(matija): How do I extract this part without it being re-rendered on every radio button click? */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <Flex direction='column' height='450px' justify='space-between' py={5} px={{ lg: 4 }}>

                {Steps[activeQuestionIdx]}

                {/* Back/Forward navbar */}
                <Flex justify='space-between' mt={10}>
                  <IconButton
                    isDisabled={activeQuestionIdx === 0}
                    onClick={goBack}
                    isRound={true}
                    aria-label='Back'
                    colorScheme='primary'
                    icon={<ArrowBackIcon />}
                  />
                  <IconButton
                    isDisabled={activeQuestionIdx === Steps.length - 1}
                    onClick={goForward}
                    isRound={true}
                    aria-label='Next'
                    colorScheme='primary'
                    icon={<ArrowForwardIcon />}
                  />
                </Flex>
              </Flex>

            </form>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Reflection list */}
      <Container
        bg='white'
        maxW={'container.lg'}
        rounded={'lg'}
        borderWidth={1}
        borderColor={'primary.200'}
        px={4}
        py={4}
      >
        <Heading size='lg' mb={2}>Your Reflections</Heading>
        {reflections && <ReflectionList reflections={reflections} />}
      </Container>

    </Box>
  )
}
export default MainPage
