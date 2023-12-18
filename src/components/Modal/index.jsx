// Modal.js
import React from 'react'
import { useForm } from 'react-hook-form'
import styles from './style.module.scss'
import { useJoinBoard } from '../../services/board.service'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const Modal = ({ isOpen, onClose, onConfirm, selectedBoardId }) => {
  const { mutate: join, isLoading } = useJoinBoard()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm()

  const onSubmit = (data) => {
    join(
      { id: selectedBoardId, name: data },
      {
        onSuccess: (res) => {
          toast.success('Successfully joined')
          navigate(`/boards/${selectedBoardId}`)
          reset()
          onConfirm()
        },
        onError: (err) => {
          console.log('joinErr: ', err)
        }
      }
    )
  }

  return isOpen ? (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.modalForm}>
          <label htmlFor='nickname'>Nickname*</label>
          <input
            name='nickname'
            placeholder='Enter your nickname'
            {...register('nickname', { required: true })}
            className={styles.inputField}
          />
          {errors.nickname && (
            <span className={styles.errorMsg}>This field is required</span>
          )}
          <input
            type='submit'
            value='Join Board'
            className={styles.submitButton}
            disabled={isLoading}
          />
        </form>
      </div>
    </div>
  ) : null
}

export default Modal
