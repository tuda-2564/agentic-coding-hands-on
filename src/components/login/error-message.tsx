type ErrorMessageProps = {
  message: string | null;
};

export default function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="max-w-[305px] mt-3 py-2 px-3 bg-red-500/15 border border-red-500/40 rounded-md text-sm font-medium leading-5 text-red-300"
    >
      {message}
    </div>
  );
}
