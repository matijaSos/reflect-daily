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

import React, { useState, forwardRef } from 'react'
import { useForm, useController, Control } from 'react-hook-form'

import createReflection from '@wasp/actions/createReflection'

import getReflections from "@wasp/queries/getReflections"
import { useQuery } from "@wasp/queries"

import ReflectionList from './ReflectionList'

type RadioCardProps = { value: string; subtitle: string & UseRadioProps }

const RadioCard = forwardRef<HTMLInputElement, RadioCardProps>((props, ref) => {
  const { state, getInputProps, getRadioProps } = useRadio(props)

  const inputProps = getInputProps({ ref })
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

})

const RadioCardOld = (props: { value: string; subtitle: string & UseRadioProps }) => {
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

const DayRatingRadioGroup = ({ value, onChange, control }:
  {
    value: string;
    onChange: (v: string) => void;
    control: Control<ReflectionSurveyValues, any>
  }
) => {

  const { field } = useController({
    name: 'dayRating',
    control,
    defaultValue: '1'
  })

  const options = [
    { value: '-2', subtitle: 'Everything went poorly.' },
    { value: '-1', subtitle: 'I did a thing or two right.' },
    { value: '1', subtitle: 'A good day, almost perfect.' },
    { value: '2', subtitle: 'I cherished every second.' },
  ]

  const { getRootProps, getRadioProps } = useRadioGroup({
    ...field,
    // TODO(matija): get rid of this
    //defaultValue: value,
    //onChange: onChange,
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

// TODO(matija): I can delete this, I think?
interface onChangeFn {
  (value: string): void;
}

// TODO(matija): remove this, it was for testing only.
//const DayRatingStep = ({ value, onChange }: { value: string; onChange: onChangeFn }) => (
const DayRatingStepTest = forwardRef<HTMLInputElement, { name: string }>(
  ({ ...props }, ref) => (
    <>
      <span>hello {props.name}</span>
      <input ref={ref}></input>
    </>
  )
)

interface ReflectionSurveyValues {
  dayRating: string,
  dailyWin: string,
  whatBetter: string
}

const DayRatingStep = ({ value, onChange, control }) => (
  <Flex direction='column'>
    <Heading size='md' mb={2}>Rate your day from -2 to 2:</Heading>
    <Box alignSelf='center' mt={5} w={'full'}>
      <DayRatingRadioGroup control={control} onChange={onChange} value={value} />
    </Box>
  </Flex>
)

// TODO(matija): get rid of any in register
const DailyWinStep = ({ register }: { register: any }) => (
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
      {...register('dailyWin')}
      placeholder='Recall what went well!'
    />
  </Box>
)

const WhatBetterStep = ({ register }: { register: any }) => (
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
      {...register('whatBetter')}
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
  const {
    register,
    control,
    handleSubmit: handleSubmitRHF,
    formState: { errors }
  } = useForm<ReflectionSurveyValues>()

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
    <DayRatingStep control={control} value={dayRating} onChange={setDayRating} />,
    <DailyWinStep register={register} />,
    <WhatBetterStep register={register} />,
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
            <form onSubmit={handleSubmitRHF(data => console.log(data))}>
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
