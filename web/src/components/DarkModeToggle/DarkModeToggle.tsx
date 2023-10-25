import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { Button, Flex, Stack, useColorMode } from '@chakra-ui/react'

const DarkModeToggle = (props) => {
  const { colorMode, toggleColorMode } = useColorMode()
  return (
    <Flex alignItems={'center'} {...props}>
      <Stack direction={'row'} spacing={7}>
        <Button onClick={toggleColorMode}>
          {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
        </Button>
      </Stack>
    </Flex>
  )
}

export default DarkModeToggle
