import {ChakraProvider} from '@chakra-ui/react'
import Layout from '../utils/layout'

function MyApp({Component, pageProps}) {
  return (
    <ChakraProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ChakraProvider>
  )
}

export default MyApp
