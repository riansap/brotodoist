import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

// Inisialisasi Firebase Admin
initializeApp();
const db = getFirestore();

// Definisikan limit
const DAILY_ACTION_LIMIT = 50;
const TOTAL_TASK_LIMIT = 50;

/**
 * Cloud Function untuk MENAMBAH to-do dengan pengecekan kuota ganda.
 */
export const addTodoWithLimits = onCall(async (request) => {
  // 1. Cek otentikasi pengguna
  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "You must be logged in to perform this action."
    );
  }
  const userId = request.auth.uid;
  const { text } = request.data;

  // 2. Validasi input
  if (!text || typeof text !== "string" || text.trim().length === 0) {
    throw new HttpsError("invalid-argument", "Valid task text is required.");
  }

  const quotaRef = db.collection("userQuotas").doc(userId);
  const todosCollectionRef = db.collection("todos");

  try {
    // 3. Jalankan semua pengecekan dan operasi dalam satu transaksi
    await db.runTransaction(async (transaction) => {
      // Pengecekan Kuota Harian
      const quotaDoc = await transaction.get(quotaRef);
      const today = new Date().setHours(0, 0, 0, 0);
      let dailyCount = quotaDoc.data()?.actionCount || 0;
      let lastReset =
        quotaDoc.data()?.lastReset.toDate().setHours(0, 0, 0, 0) || 0;

      if (lastReset < today) {
        dailyCount = 0;
      }
      if (dailyCount >= DAILY_ACTION_LIMIT) {
        throw new HttpsError(
          "resource-exhausted",
          `You have reached the daily limit of ${DAILY_ACTION_LIMIT} tasks.`
        );
      }

      // Pengecekan Kuota Total
      const todosQuery = todosCollectionRef.where("userId", "==", userId);
      const todosSnapshot = await transaction.get(todosQuery);
      if (todosSnapshot.size >= TOTAL_TASK_LIMIT) {
        throw new HttpsError(
          "resource-exhausted",
          `You have reached the maximum of ${TOTAL_TASK_LIMIT} tasks. Please delete one to add a new one.`
        );
      }

      // Jika semua pengecekan lolos, tambahkan to-do baru
      transaction.create(todosCollectionRef.doc(), {
        userId: userId,
        text: text.trim(),
        completed: false,
        createdAt: FieldValue.serverTimestamp(),
      });

      // Update kuota harian
      transaction.set(
        quotaRef,
        { actionCount: dailyCount + 1, lastReset: new Date(today) },
        { merge: true }
      );
    });

    return { success: true, message: "Task added successfully." };
  } catch (error) {
    logger.error("Transaction failed:", error);
    if (error instanceof HttpsError) {
      throw error; // Lemparkan kembali error yang sudah diformat
    }
    // Lemparkan error umum jika terjadi kesalahan tak terduga
    throw new HttpsError(
      "internal",
      "An unexpected error occurred while adding the task."
    );
  }
});

/**
 * Cloud Function untuk MENGHAPUS to-do.
 */
export const deleteTodo = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "You must be logged in to perform this action."
    );
  }
  const userId = request.auth.uid;
  const { todoId } = request.data;

  if (!todoId || typeof todoId !== "string") {
    throw new HttpsError("invalid-argument", "A valid Todo ID is required.");
  }

  const todoRef = db.collection("todos").doc(todoId);
  const doc = await todoRef.get();

  if (!doc.exists) {
    throw new HttpsError("not-found", "The specified task does not exist.");
  }
  if (doc.data()?.userId !== userId) {
    throw new HttpsError(
      "permission-denied",
      "You do not have permission to delete this task."
    );
  }

  await todoRef.delete();
  return { success: true, message: "Task deleted successfully." };
});
