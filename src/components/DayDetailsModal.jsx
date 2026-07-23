function DayDetailsModal({ item, onClose }) {
  if (!item) {
    return null;
  }

  const notes = item.isOvulationDay
    ? 'Peak fertility day. Track cervical mucus, basal temperature, or symptoms if you are trying to conceive.'
    : item.day >= 1 && item.day <= 6
      ? 'Rest and hydrate during your period. Keep comfort and recovery in focus.'
      : item.day >= 11 && item.day <= 16
        ? 'Energy and mood may shift as fertility rises. A calm routine can help.'
        : item.day >= 17 && item.day <= 30
          ? 'The luteal phase may bring more sensitivity. A steady routine can feel grounding.'
          : 'A quiet day to stay in tune with your body and energy.';

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div className="modal-card" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <p className="eyebrow">Day details</p>
            <h3>Day {item.day}</h3>
          </div>
          <button type="button" className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-grid">
            <div>
              <span className="modal-label">Cycle Day</span>
              <strong>{item.day}</strong>
            </div>
            <div>
              <span className="modal-label">Full Date</span>
              <strong>{item.calendarDate}</strong>
            </div>
            <div>
              <span className="modal-label">Day of Week</span>
              <strong>{item.weekday}</strong>
            </div>
            <div>
              <span className="modal-label">Phase</span>
              <strong>{item.phase}</strong>
            </div>
            <div>
              <span className="modal-label">Fertility Status</span>
              <strong>{item.fertility}</strong>
            </div>
            <div>
              <span className="modal-label">Current Day</span>
              <strong>{item.isCurrentDay ? 'Yes' : 'No'}</strong>
            </div>
          </div>

          <div className="modal-description">
            <span className="modal-label">Body summary</span>
            <p>{item.description}</p>
          </div>

          <div className="modal-notes">
            <span className="modal-label">Notes</span>
            <p>{notes}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DayDetailsModal;
