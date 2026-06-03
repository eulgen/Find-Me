/**
 * @file useValidation.ts
 * @description Composable regroupant la logique métier de validation des adresses municipales pour le Cameroun.
 * 
 * Ce module valide :
 * 1. Le numéro de plaque d'habitation (ex: M-28B, Villa 4, etc.)
 * 2. Le code postal national ou Boîte Postale (par défaut 00237 ou format BP)
 * 
 * Toutes les alertes et conseils retournés sont rédigés exclusivement en français.
 */

export interface ValidationResult {
  isValid: boolean
  message: string
  hint?: string
}

export function useValidation() {
  return {
    validateCameroonHouseNumber,
    validateCameroonPostalCode
  }
}

/**
 * Valide le format du numéro d'habitation ou de la plaque d'entrée municipale au Cameroun.
 * @param val {string} La valeur saisie par l'utilisateur
 * @returns {ValidationResult} Le résultat de la validation avec conseils ciblés
 */
export function validateCameroonHouseNumber(val: string): ValidationResult {
  const clean = val.trim()
  if (!clean) {
    return {
      isValid: false,
      message: 'Le numéro d’habitation ou plaque est obligatoire.',
      hint: 'Format conseillé : M-28B, Villa 14, Bloc 4 ou simplement un numéro d’entrée.'
    }
  }

  // Exclusion de caractères spéciaux non autorisés
  if (/[#$@%*?&]/.test(clean)) {
    return {
      isValid: false,
      message: 'Caractères spéciaux non autorisés.',
      hint: 'Veuillez utiliser uniquement les lettres, chiffres, tirets ou espaces.'
    }
  }

  // Regex pour reconnaître le format municipal standardisé (ex: M-33, VILLA-4)
  const plateRegex = /^(M|VILLA|LOT|BLOC|APPART|APPT|PORTAIL|CLOTURE|MAISON|PORTAL|BLOCK)\s*[-–]?\s*[0-9a-zA-Z-\s]+$/i
  const rawAlphanumeric = /^[0-9a-zA-Z-\s]{1,12}$/
  
  if (plateRegex.test(clean)) {
    return {
      isValid: true,
      message: '',
      hint: '✓ Format civique officiel détecté (excellent pour les secours) !'
    }
  }

  if (rawAlphanumeric.test(clean)) {
    return {
      isValid: true,
      message: '',
      hint: '✓ Format simple valide (ex: 28B). Astuce: vous pouvez préfixer "M-" pour plaque municipale.'
    }
  }

  return {
    isValid: true,
    message: '',
    hint: '✓ Format d’adressage libre accepté.'
  }
}

/**
 * Valide le format du code postal ou de la Boîte Postale pour le Cameroun.
 * @param val {string} La valeur saisie par l'utilisateur
 * @returns {ValidationResult} Le résultat de la validation
 */
export function validateCameroonPostalCode(val: string): ValidationResult {
  const clean = val.trim()
  if (!clean) {
    return {
      isValid: true,
      message: '',
      hint: 'Laisser vide pour utiliser par défaut le code national d’adressage (00237).'
    }
  }

  const cleanDigits = clean.replace(/[\s-]/g, '')
  if (cleanDigits === '00237') {
    return {
      isValid: true,
      message: '',
      hint: '✓ Code postal national principal (Cameroun).'
    }
  }

  // Boîte Postale (ex: BP 120)
  const bpRegex = /^(BP|B\.P\.)\s*\d+$/i
  if (bpRegex.test(clean)) {
    return {
      isValid: true,
      message: '',
      hint: '✓ Format Boîte Postale valide. Idéal pour Campost.'
    }
  }

  // Code postal à 5 chiffres standardisé
  const fiveDigitsRegex = /^\d{5}$/
  if (fiveDigitsRegex.test(cleanDigits)) {
    return {
      isValid: true,
      message: '',
      hint: '✓ Code postal à 5 chiffres conforme.'
    }
  }

  return {
    isValid: false,
    message: 'Format de code postal invalide ou non reconnu.',
    hint: 'Utilisez le format standard à 5 chiffres (ex: 00237) ou une Boîte Postale (ex: BP 12347).'
  }
}
