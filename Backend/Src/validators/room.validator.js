/**
 * Room Request Validators
 */

const SUPPORTED_LANGUAGES = [
  'javascript',
  'typescript',
  'python',
  'java',
  'cpp',
  'c',
  'go',
  'rust'
];

function validateCreateRoom({ roomName, language }) {
  const errors = {};

  if (!roomName || typeof roomName !== 'string' || roomName.trim().length < 3) {
    errors.roomName = 'Room name must be at least 3 characters long.';
  } else if (roomName.trim().length > 50) {
    errors.roomName = 'Room name cannot exceed 50 characters.';
  }

  const normalizedLang = typeof language === 'string' ? language.trim().toLowerCase() : '';
  if (!normalizedLang) {
    errors.language = 'Language is required.';
  } else if (!SUPPORTED_LANGUAGES.includes(normalizedLang)) {
    errors.language = `Unsupported language "${language}". Supported: ${SUPPORTED_LANGUAGES.join(', ')}`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitized: {
      roomName: typeof roomName === 'string' ? roomName.trim() : '',
      language: normalizedLang
    }
  };
}

function validateRoomId(roomId) {
  if (!roomId || typeof roomId !== 'string' || !roomId.trim()) {
    return false;
  }
  // Allow alphanumeric and standard uuid hyphen formats
  return /^[a-zA-Z0-9-]{6,64}$/.test(roomId.trim());
}

module.exports = {
  SUPPORTED_LANGUAGES,
  validateCreateRoom,
  validateRoomId
};
