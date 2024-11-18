import React, { useState } from 'react';
import InputMask from 'react-input-mask';
import Repository from '../repository/Repository';
import '../styles/ModalManual.css';

interface ModalManualProps {
  onClose: () => void; // Fecha o modal
  navigateToHome: () => void; // Função para redirecionar à tela inicial
}

const ModalManual: React.FC<ModalManualProps> = ({ onClose, navigateToHome }) => {
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState(''); // Nome do aluno buscado

  const handleCpfBlur = async () => {
    // Busca o nome do aluno ao perder o foco no campo CPF
    if (cpf) {
      try {
        const nomeAluno = await Repository.buscaNomeAluno(cpf);
        setNome(nomeAluno || 'Aluno não encontrado');
      } catch (error) {
        console.error('Erro ao buscar nome do aluno:', error);
        setNome('Aluno não encontrado');
      }
    }
  };

  const handleRegister = async () => {
    // Verifica se a senha do professor está correta
    if (password !== '0910') {
      alert('Senha do professor incorreta!');
      return;
    }

    try {
      await Repository.registraPresenca(cpf, 2, 2);
      alert('Presença registrada com sucesso!');
      navigateToHome(); // Redireciona à tela inicial
    } catch (error) {
      console.error('Erro ao registrar presença:', error);
      alert('Erro ao registrar presença. Tente novamente.');
      onClose(); // Fecha o modal
    }
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCpf(e.target.value)
              }
              onBlur={handleCpfBlur} // Busca nome ao perder o foco
              placeholder="Digite o CPF do aluno"
            />
          </div>
          <div className="form-group">
            <label htmlFor="nome">Nome do Aluno:</label>
            <input
              id="nome"
              type="text"
              value={nome}
              readOnly // Campo somente leitura
              placeholder="Nome do aluno"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Senha do Professor:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
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
