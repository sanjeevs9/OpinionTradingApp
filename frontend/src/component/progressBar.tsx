
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
    <div className="p-5 flex items-center justify-between border-b">
      <span className="flex flex-col items-center">
        <img
          className="object-contain rounded-[50%]"
          width={45}
          height={45}
          src={userIcon}
          alt="user"
        />
        <p className="text-xs mt-2">{userNames[0]}</p>
      </span>
      <div className="w-[60%] flex flex-col items-center">
      <div className="border rounded-md flex h-9 w-full overflow-hidden">
        <div
          className="flex items-center justify-start pl-4 font-bold text-xs text-[#165BB7]"
          style={{
            width: `${percent1}%`,
            backgroundColor: "#BBD8FE",
          }}
        >
          ₹{value1}
        </div>
        <div
          className="flex items-center justify-end pr-4 text-xs font-bold text-[#C03D3D]"
          style={{
            width: `${percent2}%`,
            backgroundColor: "#FDE8E9",
          }}
        >
          ₹{value2}
        </div>
      </div>
        <span className="mt-2 text-xs text-[#B3B3B3]">a few second ago</span>
      </div>
      <span className="flex flex-col items-center">
        <img
          className="object-contain rounded-[50%]"
          width={45}
          height={45}
          src={userIcon}
          alt="user"
        />
        <p className="text-xs mt-2">{userNames[1]}</p>
      </span>
    </div>
  );
};
