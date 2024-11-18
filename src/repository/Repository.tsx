import db from '../firebaseConfig';
import axios from 'axios';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

class Repository {
  async processaImagem(imageData: string): Promise<string> {
    try {
      const response = await axios.post('http://localhost:5000/upload', {
        image: imageData,
      });
      return response.data.message; // Retorna a mensagem do backend
    } catch (error) {
      console.error('Erro ao enviar imagem para o backend:', error);
      throw new Error('Erro ao processar a imagem. Tente novamente.');
    }
  }

  // Função para buscar o nome do aluno na coleção 'aluno' pelo CPF
  async buscaNomeAluno(cpf: string): Promise<string | null> {
    try {
      const alunoCollection = collection(db, 'alunos'); // Acessa a coleção 'aluno'
      const alunoQuery = query(alunoCollection, where('cpf', '==', cpf)); // Query para buscar o aluno pelo CPF
      const querySnapshot = await getDocs(alunoQuery);

      if (!querySnapshot.empty) {
        const alunoDoc = querySnapshot.docs[0]; // Pega o primeiro documento encontrado
        return alunoDoc.data().nome || null; // Retorna o campo 'nome' ou null
      } else {
        console.warn("Nenhum aluno encontrado com o CPF:", cpf);
        return null;
      }
    } catch (error) {
      console.error("Erro ao buscar o nome do aluno:", error);
      return null;
    }
  }

  // Função para registrar presença no Firestore
  async registraPresenca(cpf: string, pontos: number, metodo_registro: number): Promise<void> {
    try {
      // Validação do parâmetro metodo_registro
      if (![1, 2].includes(metodo_registro)) {
        throw new Error("O método de registro deve ser 1 ou 2.");
      }

      const nomeAluno = await this.buscaNomeAluno(cpf);
      if (!nomeAluno) {
        throw new Error("Aluno não encontrado. Verifique o CPF informado.");
      }

      const presencasCollection = collection(db, 'presencas');

      // Cria um novo documento com UID aleatório
      const docRef = await addDoc(presencasCollection, {
        cpf: cpf,
        nome: nomeAluno,
        data: this.buscaData(),
        pontos: pontos,
        metodo_registro: metodo_registro,
      });

      console.log("Presença registrada com sucesso, ID do documento:", docRef.id);
    } catch (error) {
      console.error("Erro ao registrar presença:", error);
    }
  }

  // Função para buscar a data e horário atual no formato YYYY-MM-DD HH:mm
  buscaData(): Date {
    const agora = new Date();
    console.log("Data e horário atual:", agora.toISOString());
    return agora;
  }
  
}

const repositoryInstance = new Repository();

export default repositoryInstance;
