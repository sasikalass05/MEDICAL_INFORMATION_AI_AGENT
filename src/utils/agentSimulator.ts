export interface AgentTraceStep {
  tool: string;
  input: string;
  output: string;
}

export interface AgentSimulationResult {
  reply: string;
  traces: AgentTraceStep[];
  sources: string[];
}

const MEDICAL_KNOWLEDGE_DOCS = [
  {
    topic: 'hypertension',
    keywords: ['hypertension', 'blood pressure', 'bp', 'lisinopril', 'losartan', 'amlodipine'],
    content:
      'Hypertension: Diagnosed when systolic BP consistently >= 130 mmHg or diastolic >= 80 mmHg. First-line pharmacotherapy includes ACE inhibitors (Lisinopril 10-40mg daily), ARBs (Losartan 50-100mg daily), or Calcium Channel Blockers (Amlodipine 5-10mg daily). Lifestyle recommendations: Dietary sodium restriction (< 2,000 mg/day) and 150 minutes/week aerobic exercise.'
  },
  {
    topic: 'diabetes',
    keywords: ['diabetes', 'metformin', 'glucose', 'hba1c', 'sugar', 'insulin'],
    content:
      'Type 2 Diabetes Mellitus: Fasting plasma glucose >= 126 mg/dL or HbA1c >= 6.5%. First-line oral medication is Metformin (initial 500mg BID, titrated to 1000mg BID with meals). Target HbA1c < 7.0%. Requires regular renal monitoring (eGFR) and annual retinal/foot exams.'
  },
  {
    topic: 'asthma',
    keywords: ['asthma', 'inhaler', 'albuterol', 'salbutamol', 'breathing', 'wheezing', 'budesonide'],
    content:
      'Asthma & Acute Bronchospasm: Reversible airway obstruction. Acute relief: Short-Acting Beta Agonist (Albuterol / Salbutamol inhaler 2 puffs every 4-6 hours PRN). Maintenance therapy: Inhaled corticosteroids (Fluticasone, Budesonide) alone or with long-acting beta agonists.'
  },
  {
    topic: 'burns',
    keywords: ['burn', 'burns', 'scald', 'thermal', 'fire', 'first aid'],
    content:
      'Severe Acute Burns: Remove source of heat immediately. Cool burn wound under clean, cool running room-temperature water for 15-20 minutes. NEVER apply ice directly, butter, oil, or toothpaste. Cover loosely with sterile dressing. Seek urgent emergency care for burns to face, hands, feet, or genitals.'
  },
  {
    topic: 'heart attack',
    keywords: ['heart attack', 'myocardial', 'chest pain', 'cardiac', 'aspirin', 'infarction'],
    content:
      'Suspected Myocardial Infarction: Sudden crushing chest pressure, pain radiating to left arm/jaw/back, shortness of breath, diaphoresis. Immediate protocol: Call 911 immediately. Administer chewable Aspirin (325mg non-enteric) if not allergic. Keep patient resting quietly.'
  }
];

const COST_TABLE: Record<string, { gross: number; copay: number; type: 'procedure' | 'monthly_rx' }> = {
  'doctor visit': { gross: 180, copay: 35, type: 'procedure' },
  'specialist': { gross: 400, copay: 70, type: 'procedure' },
  'blood panel': { gross: 280, copay: 30, type: 'procedure' },
  'mri': { gross: 2200, copay: 450, type: 'procedure' },
  'ct scan': { gross: 1700, copay: 320, type: 'procedure' },
  'cataract surgery': { gross: 4200, copay: 750, type: 'procedure' },
  'metformin': { gross: 25 * 12, copay: 8 * 12, type: 'monthly_rx' },
  'lisinopril': { gross: 20 * 12, copay: 6 * 12, type: 'monthly_rx' },
  'albuterol': { gross: 70 * 12, copay: 25 * 12, type: 'monthly_rx' }
};

export function simulateMedicalAgent(query: string): AgentSimulationResult {
  const qLower = query.toLowerCase();
  const traces: AgentTraceStep[] = [];
  const sources: string[] = [];

  const matchedDocs = MEDICAL_KNOWLEDGE_DOCS.filter(doc =>
    doc.keywords.some(kw => qLower.includes(kw))
  );

  let ragOutput = '';
  if (matchedDocs.length > 0) {
    ragOutput = matchedDocs
      .map((d, i) => `[Source ${i + 1} - ${d.topic.toUpperCase()}]: ${d.content}`)
      .join('\n\n');
    matchedDocs.forEach(d => sources.push(d.topic));
    traces.push({
      tool: 'medical_knowledge_search',
      input: query,
      output: ragOutput
    });
  }

  // Check budget needs
  const budgetKeywords = ['cost', 'price', 'budget', 'insurance', 'copay', 'estimate', 'expensive', 'dollar', '$', 'fee', 'expense'];
  const hasBudgetIntent =
    budgetKeywords.some(kw => qLower.includes(kw)) ||
    Object.keys(COST_TABLE).some(k => qLower.includes(k));

  let budgetSummary = '';
  if (hasBudgetIntent) {
    let grossTotal = 0;
    let copayTotal = 0;
    const itemsFound: string[] = [];

    for (const [key, val] of Object.entries(COST_TABLE)) {
      if (qLower.includes(key)) {
        itemsFound.push(`• ${key.toUpperCase()}: Est. $${val.gross.toLocaleString()} gross | Copay: $${val.copay.toLocaleString()} (${val.type === 'monthly_rx' ? '12 Months' : 'per event'})`);
        grossTotal += val.gross;
        copayTotal += val.copay;
      }
    }

    if (itemsFound.length > 0) {
      budgetSummary = `Calculated items:\n${itemsFound.join('\n')}\n\nTotal Gross: $${grossTotal.toLocaleString()} | Out-of-Pocket Copay: $${copayTotal.toLocaleString()} | Potential Savings: $${(grossTotal - copayTotal).toLocaleString()}`;
    } else {
      budgetSummary = 'General medical estimate: Routine visit copay ~$30-$70; Diagnostic imaging copay ~$200-$500; Generic medications ~$5-$15/month.';
    }

    traces.push({
      tool: 'medical_budget_calculator',
      input: query,
      output: budgetSummary
    });
  }

  // Compose answer
  let reply = '';
  if (matchedDocs.length > 0 && hasBudgetIntent) {
    reply = `### 🏥 Clinical Guidance & Budget Assessment\n\n**Medical Protocol Insight:**\n${matchedDocs[0].content}\n\n**💰 Financial & Budget Estimate:**\n${budgetSummary}\n\n*⚠️ Medical Disclaimer: This information is derived from the clinical reference guide for educational and informational support. Always consult a licensed healthcare practitioner for medical diagnosis, treatment plans, and verified hospital insurance coverage.*`;
  } else if (matchedDocs.length > 0) {
    reply = `### 🏥 Medical Information & Protocol\n\n${matchedDocs.map(d => `**${d.topic.toUpperCase()} Guidelines:**\n${d.content}`).join('\n\n')}\n\n*⚠️ Medical Disclaimer: This information is derived from the loaded medical reference guide. It does not replace professional medical advice, clinical diagnosis, or emergency dispatch services.*`;
  } else if (hasBudgetIntent) {
    reply = `### 💰 Medical Budget Calculation\n\n${budgetSummary}\n\n*Tip: Always confirm in-network provider tiers, ask about generic prescription alternatives, and explore hospital financial hardship / charity care programs if uninsured.*`;
  } else {
    // General answer
    reply = `### 🏥 Medical Information Agent\n\nI searched the loaded clinical reference handbook for **"${query}"**.\n\nKey areas currently indexed in the vector database include:\n- **Hypertension & Blood Pressure** (Lisinopril, Losartan, lifestyle goals)\n- **Type 2 Diabetes Mellitus** (Metformin dosage, HbA1c targets)\n- **Asthma Management** (Albuterol rescue inhaler, inhaled corticosteroids)\n- **Emergency Triage** (Thermal burns first aid, suspected Myocardial Infarction)\n- **Medical Budget Calculator** (Surgeries, MRI, specialist consults, and medication costs)\n\n*⚠️ Medical Disclaimer: Always consult a certified healthcare professional for medical concerns.*`;
  }

  return { reply, traces, sources };
}
