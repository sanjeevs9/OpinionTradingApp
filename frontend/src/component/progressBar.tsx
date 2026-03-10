
export const ProgressBar = ({
  value1,
  value2,
  userIcon,
  userNames,
}: {
  value1: number;
  value2: number;
  userIcon: any;
  userNames: string[];
}) => {
  const total = value1 + value2;
  const percent1 = (value1 / total) * 100;
  const percent2 = (value2 / total) * 100;

  return (
    <div className="py-4 flex items-center justify-between border-b border-slate-100 last:border-0">
      <span className="flex flex-col items-center w-16">
        <img
          className="object-cover rounded-full ring-2 ring-slate-100"
          width={36}
          height={36}
          src={userIcon}
          alt="user"
        />
        <p className="text-xs text-slate-500 mt-1.5">{userNames[0]}</p>
      </span>
      <div className="flex-1 mx-4 flex flex-col items-center">
        <div className="rounded-lg flex h-8 w-full overflow-hidden">
          <div
            className="flex items-center justify-start pl-3 font-semibold text-xs text-yes"
            style={{
              width: `${percent1}%`,
              backgroundColor: "var(--color-yes-mid)",
            }}
          >
            ₹{value1}
          </div>
          <div
            className="flex items-center justify-end pr-3 text-xs font-semibold text-no"
            style={{
              width: `${percent2}%`,
              backgroundColor: "var(--color-no-mid)",
            }}
          >
            ₹{value2}
          </div>
        </div>
        <span className="mt-1.5 text-[11px] text-slate-300">a few seconds ago</span>
      </div>
      <span className="flex flex-col items-center w-16">
        <img
          className="object-cover rounded-full ring-2 ring-slate-100"
          width={36}
          height={36}
          src={userIcon}
          alt="user"
        />
        <p className="text-xs text-slate-500 mt-1.5">{userNames[1]}</p>
      </span>
    </div>
  );
};
