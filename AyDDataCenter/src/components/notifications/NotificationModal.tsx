import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Notification } from '../../context/AppContext'

interface Props {
  notification: Notification
  onClose: () => void
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
}

const NotificationModal: React.FC<Props> = ({ notification, onClose }) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  // Cerrar el modal al presionar la tecla Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  // Prevenir el scroll del fondo cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    // Enfocar el botón de cerrar cuando el modal se abre
    closeButtonRef.current?.focus()
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  // Determinar el color y el ícono según el tipo de notificación
  const getStyles = () => {
    switch (notification.type) {
      case 'success':
        return { bg: 'bg-green-500', icon: '✅' }
      case 'error':
        return { bg: 'bg-red-500', icon: '❌' }
      case 'info':
        return { bg: 'bg-blue-500', icon: 'ℹ️' }
      case 'warning':
        return { bg: 'bg-yellow-500', icon: '⚠️' }
      default:
        return { bg: 'bg-gray-500', icon: '🔔' }
    }
  }

  const styles = getStyles()

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <motion.div
          className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full mx-4 p-6 relative`}
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="notification-title"
          aria-describedby="notification-message"
        >
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            aria-label="Cerrar notificación"
            ref={closeButtonRef}
          >
            ✖️
          </button>
          <div className="flex items-center">
            <span className={`text-3xl mr-4 ${styles.bg} p-2 rounded-full`}>
              {styles.icon}
            </span>
            <div>
              <h3 id="notification-title" className="text-xl font-semibold mb-2 capitalize text-gray-800 dark:text-gray-100">
                {notification.type}
              </h3>
              <p id="notification-message" className="text-gray-700 dark:text-gray-300">
                {notification.message}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default NotificationModal
