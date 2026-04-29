export default function Spinner({ text = 'Loading…' }) {
  return (
    <div className="loader">
      <span className="spinner"></span> {text}
    </div>
  );
}
