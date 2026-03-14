import { create } from 'zustand';

type Perfil = 'ADMINISTRADOR' | 'PROFISSIONAL' | 'PACIENTE';

type Usuario = {
  id: string;
  nome: string;
  email: string;
  perfil: Perfil;
  clinicaId?: string;
};

type EstadoAuth = {
  usuario: Usuario | null;
  token: string | null;
  refreshToken: string | null;
  setSessao: (dados: { usuario: Usuario; token: string; refreshToken: string }) => void;
  limparSessao: () => void;
};

function carregarLocalStorage() {
  const usuario = localStorage.getItem('usuario');
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');
  return {
    usuario: usuario ? (JSON.parse(usuario) as Usuario) : null,
    token,
    refreshToken,
  };
}

const useAuthStore = create<EstadoAuth>((set) => ({
  ...carregarLocalStorage(),
  setSessao: ({ usuario, token, refreshToken }) => {
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    set({ usuario, token, refreshToken });
  },
  limparSessao: () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    set({ usuario: null, token: null, refreshToken: null });
  },
}));

export { useAuthStore };
