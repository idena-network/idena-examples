import {Box, Divider, Input, Stack} from '@chakra-ui/react'
import {privateKeyToAddress} from 'idena-sdk-js'
import {useState, createContext, useContext} from 'react'

const DataContext = createContext()

export default function Layout({children, ...props}) {
  const [state, setState] = useState({
    url: '',
    apiKey: '',
    privateKey: '',
  })

  const address = privateKeyToAddress(state.privateKey)

  return (
    <DataContext.Provider value={state} {...props}>
      <Stack isInline spacing={4}>
        <Input
          placeholder="Node URL"
          value={state.url}
          onChange={(e) =>
            setState((prevState) => ({...prevState, url: e.target.value}))
          }
        />
        <Input
          placeholder="Node Api key"
          value={state.apiKey}
          onChange={(e) =>
            setState((prevState) => ({...prevState, apiKey: e.target.value}))
          }
        />
        <Input
          placeholder="Private key"
          value={state.privateKey}
          onChange={(e) =>
            setState((prevState) => ({
              ...prevState,
              privateKey: e.target.value,
            }))
          }
        />
      </Stack>
      <Divider />
      <Box p={4}>Your address : {address}</Box>

      <Divider />
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error('DataContext is missing')
  }
  return context
}
