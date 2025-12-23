import { Question, QuestionType } from './types';

export const QUESTIONS: Question[] = [
  {
    id: 'welcome',
    type: QuestionType.WELCOME,
    title: 'Queremos transformar sua experiência ao se locomover em Fortaleza.',
    subtitle: 'Leva menos de 2 minutos. Suas respostas ajudam a construir o Niva, um novo padrão de transporte premium.',
  },
  // Bloco 1 - Perfil
  {
    id: 'age',
    type: QuestionType.SINGLE_SELECT,
    title: 'Qual sua faixa etária?',
    options: [
      { label: 'Menos de 18', value: '<18' },
      { label: '18–24', value: '18-24' },
      { label: '25–34', value: '25-34' },
      { label: '35–44', value: '35-44' },
      { label: '45–54', value: '45-54' },
      { label: '55+', value: '55+' },
    ],
  },
  {
    id: 'location',
    type: QuestionType.SINGLE_SELECT,
    title: 'Você mora em Fortaleza ou região metropolitana?',
    options: [
      { label: 'Fortaleza', value: 'fortaleza' },
      { label: 'Região Metropolitana', value: 'rmf' },
      { label: 'Visita frequente', value: 'visita' },
      { label: 'Turista', value: 'turista' },
    ],
  },
  {
    id: 'use_cases',
    type: QuestionType.MULTI_SELECT,
    title: 'Em quais situações você mais usa apps de transporte?',
    subtitle: 'Selecione todas que se aplicam',
    options: [
      { label: 'Trabalho', value: 'trabalho' },
      { label: 'Eventos / festas', value: 'eventos' },
      { label: 'Restaurantes / lazer', value: 'lazer' },
      { label: 'Aeroporto', value: 'aeroporto' },
      { label: 'Reuniões', value: 'reunioes' },
      { label: 'Outros', value: 'outros' },
    ],
  },
  // Bloco 2 - Uso Atual
  {
    id: 'frequency',
    type: QuestionType.SINGLE_SELECT,
    title: 'Com que frequência você usa Uber ou apps similares?',
    options: [
      { label: 'Todos os dias', value: 'diario' },
      { label: '3–5x por semana', value: '3-5_semana' },
      { label: '1–2x por semana', value: '1-2_semana' },
      { label: 'Raramente', value: 'raramente' },
    ],
  },
  {
    id: 'category',
    type: QuestionType.SINGLE_SELECT,
    title: 'Qual categoria você mais utiliza?',
    options: [
      { label: 'UberX', value: 'uberx' },
      { label: 'Comfort', value: 'comfort' },
      { label: 'Black', value: 'black' },
      { label: 'Já tentei Black, mas quase nunca tem', value: 'black_unavailable' },
      { label: 'Não sabia da categoria Black', value: 'black_unknown' },
    ],
  },
  {
    id: 'black_barrier',
    type: QuestionType.SINGLE_SELECT,
    title: 'O que mais te impede de usar Uber Black?',
    options: [
      { label: 'Poucos carros', value: 'poucos_carros' },
      { label: 'Preço alto', value: 'preco' },
      { label: 'Demora', value: 'demora' },
      { label: 'Não vejo diferença', value: 'sem_diferenca' },
      { label: 'Nunca usei', value: 'nunca_usei' },
    ],
  },
  // Bloco 3 - Frustrações
  {
    id: 'frustrations',
    type: QuestionType.MULTI_SELECT,
    title: 'O que mais te incomoda ao usar Uber?',
    subtitle: 'Selecione até 3 opções',
    maxSelections: 3,
    options: [
      { label: 'Carros simples / velhos', value: 'carros_simples' },
      { label: 'Atendimento', value: 'atendimento' },
      { label: 'Falta de padrão de qualidade', value: 'falta_padrao' },
      { label: 'Cancelamentos', value: 'cancelamentos' },
      { label: 'Preço variável (Dinâmico)', value: 'preco_variavel' },
      { label: 'Demora para chegar', value: 'demora' },
      { label: 'Falta de opção premium', value: 'falta_premium' },
      { label: 'Outros', value: 'outros' },
    ],
  },
  {
    id: 'abandonment',
    type: QuestionType.SINGLE_SELECT,
    title: 'Você já deixou de pedir um carro por não encontrar uma opção adequada?',
    options: [
      { label: 'Sim', value: 'sim' },
      { label: 'Não', value: 'nao' },
      { label: 'Algumas vezes', value: 'algumas_vezes' },
    ],
  },
  // Bloco 4 - Validação Niva
  {
    id: 'niva_interest',
    type: QuestionType.SINGLE_SELECT,
    title: 'Se existisse um app premium focado em experiência e padrão elevado, você usaria?',
    options: [
      { label: 'Com certeza', value: 'com_certeza' },
      { label: 'Provavelmente', value: 'provavelmente' },
      { label: 'Talvez', value: 'talvez' },
      { label: 'Não vejo necessidade', value: 'sem_necessidade' },
    ],
  },
  {
    id: 'willingness_pay',
    type: QuestionType.MULTI_SELECT,
    title: 'Em quais situações você pagaria mais por um serviço melhor?',
    subtitle: 'Selecione todas que se aplicam',
    options: [
      { label: 'Eventos', value: 'eventos' },
      { label: 'Casamentos', value: 'casamentos' },
      { label: 'Reuniões importantes', value: 'reunioes' },
      { label: 'Aeroporto', value: 'aeroporto' },
      { label: 'Viagens noturnas', value: 'noite' },
      { label: 'Datas especiais', value: 'datas_especiais' },
      { label: 'Nunca', value: 'nunca' },
    ],
  },
  {
    id: 'drivers_switch',
    type: QuestionType.MULTI_SELECT,
    title: 'O que mais faria você trocar a Uber por outro app premium?',
    options: [
      { label: 'Qualidade dos carros', value: 'qualidade_carros' },
      { label: 'Motoristas profissionais', value: 'motoristas_pro' },
      { label: 'Menos cancelamentos', value: 'menos_cancelamentos' },
      { label: 'Preço previsível', value: 'preco_previsivel' },
      { label: 'Atendimento diferenciado', value: 'atendimento' },
      { label: 'Exclusividade', value: 'exclusividade' },
    ],
  },
  // Bloco 5 - Convite MVP
  {
    id: 'mvp_optin',
    type: QuestionType.SINGLE_SELECT,
    title: 'Você gostaria de testar o Niva em primeira mão?',
    options: [
      { label: 'Sim', value: 'sim' },
      { label: 'Talvez', value: 'talvez' },
      { label: 'Não', value: 'nao' },
    ],
  },
  // NEW: Name Field
  {
    id: 'name',
    type: QuestionType.INPUT_TEXT,
    title: 'Como podemos te chamar?',
    placeholder: 'Digite seu nome',
    required: true,
  },
  {
    id: 'whatsapp',
    type: QuestionType.INPUT_PHONE,
    title: 'WhatsApp para convite:',
    placeholder: '(00) 00000-0000',
    required: true,
  },
  // UPDATE: Email Required
  {
    id: 'email',
    type: QuestionType.INPUT_EMAIL,
    title: 'Qual seu melhor email?',
    placeholder: 'seu@email.com',
    required: true,
  },
  {
    id: 'end',
    type: QuestionType.END,
    title: 'Obrigado.',
    subtitle: 'Você entrou na lista de acesso antecipado do Niva.',
  }
];