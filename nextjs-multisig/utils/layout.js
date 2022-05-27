import {Divider, Input, Stack} from '@chakra-ui/react'
import {useState, useEffect, createContext, useContext} from 'react'

const DataContext = createContext()

export default function Layout({children, ...props}) {
  const [state, setState] = useState({
    url: process.env.NEXT_PUBLIC_NODE_URL,
    apiKey: process.env.NEXT_PUBLIC_NODE_KEY,
    sender: '',
  })

  useEffect(() => {
    const settings = localStorage.getItem('multisig-settings')
    if (settings) {
      setState(JSON.parse(settings))
    }
  }, [])

  const saveSettings = (settings) => {
    localStorage.setItem('multisig-settings', JSON.stringify(settings))
  }

  return (
    <DataContext.Provider value={state} {...props}>
      <Stack isInline spacing={4}>
        <Input
          placeholder="Node URL"
          value={state.url}
          onChange={(e) => {
            setState((prevState) => {
              const newState = {...prevState, url: e.target.value}
              saveSettings(newState)
              return newState
            })
          }}
        />
        <Input
          placeholder="Node Api key"
          value={state.apiKey}
          onChange={(e) => {
            setState((prevState) => {
              const newState = {...prevState, apiKey: e.target.value}
              saveSettings(newState)
              return newState
            })
          }}
        />
        <Input
          placeholder="Sender address"
          value={state.sender}
          onChange={(e) => {
            setState((prevState) => {
              const newState = {...prevState, sender: e.target.value}
              saveSettings(newState)
              return newState
            })
          }}
        />
      </Stack>
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
