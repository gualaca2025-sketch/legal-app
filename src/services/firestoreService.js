import {
  collection,
  addDoc,
  setDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../../firebase/config';

export const createDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return { success: true, id: docRef.id, data: { id: docRef.id, ...data } };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const setDocument = async (collectionName, docId, data) => {
  try {
    await setDoc(doc(db, collectionName, docId), {
      ...data,
      updatedAt: Timestamp.now(),
    }, { merge: true });
    return { success: true, data: { id: docId, ...data } };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateDocument = async (collectionName, docId, data) => {
  try {
    await updateDoc(doc(db, collectionName, docId), {
      ...data,
      updatedAt: Timestamp.now(),
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteDocument = async (collectionName, docId) => {
  try {
    await deleteDoc(doc(db, collectionName, docId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getDocument = async (collectionName, docId) => {
  try {
    const docSnap = await getDoc(doc(db, collectionName, docId));
    if (docSnap.exists()) {
      return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
    }
    return { success: false, error: 'Documento no encontrado' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const queryDocuments = async (
  collectionName,
  conditions = [],
  orderByField = null,
  orderDirection = 'asc',
  limitCount = null
) => {
  try {
    const constraints = [];
    conditions.forEach(({ field, operator, value }) => {
      if (operator === '==') constraints.push(where(field, '==', value));
    });
    if (orderByField) {
      constraints.push(orderBy(orderByField, orderDirection));
    }
    if (limitCount) {
      constraints.push(limit(limitCount));
    }

    const q = query(collection(db, collectionName), ...constraints);
    const querySnapshot = await getDocs(q);
    const items = [];
    querySnapshot.forEach((snap) => {
      items.push({ id: snap.id, ...snap.data() });
    });
    return { success: true, data: items };
  } catch (error) {
    return { success: false, error: error.message, data: [] };
  }
};

export const getAllDocuments = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const items = [];
    querySnapshot.forEach((snap) => {
      items.push({ id: snap.id, ...snap.data() });
    });
    return { success: true, data: items };
  } catch (error) {
    return { success: false, error: error.message, data: [] };
  }
};

export const subscribeToCollection = (collectionName, callback, conditions = []) => {
  const constraints = [];
  conditions.forEach(({ field, operator, value }) => {
    if (operator === '==') constraints.push(where(field, '==', value));
  });

  const q = query(collection(db, collectionName), ...constraints);

  return onSnapshot(q, (snapshot) => {
    const items = [];
    snapshot.forEach((snap) => {
      items.push({ id: snap.id, ...snap.data() });
    });
    callback(items);
  }, (error) => {
    console.error(`Error subscribing to ${collectionName}:`, error);
  });
};

export const subscribeToDocument = (collectionName, docId, callback) => {
  return onSnapshot(doc(db, collectionName, docId), (snap) => {
    if (snap.exists()) {
      callback({ id: snap.id, ...snap.data() });
    }
  });
};

export const getDashboardStats = async (userId) => {
  try {
    const [pacientesSnap, citasSnap, cobrosSnap, historiasSnap] = await Promise.all([
      getDocs(query(collection(db, 'pacientes'), where('doctorId', '==', userId))),
      getDocs(query(collection(db, 'citas'), where('doctorId', '==', userId))),
      getDocs(query(collection(db, 'cobros'), where('doctorId', '==', userId))),
      getDocs(query(collection(db, 'historias_clinicas'), where('doctorId', '==', userId))),
    ]);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    let cobrosDelMes = 0;
    cobrosSnap.forEach((snap) => {
      const data = snap.data();
      const createdAt = data.createdAt?.toDate?.() || new Date(data.createdAt || 0);
      if (createdAt >= startOfMonth) {
        cobrosDelMes += parseFloat(data.monto) || 0;
      }
    });

    let citasPendientes = 0;
    citasSnap.forEach((snap) => {
      if (snap.data().estado === 'pendiente') citasPendientes++;
    });

    return {
      success: true,
      data: {
        totalPacientes: pacientesSnap.size,
        totalHistorias: historiasSnap.size,
        cobrosDelMes,
        citasPendientes,
      },
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getPacientes = async () => {
  const result = await getAllDocuments('pacientes');
  return result.success ? result.data : [];
};

export const FIRESTORE_COLLECTIONS = {
  PACIENTES: 'pacientes',
  DOCTORES: 'doctores',
  SERVICIOS: 'servicios',
  HISTORIAS_CLINICAS: 'historias_clinicas',
  CITAS: 'citas',
  COBROS: 'cobros',
  FACTURAS: 'facturas',
  NOTIFICACIONES: 'notificaciones',
  USUARIOS: 'usuarios',
};
