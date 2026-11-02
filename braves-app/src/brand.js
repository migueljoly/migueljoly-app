// ============================================================
//  IDENTIDADE DA MARCA — BRAVES CT
//  Tudo o que é "marca" no app sai deste arquivo.
//  Troque aqui e o app inteiro muda (cores, logo, textos).
// ============================================================

export const BRAND = {
  nome: "BRAVES",
  sufixo: "CT",
  slogan: "Disciplina. Foco. Performance.",
  chamada: "Seu treino. Sua evolução. Na palma da mão.",

  // Logo oficial: coloque o arquivo em /public/brand/ e informe o caminho.
  // Ex.: logoUrl: "/brand/logo-braves.png"
  // Vazio = usa o emblema provisório desenhado no código.
  logoUrl: "",

  // Cores PROVISÓRIAS (não foi possível confirmar o manual da marca).
  // Substitua pelos códigos oficiais.
  cores: {
    primaria: "#E1252B",
    secundaria: "#F2B705",
  },

  // Unidades (confirme a lista atual com a franquia)
  unidades: [
    "Alto Boqueirão",
    "Bairro Alto",
    "Fazendinha",
    "Jardim das Américas",
    "Jardim Social",
    "Xaxim",
    "Uberlândia",
  ],

  modalidades: ["Musculação", "Funcional", "Lutas"],

  // Mostra os botões "Testar como aluno / coach" no login.
  // Desligue (false) quando for para produção.
  demo: true,
};
