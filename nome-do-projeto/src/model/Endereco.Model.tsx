export interface EnderecoModel{
  ID_Endereco?: number;  
  Rua: string;
  Numero: string;
  Cidade: string;
  CEP: string;
  Bairro: string;
  fk_ID_Usuario?: number; 
}

    

