import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren<{}>) {
  return (
    <div className="m-4">
      <div className="text-xl text-center mb-2">Hurdle, overcoming Wordle</div>
      {children}
    </div>
  );
}
