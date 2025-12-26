/**
 * Access helpers for scoped RBAC checks.
 */

const normalizeScopeValue = (value) => {
  if (typeof value !== 'string') return '';
  return value.trim();
};

export const getClinicianScope = (user) => {
  if (!user || user.role !== 'clinician') return null;
  const clinic = normalizeScopeValue(user.clinic);
  if (clinic) return { type: 'clinic', value: clinic };
  const school = normalizeScopeValue(user.school);
  if (school) return { type: 'school', value: school };
  return null;
};

const isClinicianScopedToPatient = (user, patient) => {
  const scope = getClinicianScope(user);
  if (!scope || !patient) return false;
  if (scope.type === 'clinic') {
    return Boolean(patient.clinic && patient.clinic === scope.value);
  }
  return Boolean(patient.school && patient.school === scope.value);
};

const isSchoolAdminScopedToPatient = (user, patient) => {
  if (!user || user.role !== 'school_admin') return false;
  const school = normalizeScopeValue(user.school);
  return Boolean(school && patient?.school && patient.school === school);
};

const getPatientId = (patient) => {
  if (!patient) return null;
  if (patient._id?.toString) return patient._id.toString();
  if (typeof patient === 'string') return patient;
  if (patient.toString) return patient.toString();
  return null;
};

export const canAccessPatient = (req, patient, options = {}) => {
  if (!req?.user || !patient) return false;
  const { allowSchoolAdmin = false } = options;
  const patientId = getPatientId(patient);
  if (!patientId) return false;

  const currentId = req.userId?.toString?.() ?? req.user._id?.toString?.();
  if (req.user.role === 'super_admin') return true;
  if (currentId && currentId === patientId) return true;
  if (req.user.role === 'parent' && Array.isArray(req.user.children)) {
    return req.user.children.some((childId) => childId.toString() === patientId);
  }
  if (req.user.role === 'school_admin') {
    return allowSchoolAdmin && isSchoolAdminScopedToPatient(req.user, patient);
  }
  if (req.user.role === 'clinician') {
    return isClinicianScopedToPatient(req.user, patient);
  }
  return false;
};
