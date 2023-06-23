import {
  extendTheme
} from '@chakra-ui/react'

const theme = extendTheme({
  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`,
  },
  colors: {
    primary: {
      50: '#e2e8ff', // very light purple
      100: '#c8d3ff', // light purple
      200: '#a5bbff', // lighter purple
      300: '#798ee6', // light-mid purple
      400: '#6472cd', // mid purple
      500: '#5361b3', // dark-mid purple
      600: '#5969b8', // base color
      700: '#424f90', // darker purple
      800: '#2d3866', // dark purple
      900: '#1a1f3d', // very dark purple
    },
    secondary: {
      50: '#ffebd6', // very light orange
      100: '#ffd9b3', // light orange
      200: '#ffc791', // light moderate orange
      300: '#ffb66e', // moderate orange
      400: '#ffa569', // saturated orange
      500: '#ff9462', // strong orange
      600: '#ff825c', // deep orange
      700: '#ff6a50', // very deep orange
      800: '#ff5144', // extremely deep orange
      900: '#ff3838' // maximum depth orange
    }
  },
  semanticTokens: {
    colors: {
      bgBody: {
        default: '#fff8f3'
      }
    }
  },
  components: {
    Button: {
      variants: {
        brand: {
          bg: 'primary.600',
          color: 'white',
          _hover: {
            bg: 'secondary.600',
          },
          _disabled: {
            pointerEvents: 'none'
          }
        },
        brandInverted: {
          bg: 'secondary.500',
          color: 'white',
          _hover: {
            bg: 'primary.600'
          },
          _disabled: {
            pointerEvents: 'none'
          }
        }
      }
    }
  }
})

export default theme