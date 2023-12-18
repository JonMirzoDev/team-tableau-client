import axios from 'axios'
import { useMutation, useQuery } from 'react-query'

const boardService = {
  getBoards: async () => axios.get('http://localhost:3000/boards'),
  createBoard: async (data) => axios.post('http://localhost:3000/boards', data),
  joinBoard: async (data) =>
    axios.post(`http://localhost:3000/boards/${data.id}/join`, data.name)
}

export const useGetBoards = (querySettings) => {
  return useQuery('boards', boardService.getBoards, {
    cacheTime: 30,
    ...querySettings
  })
}

export const useCreateBoard = (mutationSettings) => {
  return useMutation(boardService.createBoard, mutationSettings)
}

export const useJoinBoard = (mutationSettings) => {
  return useMutation(boardService.joinBoard, mutationSettings)
}
