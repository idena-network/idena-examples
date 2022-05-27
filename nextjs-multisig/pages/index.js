import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
} from '@chakra-ui/react'
import {useRouter} from 'next/router'
import {useState} from 'react'
import {useMultisig} from '../utils/multisig'

function OutputResponse({action, result, ts}) {
  return (
    <Stack spacing={0} p={2}>
      <Box>----{new Date(ts).toLocaleString()}----</Box>
      <Box>Action: {action}</Box>
      <Box>Result: {JSON.stringify(result)}</Box>
    </Stack>
  )
}

function Action({title, children, ...props}) {
  const [open, setOpen] = useState(false)
  return (
    <Flex direction="column" {...props}>
      <Heading
        fontSize="md"
        onClick={() => setOpen((prev) => !prev)}
        cursor="pointer"
      >
        {title}
      </Heading>
      {open && <Box mt={1}>{children}</Box>}
      <Divider my={4} />
    </Flex>
  )
}

export default function Home() {
  const [data, setData] = useState([])
  const router = useRouter()

  const hash = router.query.tx

  const addData = (action, result) =>
    setData((prevData) => [
      {action, result, ts: new Date().getTime()},
      ...prevData,
    ])

  const [
    {readOwner, readVoteAddrs, readVoteAmounts, getTx},
    {add, send, push, deploy},
  ] = useMultisig()
  return (
    <Flex p={4}>
      <Stack w="50%">
        <Action title="Deploy new multisig">
          <form
            onSubmit={async (ev) => {
              ev.preventDefault()
              const formData = new FormData(ev.target)

              const min = formData.get('min')
              const max = formData.get('max')
              const amount = formData.get('amount')

              try {
                const result = await deploy(min, max, amount)

                addData('deploy', result)
              } catch (e) {
                addData('deploy', e.message)
              }
            }}
          >
            <Stack>
              <FormControl>
                <FormLabel>Min count</FormLabel>
                <Input name="min" />
              </FormControl>
              <FormControl>
                <FormLabel>Max count</FormLabel>
                <Input name="max" />
              </FormControl>
              <FormControl>
                <FormLabel>Stake</FormLabel>
                <Input name="amount" />
              </FormControl>
              <Button type="submit">Deploy</Button>
            </Stack>
          </form>
        </Action>
        <Action title="Add new address">
          <form
            onSubmit={async (ev) => {
              ev.preventDefault()
              const formData = new FormData(ev.target)

              const contract = formData.get('contract')
              const address = formData.get('address')

              try {
                const result = await add(contract, address)

                addData('add', result)
              } catch (e) {
                addData('add', e.message)
              }
            }}
          >
            <Stack>
              <FormControl>
                <FormLabel>Contract hash</FormLabel>
                <Input name="contract" />
              </FormControl>
              <FormControl>
                <FormLabel>Address</FormLabel>
                <Input name="address" />
              </FormControl>
              <Button type="submit">Add</Button>
            </Stack>
          </form>
        </Action>
        <Action title="Send money">
          <form
            onSubmit={async (ev) => {
              ev.preventDefault()
              const formData = new FormData(ev.target)

              const contract = formData.get('contract')
              const address = formData.get('address')
              const amount = formData.get('amount')

              try {
                const result = await send(contract, address, amount)

                addData('send', result)
              } catch (e) {
                addData('send', e.message)
              }
            }}
          >
            <Stack>
              <FormControl>
                <FormLabel>Contract hash</FormLabel>
                <Input name="contract" />
              </FormControl>
              <FormControl>
                <FormLabel>Address</FormLabel>
                <Input name="address" />
              </FormControl>
              <FormControl>
                <FormLabel>Amount</FormLabel>
                <Input name="amount" />
              </FormControl>
              <Button type="submit">Send</Button>
            </Stack>
          </form>
        </Action>
        <Action title="Push money">
          <form
            onSubmit={async (ev) => {
              ev.preventDefault()
              const formData = new FormData(ev.target)

              const contract = formData.get('contract')
              const address = formData.get('address')
              const amount = formData.get('amount')

              try {
                const result = await push(contract, address, amount)

                addData('push', result)
              } catch (e) {
                addData('push', e.message)
              }
            }}
          >
            <Stack>
              <FormControl>
                <FormLabel>Contract hash</FormLabel>
                <Input name="contract" />
              </FormControl>
              <FormControl>
                <FormLabel>Address</FormLabel>
                <Input name="address" />
              </FormControl>
              <FormControl>
                <FormLabel>Amount</FormLabel>
                <Input name="amount" />
              </FormControl>
              <Button type="submit">Push</Button>
            </Stack>
          </form>
        </Action>
        <Action title="Read owner">
          <form
            onSubmit={async (ev) => {
              ev.preventDefault()
              const formData = new FormData(ev.target)

              const contract = formData.get('contract')

              try {
                const result = await readOwner(contract)

                addData('readOwner', result)
              } catch (e) {
                addData('readOwner', e.message)
              }
            }}
          >
            <Stack>
              <Input name="contract" placeholder="Contract hash" />
              <Button type="submit">Read</Button>
            </Stack>
          </form>
        </Action>
        <Action title="Read address map">
          <form
            onSubmit={async (ev) => {
              ev.preventDefault()
              const formData = new FormData(ev.target)

              const contract = formData.get('contract')

              try {
                const result = await readVoteAddrs(contract)

                addData('readVoteAddrs', result)
              } catch (e) {
                addData('readVoteAddrs', e.message)
              }
            }}
          >
            <Stack>
              <Input name="contract" placeholder="Contract hash" />
              <Button type="submit">Read</Button>
            </Stack>
          </form>
        </Action>
        <Action title="Read amount map">
          <form
            onSubmit={async (ev) => {
              ev.preventDefault()
              const formData = new FormData(ev.target)

              const contract = formData.get('contract')

              try {
                const result = await readVoteAmounts(contract)

                addData('readVoteAmounts', result)
              } catch (e) {
                addData('readVoteAmounts', e.message)
              }
            }}
          >
            <Stack>
              <Input name="contract" placeholder="Contract hash" />
              <Button type="submit">Read</Button>
            </Stack>
          </form>
        </Action>
        <Action title="Get transaction receipt">
          <form
            onSubmit={async (ev) => {
              ev.preventDefault()
              const formData = new FormData(ev.target)

              // eslint-disable-next-line no-shadow
              const hash = formData.get('tx')

              try {
                const result = await getTx(hash)

                addData('getTx', result)
              } catch (e) {
                addData('getTx', e.message)
              }
            }}
          >
            <Stack>
              <Input name="tx" placeholder="Tx hash" />
              <Button type="submit">Get</Button>
            </Stack>
          </form>
        </Action>
      </Stack>
      <Box
        w="50%"
        h="500px"
        border="1px solid"
        overflow="auto"
        backgroundColor="#eee"
      >
        {data.map((item, idx) => (
          <OutputResponse key={idx} {...item} />
        ))}
        {hash && (
          <OutputResponse key="dna-link-hash" action="dna link" result={hash} />
        )}
      </Box>
    </Flex>
  )
}
