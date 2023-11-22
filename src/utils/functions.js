import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { database } from "../firebaseConfig";

export const convertDate = (date) => {
  const convertedDate = new Date(date);
  const theDate = `${convertedDate.getFullYear()}-${
    convertedDate.getMonth() + 1 < 10 ? "0" : ""
  }${convertedDate.getMonth() + 1}-${
    convertedDate.getDate() + 1 < 10 ? "0" : ""
  }${convertedDate.getDate()}`;
  return theDate;
};

export const handleAdding = (setLoading, path, data) => {
  const collectionRef = collection(database, `users/${path}`);
  setLoading(true);
  addDoc(collectionRef, data())
    .then(() => {
      setLoading(false);
      alert("تمت الإضافة بنجاح.");
    })
    .catch((err) => {
      alert(err.message);
    });
};

export const handleUpdating = (setLoading, path, docId, data) => {
  const docToUpdate = doc(database, `users/${path}`, docId);
  setLoading(true);
  updateDoc(docToUpdate, data())
    .then(() => {
      setLoading(false);
      alert("تم التعديل بنجاح.");
    })
    .catch((err) => {
      alert(err.message);
    });
};

export const handleDeleting = (
  setLoading,
  path,
  docId,
  dispatch,
  getData,
  parentId
) => {
  const docToDelete = doc(database, `users/${path}`, docId);
  setLoading(true);
  deleteDoc(docToDelete)
    .then(() => {
      setLoading(false);
      dispatch(getData(parentId && parentId));
    })
    .catch((err) => {
      alert(err.message);
    });
};
