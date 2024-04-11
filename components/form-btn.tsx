interface IFormBtn {
  loading: boolean;
  text: string;
}
export default function FormButton({ loading, text }: IFormBtn) {
  return (
    <button
      className="primary-btn h-10 disabled:bg-neutral-400 disabled:text-neutral-300 disabled:cursor-not-allowed"
      disabled={loading}
    >
      {loading ? "Loading..." : text}
    </button>
  );
}
