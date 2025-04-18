CREATE TABLE Usuario (
     Id int PRIMARY KEY,
     Nome VARCHAR(20),
     Email VARCHAR(50),
     Senha VARCHAR(50),
     Dt_Nasc Date,
     Telefone VARCHAR(20),
     CPF VARCHAR(20)
 );
 
 CREATE TABLE Compra (
     ID_Compra INT PRIMARY KEY
 );
 
 CREATE TABLE Produto (
     ID_Produto INT PRIMARY KEY,
     Nome_Produto VARCHAR(50),
     Qtn_Produto INT
 );
 
 CREATE TABLE Faz (
     fk_Usuario_Id int,
     fk_Compra_ID_Compra INT
 );
 
 CREATE TABLE Tem (
     fk_Compra_ID_Compra INT,
     fk_Produto_ID_Produto INT
 );
  
 ALTER TABLE Faz ADD CONSTRAINT FK_Faz_1
     FOREIGN KEY (fk_Usuario_Id)
     REFERENCES Usuario (Id)
     ON DELETE SET NULL;
  
 ALTER TABLE Faz ADD CONSTRAINT FK_Faz_2
     FOREIGN KEY (fk_Compra_ID_Compra)
     REFERENCES Compra (ID_Compra)
     ON DELETE SET NULL;
  
 ALTER TABLE Tem ADD CONSTRAINT FK_Tem_1
     FOREIGN KEY (fk_Compra_ID_Compra)
     REFERENCES Compra (ID_Compra)
     ON DELETE SET NULL;
  
 ALTER TABLE Tem ADD CONSTRAINT FK_Tem_2
     FOREIGN KEY (fk_Produto_ID_Produto)
     REFERENCES Produto (ID_Produto)
     ON DELETE SET NULL;