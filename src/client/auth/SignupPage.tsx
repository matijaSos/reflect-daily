import { Center, Box, Link } from '@chakra-ui/react'
import { SignupForm } from '@wasp/auth/forms/Signup'
import { Link as RRLink } from "react-router-dom"

import authAppearance from './authAppearance'

const SignupPage = () => {
    return (
      <Center>
        <Box>
          <SignupForm appearance={authAppearance} />
          <Box mt={3}>
            Already own an account? Go&nbsp;
              <Link textDecoration="underline" as={RRLink} to='/login'>log in</Link>
          </Box>
        </Box>
      </Center>
    )
}

export default SignupPage