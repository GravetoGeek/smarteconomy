import React from "react";

export const AuthContext = React.createContext({
  signed: false,
  signIn: () => {},
  signOut: () => {},
});


function authProvider({ children }) {
  const [signed, setSigned] = React.useState(false);

  function signIn() {
    setSigned(true);
  }

  function signOut() {
    setSigned(false);
  }

  return (
    <AuthContext.Provider value={{ signed, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}