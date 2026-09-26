type DecorativeBackgroundProps = {
  rounded?: boolean;
};

export default function DecorativeBackground({
  rounded = false,
}: DecorativeBackgroundProps) {
  return (
    <>
      <div
        aria-hidden="true"
        className={`absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.35),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(234,88,12,0.2),_transparent_30%)] ${
          rounded ? "rounded-3xl" : ""
        }`}
      />

      <div
        aria-hidden="true"
        className={`absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px] ${
          rounded ? "rounded-3xl" : ""
        }`}
      />
    </>
  );
}