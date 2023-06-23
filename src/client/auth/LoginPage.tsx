import { Center, Box, Link } from '@chakra-ui/react'
import { LoginForm } from '@wasp/auth/forms/Login'
import { Link as RRLink } from "react-router-dom"

import authAppearance from './authAppearance'

const LoginPage = () => {
    return (
      <Center>
        <Box>
          <LoginForm appearance={authAppearance} />
          <Box mt={3}>
            No account yet? Go&nbsp;
              <Link textDecoration="underline" as={RRLink} to='/signup'>
                sign up
              </Link>
          </Box>
        </Box>
      </Center>
    )
}

export default LoginPage