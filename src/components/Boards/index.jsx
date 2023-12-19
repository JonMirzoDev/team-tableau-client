import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useCreateBoard } from '../../services/board.service'
import { useQueryClient } from 'react-query'
import styles from './style.module.scss'
import Modal from '../Modal'

const Boards = ({ boards = [], isBoardsLoading = false }) => {
  ///tettt
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm()
  const { mutate: create, isLoading } = useCreateBoard()
  const queryClient = useQueryClient()

  const [isModalOpen, setModalOpen] = useState(false)
  const [selectedBoardId, setSelectedBoardId] = useState(null)

  const handleBoardClick = (boardId) => {
    setSelectedBoardId(boardId)
    setModalOpen(true)
  }

  const handleModalClose = () => {
    setModalOpen(false)
  }

  const handleModalConfirm = (nicknameData) => {
    setModalOpen(false)
  }

  const onSubmit = (data) => {
    const boardData = {
      name: data?.boardName
    }
    create(boardData, {
      onSuccess: (res) => {
        console.log('res: ', res)
        queryClient.invalidateQueries('boards')
        reset()
      },
      onError: (err) => {
        console.log('create err: ', err)
      }
    })
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <label htmlFor='board'>Board Name*</label>
        <input
          name='boardName'
          placeholder='Enter new board name'
          {...register('boardName', { required: true })}
          className={styles.inputField}
        />
        {errors.boardName && (
          <span className={styles.errorMsg}>This field is required</span>
        )}
        <input
          type='submit'
          value='Create Board'
          disabled={isLoading}
          className={styles.submitButton}
        />
      </form>
      <div>
        <h2 className={styles.title}>
          Join one of the boards below to make your drawing
        </h2>
        {boards && boards.length > 0 ? (
          <ul className={styles.boards}>
            {boards.map((board) => (
              <li
                key={board._id}
                className={styles.boardItem}
                onClick={() => handleBoardClick(board._id)}
              >
                <button className={styles.boardButton}>{board.name}</button>
              </li>
            ))}
          </ul>
        ) : isBoardsLoading ? (
          ''
        ) : (
          <p>No boards available. Create one!</p>
        )}
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        selectedBoardId={selectedBoardId}
      />
    </div>
  )
}

export default Boards
