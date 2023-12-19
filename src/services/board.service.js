import axios from 'axios'
import { useMutation, useQuery } from 'react-query'

const boardService = {
  getBoards: async () => axios.get('http://localhost:3000/boards'),
  createBoard: async (data) => axios.post('http://localhost:3000/boards', data),
  joinBoard: async (data) =>
    axios.post(`http://localhost:3000/boards/${data.id}/join`, data.name),
  getBoardDrawings: async (id) =>
    axios.get(`http://localhost:3000/boards/${id}/drawings`)
}

export const useGetBoards = (querySettings) => {
  return useQuery('boards', boardService.getBoards, {
    ...querySettings
  })
}

export const useGetBoardDrawings = ({ id }) => {
  return useQuery(
    `board-${id}-drawings`,
    () => boardService.getBoardDrawings(id),
    {
      cacheTime: 0,
      enabled: !!id
    }
  )
}

export const useCreateBoard = (mutationSettings) => {
  return useMutation(boardService.createBoard, mutationSettings)
}

export const useJoinBoard = (mutationSettings) => {
  return useMutation(boardService.joinBoard, mutationSettings)
}
