const toneClassMap = {
  menstrual: 'phase-badge--menstrual',
  follicular: 'phase-badge--follicular',
  fertile: 'phase-badge--fertile',
  ovulation: 'phase-badge--ovulation',
  luteal: 'phase-badge--luteal'
};

const getTone = (label) => {
  if (!label) {
    return 'follicular';
  }

  if (label.includes('Menstrual')) {
    return 'menstrual';
  }

  if (label.includes('Fertile')) {
    return 'fertile';
  }

  if (label.includes('Ovulation')) {
    return 'ovulation';
  }

  if (label.includes('Luteal')) {
    return 'luteal';
  }

  return 'follicular';
};

function PhaseBadge({ label, compact = false }) {
  const tone = getTone(label);

  return (
    <span className={`phase-badge ${toneClassMap[tone]} ${compact ? 'phase-badge--compact' : ''}`}>
      {label}
    </span>
  );
}

export default PhaseBadge;
