export const ROLES = {
  OLDER_ADULT: 'older_adult',
  FAMILY: 'family',
  PSW_CAREGIVER: 'psw_caregiver',
  CLINICIAN: 'clinician',
  ADMIN: 'admin'
};

export const ROLE_LABELS = {
  [ROLES.OLDER_ADULT]: 'Older Adult',
  [ROLES.FAMILY]: 'Family / Friend',
  [ROLES.PSW_CAREGIVER]: 'PSW / Caregiver',
  [ROLES.CLINICIAN]: 'Clinician',
  [ROLES.ADMIN]: 'Admin / Coordinator'
};

export const ROLE_NAVIGATION = {
  [ROLES.OLDER_ADULT]: ['home', 'tutorials', 'reminders', 'care-team', 'settings'],
  [ROLES.FAMILY]: ['home', 'messages', 'resources', 'settings'],
  [ROLES.PSW_CAREGIVER]: ['home', 'messages', 'tutorials', 'settings'],
  [ROLES.CLINICIAN]: ['home', 'messages', 'resources', 'settings'],
  [ROLES.ADMIN]: ['home', 'content', 'settings']
};
