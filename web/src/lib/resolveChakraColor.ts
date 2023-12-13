import { useTheme } from '@chakra-ui/react'

export function resolveChakraColor(colorName) {
  const theme = useTheme()
  const [category, value] = colorName.split('.')
  return theme.colors[category][value]
}
