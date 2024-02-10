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
import { useForm, useController, Control, SubmitHandler } from 'react-hook-form'

import createReflection from '@wasp/actions/createReflection'

import getReflections from "@wasp/queries/getReflections"
import { useQuery } from "@wasp/queries"

import ReflectionList from './ReflectionList'

type RadioCardProps = { value: string; subtitle: string & UseRadioProps }

const RadioCard = (props: RadioCardProps,) => {
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

const DayRatingRadioGroup = ({ control }: { control: Control<ReflectionSurveyValues> }) => {
  const { field } = useController({
    name: 'dayRating',
    control,
    defaultValue: '1'
  })

  const { getRootProps, getRadioProps } = useRadioGroup({ ...field })
  const group = getRootProps()

  const options = [
    { value: '-2', subtitle: 'Everything went poorly.' },
    { value: '-1', subtitle: 'I did a thing or two right.' },
    { value: '1', subtitle: 'A good day, almost perfect.' },
    { value: '2', subtitle: 'I cherished every second.' },
  ]

  return (
    <VStack {...group}>
      {options.map((option, idx) => {
        const radio = getRadioProps({ value: option.value })
        return (
          <RadioCard
            key={idx}
            value={option.value}
            subtitle={option.subtitle}
            {...radio}
          />
        )
      })}
    </VStack>
  )
}

interface ReflectionSurveyValues {
  dayRating: string,
  dailyWin: string,
  whatBetter: string
}

const DayRatingStep = ({ control }: { control: Control<ReflectionSurveyValues> }) => (
  <Flex direction='column'>
    <Heading size='md' mb={2}>Rate your day from -2 to 2:</Heading>
    <Box alignSelf='center' mt={5} w={'full'}>
      <DayRatingRadioGroup control={control} />
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
      {...register('dailyWin', { required: true, minLength: 5 })}
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
      {...register('whatBetter', { required: true, minLength: { value: 5, message: 'cmon, write something!' } })}
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
    reset,
    trigger,
    formState: { errors, isValid }
  } = useForm<ReflectionSurveyValues>()

  const onFormValidated: SubmitHandler<ReflectionSurveyValues> = async ({ dayRating, dailyWin, whatBetter }) => {
    setIsReflectionBeingSubmitted(true)

    try {
      // TODO(matija): standardize these names
      await createReflection({ dayRating, biggestWin: dailyWin, badMoment: whatBetter })
      onClose()
    } catch (err: any) {
      window.alert("Error: " + err.message)
    } finally {
      // TODO(matija): RHF docs recommended to call reset() within useEffect in some cases, e.g. controlled components, not sure
      // if that applies here?
      reset()
      setActiveQuestionIdx(0)

      setIsReflectionBeingSubmitted(false)
    }
  }

  const { data: reflections, isLoading, error } = useQuery(getReflections)

  const { isOpen, onOpen, onClose } = useDisclosure()

  const [isReflectionBeingSubmitted, setIsReflectionBeingSubmitted] = useState(false)

  // TODO(matija): rename to activeStepIdx (and everything else accordingly).
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0)


  // TODO(matija): un-hardcode these validatio ids, so I don't
  // have duplication in the code.
  const Steps = [{
    component: <DayRatingStep control={control} />,
    validationId: 'dayRating'
  }, {
    component: <DailyWinStep register={register} />,
    validationId: 'dailyWin'
  }, {
    component: <WhatBetterStep register={register} />,
    validationId: 'whatBetter'
  }, {
    component: <SubmitReflectionStep isBeingSubmitted={isReflectionBeingSubmitted} />
  }]

  const goBack = () => {
    setActiveQuestionIdx(Math.max(0, activeQuestionIdx - 1))
  }

  const goForward = async () => {
    let isStepValid = true

    if (Steps[activeQuestionIdx].validationId) {
      isStepValid = await trigger(Steps[activeQuestionIdx].validationId as keyof ReflectionSurveyValues)
    }

    if (isStepValid) {
      setActiveQuestionIdx(Math.min(Steps.length - 1, activeQuestionIdx + 1))
    }
  }

  console.log('printing errors')
  console.log(errors)

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
            <form onSubmit={handleSubmitRHF(onFormValidated)}>
              <Flex direction='column' height='450px' justify='space-between' py={5} px={{ lg: 4 }}>

                {/* {Steps[activeQuestionIdx]} */}

                {/* TODO: abstract this nicely. */}
                <Box display={activeQuestionIdx === 0 ? 'block' : 'none'}>
                  <DayRatingStep control={control} />
                </Box>
                <Box display={activeQuestionIdx === 1 ? 'block' : 'none'}>
                  <DailyWinStep register={register} />
                </Box>
                <Box display={activeQuestionIdx === 2 ? 'block' : 'none'}>
                  <WhatBetterStep register={register} />
                </Box>
                <Box h='full' display={activeQuestionIdx === 3 ? 'block' : 'none'}>
                  <SubmitReflectionStep isBeingSubmitted={isReflectionBeingSubmitted} />
                </Box>

                {errors.dailyWin && <span>There was an error!: {errors.dailyWin.message}</span>}

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
