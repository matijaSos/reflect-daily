import {
  Button,
  HStack,
  Box,
  useColorModeValue,
  useDisclosure,
  Flex,
  Menu,
  MenuList,
  MenuItem,
  MenuButton,
  Image,
  Container
} from '@chakra-ui/react'

import {
  UnlockIcon
} from '@chakra-ui/icons'

import { Link } from 'react-router-dom'

import useAuth from '@wasp/auth/useAuth'
import logout from '@wasp/auth/logout'

import LogoUrl from '../images/logo.png'

const Navbar = () => {
  const { data: user } = useAuth()
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box
      bg={useColorModeValue('primary.600', 'gray.900')}
    >
      <Container maxW={'container.lg'}>
        <Flex
          h={16}
          alignItems={'center'}
          justifyContent={'space-between'}
        >
          {/* Hamburger icon - on mobile only */}
          {/*
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
        */}

          {/* Logo + links */}
          <HStack spacing={8} alignItems={'center'} color='white'>
            <Link to='/'>
              <HStack>
                <Image boxSize='30px' src={LogoUrl} />
                <Box fontWeight={'bold'}>
                  Reflect Daily
                </Box>
              </HStack>
            </Link>
            {/* Additional lhs links would go here */}
          </HStack>

          {/* User menu */}
          <Flex>
            {user ? (
              <NavbarMenu username={user.username} />
            ) : (
              <Link to='login'>
                <Button
                  as='a'
                  variant='brand'
                  leftIcon={<UnlockIcon />}
                >
                  Login
                </Button>
              </Link>
            )}
          </Flex>

        </Flex>
      </Container>
    </Box >
  )
}

const NavbarMenu = ({ username }: { username: string }) => {

  return (
    <Menu>
      <MenuButton
        as={Button}
        rounded={'full'}
        variant={'link'}
        cursor={'pointer'}
        minW={0}
        color='white'
        fontWeight={'normal'}
      >
        {username}
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => logout()}>Log out</MenuItem>
      </MenuList>
    </Menu>

  )
}

export default Navbar