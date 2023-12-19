import axios from 'axios'
import { useMutation, useQuery } from 'react-query'

const baseURL = process.env.REACT_APP_BASE_URL

const boardService = {
  getBoards: async () => axios.get(`${baseURL}/boards`),
  createBoard: async (data) => axios.post(`${baseURL}/boards`, data),
  joinBoard: async (data) =>
    axios.post(`${baseURL}/boards/${data.id}/join`, data.name),
  getBoardDrawings: async (id) => axios.get(`${baseURL}/boards/${id}/drawings`)
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
