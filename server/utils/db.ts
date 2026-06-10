import fs from 'fs'
import path from 'path'

const dbFilePath = path.resolve('./server-db.json')

const defaultUsers = [
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
]

const defaultAddresses = [
  {
    fullName: 'Famille Ndeng Brice',
    phone: '+237 699 12 34 56',
    city: 'Yaoundé',
    arrondissement: 'Yaoundé I',
    neighborhood: 'Bastos',
    postalCode: '00237',
    housePlateNumber: '28B',
    streetName: 'Rue de la Joie',
    landmark: 'En face de la Pharmacie de l\'Europe, près du grand manguier',
    coordinates: {
      lat: 3.8480,
      lng: 11.5021
    },
    addressCode: 'FM-YDE-BAS-28B',
    photoRaw: '/assets/images/cameroon_house_address_1780109511639.png',
    photoStats: {
      compressed: '194 KB',
      ratio: '84'
    }
  }
]

interface DbSchema {
  users: typeof defaultUsers
  addresses: typeof defaultAddresses
}

export function getDb(): DbSchema {
  try {
    if (fs.existsSync(dbFilePath)) {
      const data = fs.readFileSync(dbFilePath, 'utf-8')
      const parsed = JSON.parse(data)
      return {
        users: parsed.users || defaultUsers,
        addresses: parsed.addresses || defaultAddresses
      }
    }
  } catch (error) {
    console.error('Error reading database file, using defaults:', error)
  }

  // Write default db if not existing
  const db = { users: defaultUsers, addresses: defaultAddresses }
  saveDb(db)
  return db
}

export function saveDb(data: DbSchema) {
  try {
    fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2), 'utf-8')
  } catch (error) {
    console.error('Error writing to database file:', error)
  }
}
