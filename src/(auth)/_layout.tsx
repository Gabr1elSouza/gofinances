import {Slot} from 'expo-router'
import { ClerkProvider } from '@clerk/clerk-expo'

const PUBLIC_CLERK_PUBLISHABLE_KEY= process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string

export default function Layout(){
  return(
    
      <Slot/>
    </ClerkProvider>
  )
}