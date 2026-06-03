/**
 * @file useAuth.ts
 * @description Composable régissant l'état d'authentification simulée (connexion, inscription, OAuth Google).
 * 
 * Il gère les variables de saisie d'authentification, les états de chargement
 * et pilote la boîte de dialogue de connexion ou d'enregistrement.
 */

import { ref } from 'vue'
import { useToasts } from './useToasts'

const currentUser = ref<{ email: string; username: string; role?: 'citizen' | 'admin' } | null>(null)
const registeredUsers = ref<Record<string, string>>({
  'ndengbrice@gmail.com': 'Brice Ndeng',
})

const usersList = ref<any[]>([
  {
    id: 'u-1',
    username: 'Brice Ndeng',
    email: 'ndengbrice@gmail.com',
    password: 'password123',
    role: 'citizen',
    phone: '+237 699 12 34 56',
    createdAt: '2026-05-15 10:30'
  },
  {
    id: 'admin-1',
    username: 'eulgen',
    email: 'mastaflex65@gmail.com',
    password: 'flammenoir',
    role: 'admin',
    phone: '+237 600 00 00 00',
    createdAt: '2026-06-01 08:00'
  }
])

const authModalOpen = ref<boolean>(false)
const authStep = ref<'login' | 'success'>('login')
const authMode = ref<'signin' | 'signup'>('signin')
const authEmail = ref<string>('')
const authUsername = ref<string>('')
const authPassword = ref<string>('')
const isGoogleLoading = ref<boolean>(false)
const googleUser = ref<boolean>(false)
const isAuthSubmitLoading = ref<boolean>(false)
const isAuthDoneLoading = ref<boolean>(false)

export function useAuth() {
  const { addToast } = useToasts()

  const resetAuth = () => {
    authModalOpen.value = false
    authStep.value = 'login'
    authMode.value = 'signin'
    authEmail.value = ''
    authUsername.value = ''
    authPassword.value = ''
    googleUser.value = false
  }

  const handleSimulatedClaim = (e: Event) => {
    e.preventDefault()
    if (authMode.value === 'signin' && !authEmail.value) return
    if (authMode.value === 'signup' && (!authEmail.value || !authUsername.value)) return
    
    isAuthSubmitLoading.value = true
    setTimeout(() => {
      isAuthSubmitLoading.value = false
      
      const emailLower = authEmail.value.toLowerCase().trim()
      const passwordTyped = authPassword.value.trim()
      
      if (authMode.value === 'signup') {
        registeredUsers.value[emailLower] = authUsername.value
        
        const registeredObj = { email: authEmail.value, username: authUsername.value, role: 'citizen' as const }
        currentUser.value = registeredObj
        
        usersList.value.push({
          id: 'u-' + Date.now(),
          username: authUsername.value,
          email: authEmail.value,
          password: authPassword.value || 'password123',
          role: 'citizen',
          phone: '',
          createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
        })

        authStep.value = 'success'
        
        addToast('✨ Compte créé avec succès !', 'success')
        addToast(`📧 Un e-mail de vérification a été envoyé à ${authEmail.value}. Veuillez vérifier votre boîte pour confirmer.`, 'mail')
      } else {
        // Check for admin credentials
        if (
          (emailLower === 'mastaflex65@gmail.com' || emailLower === 'eulgen') &&
          passwordTyped === 'flammenoir'
        ) {
          const loggedInObj = { email: 'mastaflex65@gmail.com', username: 'eulgen', role: 'admin' as const }
          currentUser.value = loggedInObj
          authStep.value = 'success'
          addToast('👑 Connexion Administrateur réussie ! Bienvenue, eulgen.', 'success')
          return
        }

        const emailDomainPart = authEmail.value.split('@')[0] || 'Citoyen'
        const memoizedName = registeredUsers.value[emailLower] || 
          emailDomainPart.split('.').map(s => (s.charAt(0) || '').toUpperCase() + s.slice(1)).join(' ')
        
        const loggedInObj = { email: authEmail.value, username: memoizedName, role: 'citizen' as const }
        currentUser.value = loggedInObj
        
        if (!usersList.value.some(u => u.email.toLowerCase() === emailLower)) {
          usersList.value.push({
            id: 'u-' + Date.now(),
            username: memoizedName,
            email: authEmail.value,
            password: passwordTyped || '123456',
            role: 'citizen',
            phone: '',
            createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
          })
        }

        authStep.value = 'success'
        addToast(`🎉 Connexion réussie ! Bienvenue, ${memoizedName}`, 'success')
      }
    }, 1100)
  }

  const handleGoogleAuth = () => {
    isGoogleLoading.value = true
    setTimeout(() => {
      isGoogleLoading.value = false
      googleUser.value = true
      
      const mockEmail = 'ndengbrice@gmail.com'
      const mockUsername = 'Brice Ndeng'
      
      authEmail.value = mockEmail
      authUsername.value = mockUsername
      authStep.value = 'success'
      
      const userObj = { email: mockEmail, username: mockUsername, role: 'citizen' as const }
      currentUser.value = userObj

      if (!usersList.value.some(u => u.email.toLowerCase() === mockEmail)) {
        usersList.value.push({
          id: 'u-' + Date.now(),
          username: mockUsername,
          email: mockEmail,
          password: 'google-auth-user',
          role: 'citizen',
          phone: '+237 699 12 34 56',
          createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
        })
      }

      if (authMode.value === 'signup') {
        addToast('✨ Compte créé avec succès via Google !', 'success')
        addToast(`📧 Un e-mail de vérification a été envoyé sur ${mockEmail} pour acter votre inscription.`, 'mail')
      } else {
        addToast(`🎉 Connexion Google réussie ! Bienvenue, ${mockUsername}`, 'success')
      }
    }, 1400)
  }

  // CRUD for users list
  const adminCreateUser = (user: { username: string; email: string; phone: string; role: 'citizen' | 'admin' }) => {
    const newUser = {
      id: 'u-' + Date.now(),
      username: user.username,
      email: user.email.toLowerCase().trim(),
      password: 'defaultPassword123',
      role: user.role,
      phone: user.phone || '',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    }
    usersList.value.push(newUser)
    registeredUsers.value[newUser.email] = newUser.username
    addToast(`👤 Utilisateur ${newUser.username} créé avec succès.`, 'success')
  }

  const adminUpdateUser = (id: string, updatedData: Partial<any>) => {
    const index = usersList.value.findIndex(u => u.id === id)
    if (index !== -1) {
      usersList.value[index] = { ...usersList.value[index], ...updatedData }
      if (updatedData.email && updatedData.username) {
        registeredUsers.value[updatedData.email.toLowerCase().trim()] = updatedData.username
      }
      addToast(`💾 Changements enregistrés pour ${usersList.value[index].username}.`, 'success')
    }
  }

  const adminDeleteUser = (id: string) => {
    const user = usersList.value.find(u => u.id === id)
    if (user) {
      if (user.role === 'admin' && user.username === 'eulgen') {
        addToast('⚠️ Impossible de supprimer l\'administrateur principal.', 'info')
        return
      }
      usersList.value = usersList.value.filter(u => u.id !== id)
      delete registeredUsers.value[user.email]
      addToast(`🗑️ L'utilisateur ${user.username} a été supprimé.`, 'success')
    }
  }

  return {
    currentUser,
    registeredUsers,
    usersList,
    authModalOpen,
    authStep,
    authMode,
    authEmail,
    authUsername,
    authPassword,
    isGoogleLoading,
    googleUser,
    isAuthSubmitLoading,
    isAuthDoneLoading,
    resetAuth,
    handleSimulatedClaim,
    handleGoogleAuth,
    adminCreateUser,
    adminUpdateUser,
    adminDeleteUser
  }
}
