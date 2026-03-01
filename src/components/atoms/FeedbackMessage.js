function FeedbackMessage({ children, tone = 'neutral' }) {
  return <p className={`feedback-message feedback-message-${tone}`}>{children}</p>;
}

export default FeedbackMessage;
