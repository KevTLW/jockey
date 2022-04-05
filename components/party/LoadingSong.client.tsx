interface LoadingSongProps {
  amount: number;
  className?: string;
}

export const LoadingSong = ({ amount, className }: LoadingSongProps) => {
  return (
    <ul className={`mx-auto w-full max-w-xl space-y-4 ${className}`}>
      {Array.from({ length: amount }, (_, i) => i).map((key) => (
        <li
          key={key}
          className="animate-pulse gap-2 rounded bg-sky-900 p-4 text-slate-50 shadow-xl shadow-sky-500/25 transition [animation-delay:500ms] first:[animation-delay:250ms] last:[animation-delay:750ms] dark:bg-slate-50 dark:text-slate-900 dark:shadow-sky-300/25 sm:grid sm:grid-cols-[120px_auto]  sm:p-0"
        >
          <div className="mx-auto flex h-[200px] w-[200px] animate-pulse bg-slate-300 sm:h-[120px] sm:w-[120px]"></div>

          <div className="mx-auto mt-2 flex flex-col items-center justify-center overflow-hidden text-center sm:mx-0 sm:mt-0 sm:items-start sm:text-left">
            <h2 className="w-fit animate-pulse truncate rounded bg-slate-300 text-2xl font-bold text-transparent">
              lorem ipsum dolor
            </h2>
            <h3 className="mt-2 w-fit animate-pulse truncate rounded bg-slate-300 text-lg font-semibold text-transparent">
              lorem ipsum dolor
            </h3>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default LoadingSong;
