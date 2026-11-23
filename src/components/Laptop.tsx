// A laptop drawn in CSS: the screen (with a little app window inside) and the
// keyboard base below. Used on the Ary 1.0 page so the chat feels like it is
// open on your own laptop.
export default function Laptop({
  title = "Ary 1.0 · your content agent",
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-6xl">
      {/* Lid with its dark bezel */}
      <div className="relative mx-auto w-[calc(100%-1rem)] rounded-t-[18px] bg-[#1d1719] p-[7px] pt-[18px] shadow-[0_30px_60px_-30px_rgba(54,33,27,0.55)] sm:w-[calc(100%-4rem)] sm:rounded-t-[26px] sm:p-3 sm:pt-6">
        {/* Camera */}
        <span aria-hidden="true" className="absolute left-1/2 top-[6px] h-[6px] w-[6px] -translate-x-1/2 rounded-full bg-[#3a3134] ring-1 ring-[#4b4245] sm:top-[9px] sm:h-2 sm:w-2" />

        {/* The screen: an app window */}
        <div className="overflow-hidden rounded-[6px] bg-cream sm:rounded-[8px]">
          <div className="flex items-center gap-1.5 border-b border-cocoa/15 bg-paper px-3 py-2 sm:px-4 sm:py-2.5">
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[#c79f9b]" />
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[#e9c85b]" />
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[#b9c8f2]" />
            <p className="flex-1 truncate pr-10 text-center text-[0.55rem] uppercase tracking-[0.25em] text-cocoa/60 sm:text-[0.6rem]">
              {title}
            </p>
          </div>
          <div className="p-3 sm:p-6 md:p-8">{children}</div>
        </div>
      </div>

      {/* Keyboard base, with the thumb notch for opening the lid */}
      <div aria-hidden="true" className="relative">
        <div className="h-3 rounded-b-[14px] rounded-t-[3px] bg-gradient-to-b from-[#e4d8c8] via-[#cbbba7] to-[#a08c76] shadow-[0_14px_24px_-12px_rgba(54,33,27,0.5)] sm:h-5 sm:rounded-b-[22px]" />
        <span className="absolute left-1/2 top-0 h-1.5 w-20 -translate-x-1/2 rounded-b-[8px] bg-[#b3a28d] sm:h-2 sm:w-32" />
      </div>
    </div>
  );
}
