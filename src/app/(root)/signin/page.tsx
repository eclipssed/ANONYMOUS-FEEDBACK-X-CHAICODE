'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import axios, { AxiosError } from "axios"
import { useEffect, useState } from "react"
import { useDebounceValue } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { signupSchema } from "@/schemas/signupSchema"
import { apiResponse } from "@/types/apiResponse"


const signinPage = () => {
  const [username, setUsername] = useState('')
  const [usernameMessage, setUsernameMessage] = useState('')
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const debouncedUsername =   useDebounceValue(username, 300)
  const {toast} = useToast()
  const router = useRouter()

  // zod implementation
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    }
  })
  
  useEffect(() => {
    const checkUsernameUnique = async() => {
      if(debouncedUsername){
        setIsCheckingUsername(true)
        setUsernameMessage('')
        try {
          const response = await axios.get(`/api/check-unique-username?username=${debouncedUsername}`)
          setUsernameMessage(response.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<apiResponse>
          setUsername(axiosError.response?.data.message ?? "Error checking username.")
        } finally {
          setIsCheckingUsername(false)
        }
      }
    }

    checkUsernameUnique()
    
  }, [debouncedUsername])
  



  return (
    <div>signinPage</div>
  )
}

export default signinPage