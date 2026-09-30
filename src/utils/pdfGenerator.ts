import { jsPDF } from 'jspdf';

/**
 * Generates a clean, comprehensive Medical Reference Guide PDF matching the handbook in the notebook.
 */
export function generateMedicalGuidePdf(): jsPDF {
  const doc = new jsPDF({
    unit: 'pt',
    format: 'letter'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 45;

  // Header Banner
  doc.setFillColor(15, 118, 110); // Teal 700
  doc.rect(0, 0, pageWidth, 55, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('Clinical Medical Reference & Treatment Protocol Handbook', 40, 32);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(204, 251, 241);
  doc.text('Target Document for Medical Information Agent | RAG Knowledge Base | Colab 2026', 40, 47);

  y = 80;

  // Section 1
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(17, 94, 89);
  doc.text('1. Common Clinical Conditions & First-Line Protocols', 40, y);
  y += 18;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('Hypertension (High Blood Pressure):', 40, y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  const hypertensionText =
    'Diagnosed when systolic BP consistently >= 130 mmHg or diastolic >= 80 mmHg. First-line pharmacotherapy includes ACE inhibitors (Lisinopril 10-40mg daily), ARBs (Losartan 50-100mg daily), or Calcium Channel Blockers (Amlodipine 5-10mg daily). Lifestyle modification: dietary sodium restriction (< 2,000 mg/day) and 150 min/week moderate aerobic activity.';
  const lines1 = doc.splitTextToSize(hypertensionText, pageWidth - 80);
  doc.text(lines1, 40, y + 14);
  y += 14 + lines1.length * 13 + 10;

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Type 2 Diabetes Mellitus:', 40, y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  const diabetesText =
    'Diagnosed with fasting plasma glucose >= 126 mg/dL or HbA1c >= 6.5%. First-line oral agent is Metformin (initial 500mg BID, titrated to 1000mg BID taken with meals). Target HbA1c is < 7.0% for most adults. Routine renal function (eGFR) and annual diabetic retinal and foot exams are standard of care.';
  const lines2 = doc.splitTextToSize(diabetesText, pageWidth - 80);
  doc.text(lines2, 40, y + 14);
  y += 14 + lines2.length * 13 + 10;

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Asthma & Acute Bronchospasm:', 40, y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  const asthmaText =
    'Reversible bronchoconstriction characterized by wheezing and cough. Acute relief: Short-Acting Beta Agonist (Albuterol / Salbutamol inhaler 2 puffs every 4-6 hours as needed). Long-term control requires Inhaled Corticosteroid (Fluticasone, Budesonide) alone or with Formoterol.';
  const lines3 = doc.splitTextToSize(asthmaText, pageWidth - 80);
  doc.text(lines3, 40, y + 14);
  y += 14 + lines3.length * 13 + 18;

  // Section 2
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(17, 94, 89);
  doc.text('2. Emergency Triage & First Aid Protocols', 40, y);
  y += 18;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('Severe Acute Thermal Burns:', 40, y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  const burnText =
    'Immediately eliminate heat source. Flush burn area with cool or room-temperature clean running water for 15-20 minutes. NEVER apply ice, butter, grease, or toothpaste. Cover loosely with sterile, non-adherent dressing. Seek emergency medical care for any burns involving the face, hands, joints, or genitals.';
  const lines4 = doc.splitTextToSize(burnText, pageWidth - 80);
  doc.text(lines4, 40, y + 14);
  y += 14 + lines4.length * 13 + 10;

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Suspected Myocardial Infarction (Heart Attack):', 40, y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  const miText =
    'Symptoms: sudden crushing chest pressure, pain radiating to left arm/jaw/back, dyspnea, nausea, and diaphoresis. Immediate protocol: Call 911 / EMS immediately. Administer chewable Aspirin (325mg non-enteric) if no known contraindication or severe active bleeding. Position patient seated at rest.';
  const lines5 = doc.splitTextToSize(miText, pageWidth - 80);
  doc.text(lines5, 40, y + 14);
  y += 14 + lines5.length * 13 + 18;

  // Section 3: Cost Benchmarks Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(17, 94, 89);
  doc.text('3. Healthcare Procedure & Medication Budget Benchmark', 40, y);
  y += 16;

  // Table header
  doc.setFillColor(240, 253, 250);
  doc.rect(40, y, pageWidth - 80, 20, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 118, 110);
  doc.text('Procedure / Medication', 46, y + 14);
  doc.text('Gross Cash Est.', 230, y + 14);
  doc.text('Insurance Copay', 340, y + 14);
  doc.text('Generic Monthly Rx', 440, y + 14);
  y += 24;

  const tableRows = [
    ['General Consultation (PCP)', '$120 - $250', '$25 - $45', 'N/A'],
    ['Specialist Cardiology Visit', '$280 - $550', '$50 - $90', 'N/A'],
    ['Comprehensive Blood Panel (CBC, CMP)', '$180 - $400', '$15 - $50', 'N/A'],
    ['MRI Scan (Brain / Lumbar Spine)', '$1,200 - $3,400', '$250 - $600', 'N/A'],
    ['CT Scan with Contrast', '$950 - $2,600', '$200 - $450', 'N/A'],
    ['Cataract Surgery (Per eye)', '$3,500 - $5,200', '$450 - $1,100', 'Eyedrops: $30-$70'],
    ['Metformin 500mg (Monthly 60 tabs)', '$15 - $35', '$5 - $10', '$8 - $15'],
    ['Lisinopril 10mg (Monthly 30 tabs)', '$12 - $28', '$4 - $10', '$5 - $12'],
    ['Albuterol Inhaler (Canister 8.5g)', '$45 - $95', '$15 - $30', '$25 - $40']
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);

  tableRows.forEach((row, i) => {
    if (i % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(40, y - 2, pageWidth - 80, 15, 'F');
    }
    doc.text(row[0], 46, y + 9);
    doc.text(row[1], 230, y + 9);
    doc.text(row[2], 340, y + 9);
    doc.text(row[3], 440, y + 9);
    y += 16;
  });

  y += 12;

  // Footer Disclaimer
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(
    'Clinical Safety Disclaimer: This reference guide is prepared for AI agent RAG retrieval and educational simulation.',
    40,
    y
  );
  doc.text(
    'It does not substitute for qualified clinical evaluation, physician judgment, or emergency intervention.',
    40,
    y + 11
  );

  return doc;
}

export function downloadMedicalGuidePdf() {
  const doc = generateMedicalGuidePdf();
  doc.save('medical_reference_guide.pdf');
}
