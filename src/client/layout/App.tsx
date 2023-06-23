import {
  ChakraProvider,
  extendTheme,
  Box} from '@chakra-ui/react'
import { ReactNode } from 'react'
import '@fontsource-variable/inter'


import theme from '../theme'
import Navbar from './Navbar'

export default function App({ children }: { children: ReactNode }) {

  return (
    <ChakraProvider theme={theme}>
      <Box h='100vh' bg='bgBody'>
        <Navbar />
        {children}
      </Box>
    </ChakraProvider>
  )
}