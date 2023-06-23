import {
  TableContainer,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Text,
  Table
} from '@chakra-ui/react'
import { format } from "timeago.js"

import { Reflection } from "@wasp/entities"

const ReflectionList = ({ reflections }: { reflections: Reflection[] }) => {
  if (!reflections?.length) return <div>No reflections yet!</div>

  return (
    <TableContainer>
      <Table variant='simple'>
        <Thead>
          <Tr>
            <Th>Rating</Th>
            <Th>Created at</Th>
            <Th>🏆 Biggest Win</Th>
            <Th>🌩️ Bad Moment</Th>
          </Tr>
        </Thead>
        <Tbody>
          {reflections.map((reflection, idx) => (
            <Tr key={idx}>
              <Td>{reflection.dayRating}</Td>
              <Td>{format(reflection.createdAt)}</Td>
              <Td title={reflection.biggestWin}>
                <Text isTruncated maxW={'300px'}>
                  {reflection.biggestWin}
                </Text>
              </Td>
              <Td title={reflection.badMoment}>
                <Text isTruncated maxW={'300px'}>
                  {reflection.badMoment}
                </Text>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )
}

export default ReflectionList