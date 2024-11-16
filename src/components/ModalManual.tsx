import React, { useState } from 'react';
import InputMask from 'react-input-mask';
import '../styles/ModalManual.css';

interface ModalManualProps {
  onClose: () => void;
}

const ModalManual: React.FC<ModalManualProps> = ({ onClose }) => {
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [date] = useState(new Date().toLocaleDateString('pt-BR')); // Data de hoje sem hora

  const handleRegister = () => {
    // Lógica para preparar os dados
    console.log({
      cpf,
      password,
      date,
    });

    // Após o registro, fecha o modal
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Registrar Presença Manualmente</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleRegister();
          }}
        >
          <div className="form-group">
            <label htmlFor="cpf">CPF do Aluno:</label>
            <InputMask
              id="cpf"
              mask="999.999.999-99" // Máscara para CPF
              value={cpf}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCpf(e.target.value)}
              placeholder="Digite o CPF do aluno"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Senha do Professor:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              placeholder="Digite a senha do professor"
            />
          </div>
          <button type="submit" className="register-button-modal">
            REGISTRAR PRESENÇA
          </button>
        </form>
        <button onClick={onClose} className="close-button">
          FECHAR
        </button>
      </div>
    </div>
  );
};

export default ModalManual;
