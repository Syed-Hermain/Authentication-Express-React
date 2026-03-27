import React from 'react'

const AuthContext = React.createContext(undefined)

export function AuthProvider({ children }) {
  const [user, setUser] = React.useState({name:"", isAuth: false});

  const login = (data) => {
    setUser({name: data, isAuth: true})
  }

  const logout = () => {
    setUser({name: "", isAuth: false})
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext