import { motion } from 'framer-motion'
import MethodsGrid from '../components/MethodsGrid'

const Home = ({ onMethodSelect }) => {
  return (
    <motion.div 
      className="w-full flex flex-col items-center justify-center min-h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <MethodsGrid onMethodSelect={onMethodSelect} />
    </motion.div>
  )
}

export default Home
