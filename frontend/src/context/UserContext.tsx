import { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from "react";
import { createUser, getInrBalance, onrampInr } from "../services/api";

interface UserContextType {
  userId: string;
  balance: number; // in rupees (engine returns balance/100)
  refreshBalance: () => Promise<void>;
  addFunds: (amount: number) => Promise<void>;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState(() => {
    const stored = localStorage.getItem("probo_userId");
    const expiry = localStorage.getItem("probo_userId_expiry");
    if (stored && expiry && Date.now() < Number(expiry)) return stored;
    return "";
  });
  const [balance, setBalance] = useState(0);
  const userIdRef = useRef(userId);

  useEffect(() => {
    userIdRef.current = userId;
  }, [userId]);

  const fetchAndSetBalance = async (id: string) => {
    const data = await getInrBalance(id);
    // Engine returns just a number (balance in rupees, already /100)
    if (typeof data === "number") {
      setBalance(data);
    }
  };

  const refreshBalance = useCallback(async () => {
    const id = userIdRef.current;
    if (!id) return;
    try {
      await fetchAndSetBalance(id);
    } catch (err) {
      console.error("Failed to fetch balance:", err);
    }
  }, []);

  const addFunds = useCallback(async (amount: number) => {
    const id = userIdRef.current;
    if (!id) return;
    try {
      await onrampInr(id, amount);
      await fetchAndSetBalance(id);
    } catch (err) {
      console.error("Failed to add funds:", err);
    }
  }, []);

  // Auto-login with 1-hour guest session
  useEffect(() => {
    const init = async () => {
      const stored = localStorage.getItem("probo_userId");
      const expiry = localStorage.getItem("probo_userId_expiry");
      const isValid = stored && expiry && Date.now() < Number(expiry);

      let id: string;
      if (isValid) {
        id = stored;
      } else {
        id = crypto.randomUUID();
        localStorage.setItem("probo_userId", id);
        localStorage.setItem("probo_userId_expiry", String(Date.now() + 3600000));
        try {
          await createUser(id);
          await onrampInr(id, 5000);
        } catch (err) {
          console.error("Failed to init user:", err);
        }
      }

      userIdRef.current = id;
      setUserId(id);
      try {
        await fetchAndSetBalance(id);
      } catch (err) {
        console.error("Failed to fetch balance:", err);
      }
    };
    init();
  }, []);

  return (
    <UserContext.Provider value={{ userId, balance, refreshBalance, addFunds }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
}
