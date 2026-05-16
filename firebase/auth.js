import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './config';

const API_KEY = 'AIzaSyD-8NmryL7XAVVGa5Md85XDKMQ7GzDr9-o';
const AUTH_URL = 'https://identitytoolkit.googleapis.com/v1/accounts';
const SESSION_KEY = '@arauz_barraza_session';
const FETCH_TIMEOUT = 15000;

const fetchWithTimeout = async (url, options) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timer);
  }
};

const handleAuthResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    const errorCode = data.error?.message || 'UNKNOWN';
    let message = `Error de autenticación (${errorCode})`;
    if (errorCode === 'EMAIL_EXISTS') message = 'El correo ya está registrado';
    else if (errorCode === 'WEAK_PASSWORD') message = 'La contraseña debe tener al menos 6 caracteres';
    else if (errorCode === 'INVALID_EMAIL') message = 'Correo electrónico inválido';
    else if (errorCode === 'OPERATION_NOT_ALLOWED') message = 'Registro no habilitado. Activa Email/Password en Firebase Console';
    else if (errorCode === 'INVALID_LOGIN_CREDENTIALS' || errorCode === 'EMAIL_NOT_FOUND' || errorCode === 'INVALID_PASSWORD') message = 'Credenciales inválidas';
    else if (errorCode === 'USER_DISABLED') message = 'Usuario deshabilitado';
    else if (errorCode === 'TOO_MANY_ATTEMPTS_TRY_LATER') message = 'Demasiados intentos. Intenta más tarde';
    throw new Error(message);
  }
  return data;
};

const saveSession = async (sessionData) => {
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
};

const saveUserProfile = async (uid, data) => {
  try {
    await setDoc(doc(db, 'usuarios', uid), data, { merge: true });
  } catch (e) {
    console.warn('Firestore unavailable:', e.message);
  }
};

export const registerUser = async (email, password, userData) => {
  try {
    const response = await fetchWithTimeout(`${AUTH_URL}:signUp?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    });

    const data = await handleAuthResponse(response);
    const displayName = `${userData.nombre} ${userData.apellido}`;

    saveUserProfile(data.localId, {
      ...userData,
      email,
      uid: data.localId,
      rol: userData.rol || 'abogado',
      displayName,
      activo: true,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    });

    await saveSession({
      uid: data.localId,
      email: data.email,
      displayName,
      idToken: data.idToken,
      refreshToken: data.refreshToken,
    });

    return {
      success: true,
      user: { uid: data.localId, email: data.email, displayName },
    };
  } catch (error) {
    if (error.name === 'AbortError') return { success: false, error: 'Tiempo de espera agotado. Verifica tu conexión' };
    return { success: false, error: error.message };
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await fetchWithTimeout(`${AUTH_URL}:signInWithPassword?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    });

    const data = await handleAuthResponse(response);
    let displayName = data.displayName || email;

    try {
      const profileDoc = await getDoc(doc(db, 'usuarios', data.localId));
      if (profileDoc.exists()) {
        const pd = profileDoc.data();
        if (pd.displayName) displayName = pd.displayName;
        else if (pd.nombre) displayName = `${pd.nombre} ${pd.apellido || ''}`.trim();
      }
    } catch (e) {
      // Firestore unavailable, keep displayName as fallback
    }

    saveUserProfile(data.localId, {
      email,
      lastLogin: new Date().toISOString(),
    });

    await saveSession({
      uid: data.localId,
      email: data.email,
      displayName,
      idToken: data.idToken,
      refreshToken: data.refreshToken,
    });

    return {
      success: true,
      user: { uid: data.localId, email: data.email, displayName },
    };
  } catch (error) {
    if (error.name === 'AbortError') return { success: false, error: 'Tiempo de espera agotado. Verifica tu conexión' };
    return { success: false, error: error.message };
  }
};

export const logoutUser = async () => {
  try {
    await AsyncStorage.removeItem(SESSION_KEY);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const resetPassword = async (email) => {
  try {
    const response = await fetchWithTimeout(`${AUTH_URL}:sendOobCode?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, requestType: 'PASSWORD_RESET' }),
    });

    await handleAuthResponse(response);
    return { success: true, message: 'Revise su correo para restablecer su contraseña' };
  } catch (error) {
    if (error.name === 'AbortError') return { success: false, error: 'Tiempo de espera agotado. Verifica tu conexión' };
    return { success: false, error: error.message };
  }
};

export const getCurrentUser = async () => {
  try {
    const json = await AsyncStorage.getItem(SESSION_KEY);
    if (!json) return null;
    const session = JSON.parse(json);
    return { uid: session.uid, email: session.email, displayName: session.displayName };
  } catch {
    return null;
  }
};

export const getUserProfile = async (uid) => {
  try {
    const docSnap = await getDoc(doc(db, 'usuarios', uid));
    if (docSnap.exists()) {
      return { success: true, data: docSnap.data() };
    }
    return { success: false, error: 'Perfil no encontrado' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const onAuthChange = (callback) => {
  const poll = async () => {
    const user = await getCurrentUser();
    callback(user);
  };
  poll();
  const interval = setInterval(poll, 3000);
  return () => clearInterval(interval);
};
