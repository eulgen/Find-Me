import { defineEventHandler, readBody, createError, getQuery, getMethod } from 'h3'
import { getDb, saveDb } from '../utils/db'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)
  const db = getDb()

  if (method === 'GET') {
    // Return all users
    return db.users
  }

  if (method === 'POST') {
    const body = await readBody(event)
    const { username, email, phone, role, password } = body

    if (!username || !email) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Le nom d\'utilisateur et l\'e-mail sont obligatoires'
      })
    }

    const emailLower = email.toLowerCase().trim()
    const isTaken = db.users.some(u => u.email.toLowerCase().trim() === emailLower)
    
    if (isTaken) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Conflict',
        message: 'Cet e-mail est déjà utilisé.'
      })
    }

    const newUser = {
      id: 'u-' + Date.now(),
      username: username.trim(),
      email: emailLower,
      password: password || 'defaultPassword123',
      role: role || 'citizen',
      phone: phone || '',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    }

    db.users.push(newUser)
    saveDb(db)

    return {
      success: true,
      user: newUser
    }
  }

  if (method === 'PUT') {
    const query = getQuery(event)
    const id = query.id as string
    const body = await readBody(event)

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'L\'ID de l\'utilisateur est requis pour la mise à jour'
      })
    }

    const index = db.users.findIndex(u => u.id === id)
    if (index === -1) {
      throw createError({
        statusCode: 444,
        statusMessage: 'Not Found',
        message: 'Utilisateur non trouvé'
      })
    }

    const existingUser = db.users[index]
    if (!existingUser) {
      throw createError({
        statusCode: 444,
        statusMessage: 'Not Found',
        message: 'Utilisateur non trouvé'
      })
    }

    // Merge modifications
    db.users[index] = {
      ...existingUser,
      ...body,
      // Keep ID unmodified
      id: existingUser.id
    }

    saveDb(db)
    return {
      success: true,
      user: db.users[index]
    }
  }

  if (method === 'DELETE') {
    const query = getQuery(event)
    const id = query.id as string

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'L\'ID de l\'utilisateur est requis pour la suppression'
      })
    }

    const userToDelete = db.users.find(u => u.id === id)
    if (!userToDelete) {
      throw createError({
        statusCode: 444,
        statusMessage: 'Not Found',
        message: 'Utilisateur non trouvé'
      })
    }

    if (userToDelete.role === 'admin' && userToDelete.username === 'eulgen') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
        message: 'Impossible de supprimer l\'administrateur principal.'
      })
    }

    db.users = db.users.filter(u => u.id !== id)
    saveDb(db)

    return {
      success: true,
      message: `L'utilisateur ${userToDelete.username} a été supprimé.`
    }
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method Not Allowed',
    message: 'Méthode non autorisée'
  })
})
