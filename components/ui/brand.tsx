interface BrandProps {
  accent: string;
  primary: string;
}

export default function Brand({ accent, primary }: BrandProps) {
  return (
    <>
      <span className={primary}>j</span>
      <span className={accent}>o</span>
      <span className={primary}>ckey</span>
    </>
  );
}
